<script lang="ts">
  import { store } from "../store";
  import type { StoreState } from "../StoreState";

  let state: StoreState | null = null;
  store.subscribe((value) => {
    state = value;
  });

  function loadOptions() {
    let partialState: Partial<StoreState> = {
      options: {
        network: "",
        vault: "",
      },
    };

    chrome.storage.sync.get("network", ({ network }) => {
      partialState.options.network = network;
    });

    chrome.storage.sync.get("vault", ({ vault }) => {
      partialState.options.vault = vault;
    });
    console.log(state);

    console.log(partialState);

    store.set(Object.assign(state, partialState));

    console.log(state);
  }
  loadOptions();

  function submit() {
    chrome.storage.sync.set({
      network: state.options.network,
      vault: state.options.vault,
    });
  }
</script>

<form on:submit|preventDefault={submit}>
  <h2>Your vault</h2>

  {#if state}
    <label for="network">Network address</label>
    <input type="text" name="network" bind:value={state.options.network} />

    <label for="vault">Your vault</label>
    <input type="text" name="vault" bind:value={state.options.vault} />
    <p class="hint">Do not share this with anyone!</p>

    <input type="submit" value="Apply" />
  {:else}
    <p>Loading...</p>
  {/if}
</form>

<style lang="scss">
  @import "../resources/scss/all.scss";

  form {
    position: relative;

    & > * {
      margin-bottom: 1rem;
    }

    & > *:last-child {
      margin-bottom: 0;
    }
  }

  label {
    margin: 0;
    color: inherit;
    pointer-events: none;
  }

  .hint {
    opacity: 0.6;
    font-size: 0.8rem;
  }
</style>
