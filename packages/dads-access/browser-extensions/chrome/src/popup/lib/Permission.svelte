<script lang="ts">
  import { state } from "../store";
  let state_value;
  state.subscribe((value) => {
    state_value = value;
  });
</script>

<section>
  <h2>Permission</h2>
  <p>Application would like to get a copy of {state_value.description}</p>
  <a href="/">What's in that shelf?</a>
  <button
    on:click={() => {
      window.port.postMessage({
        target: "dads-access",
        event: "permission",
        data: "grant",
      });
    }}>Grant</button
  >
  <button
    on:click={() => {
      window.port.postMessage({
        target: "dads-access",
        event: "permission",
        data: "deny",
      });
    }}>Deny</button
  >
</section>

<style lang="scss">
  section {
    & > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  a {
    display: block;
  }
</style>
