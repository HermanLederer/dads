<script lang="ts">
  import Options from "./lib/Options.svelte";
  import Permission from "./lib/Permission.svelte";

  import { store } from "./store";
  import type { StoreState } from "./StoreState";

  let state: StoreState;
  store.subscribe((value) => {
    state = value;
  });

  window.port = chrome.runtime.connect({ name: "popup" });

  window.port.onMessage.addListener((msg) => {
    if (msg.target && msg.target === "dads-access")
      if (msg.event && msg.event === "update-state")
        if (msg.state) {
          store.set(Object.assign(state, { systemState: msg.state }));
        }
  });
</script>

<header>
  <h1>DADS Access</h1>
</header>
{#if state.systemState.state === "permission-read"}
  <Permission write={false} />
{:else if state.systemState.state === "permission-write"}
  <Permission write={true} />
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
