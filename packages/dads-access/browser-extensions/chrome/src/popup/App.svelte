<script lang="ts">
  import Options from "./lib/Options.svelte";
  import Permission from "./lib/Permission.svelte";

  import { state } from "./store";
  let state_value;
  state.subscribe((value) => {
    state_value = value;
  });

  window.port = chrome.runtime.connect({ name: "popup" });

  window.port.onMessage.addListener((msg) => {
    console.log(msg);
    if (msg.target && msg.target === "dads-access")
      if (msg.event && msg.event === "update-state")
        if (msg.state) {
          state.set(msg.state);
        }
  });
</script>

<header>
  <h1>DADS Access</h1>
</header>
{#if state_value.state === "permission"}
  <Permission />
{:else}
  <Options />
{/if}

<style lang="scss">
  @import "./resources/scss/all.scss";
  @import "./global.scss";

  h1 {
    margin-bottom: 2rem;
    color: mix($theme, $foreground-base, 40%);
    opacity: 0.4;
  }
</style>
