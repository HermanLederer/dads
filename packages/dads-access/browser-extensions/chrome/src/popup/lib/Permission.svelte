<script lang="ts">
  import { store } from "../store";
  import type { State } from "../State";

  let state: State;
  store.subscribe((value) => {
    state = value;
  });

  let shelfContent: string | null = null;

  async function fetchShelfData() {
    let res: Response;

    // Get shelfcopy
    res = await fetch(
      `${state.options.network}/shelfcopy?vault=${state.options.vault}&shelf=${state.description}`
    );
    const shelfcopy = await res.text();

    // Load shelfcopy data
    res = await fetch(`${state.options.network}/shelfcopies/${shelfcopy}`);
    shelfContent = await res.text();
  }
</script>

<section>
  <h2>Permission</h2>
  <p>
    Application would like to get a copy of <strong>{state.description}</strong>
    shelf
  </p>

  <aside id="shelf-contents">
    {#if shelfContent}
      <div class="inside">
        <h3>Inside <strong>{state.description}</strong>:</h3>
        <p>{shelfContent}</p>
      </div>
    {:else}
      <button
        class="whats-inside"
        on:click={() => {
          fetchShelfData();
        }}>What's inside {state.description}?</button
      >
    {/if}
  </aside>

  <button
    on:click={() => {
      window.port.postMessage({
        target: "dads-access",
        event: "permission",
        data: "grant",
      });
      window.close();
    }}>Grant</button
  >
  <button
    on:click={() => {
      window.port.postMessage({
        target: "dads-access",
        event: "permission",
        data: "deny",
      });
      window.close();
    }}>Deny</button
  >
</section>

<style lang="scss">
  @import "../resources/scss/all.scss";

  section {
    & > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  a {
    display: block;
  }

  .whats-inside {
    height: auto;
    padding: 0;

    background: none;
    color: $theme;

    text-align: left;
    text-decoration: underline;
  }

  .inside {
    width: calc(100% + 4rem);
    margin: 0 -2rem;
    padding: 2rem;

    background: mix($theme, $background-base, 20%);
    color: mix($theme, $foreground-base, 80%);

    font-weight: 600;

    & > *:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    h3 {
      color: mix(mix($theme, $foreground-base, 20%), transparent, 40%);
      font-weight: 400;
      font-size: 1rem;

      strong {
        font-weight: 600;
      }
    }
  }
</style>
