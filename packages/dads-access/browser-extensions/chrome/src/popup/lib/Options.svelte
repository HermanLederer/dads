<script lang="ts">
  const data = {
    network: "",
    vault: "",
  };

  chrome.storage.sync.get("network", ({ network }) => {
    data.network = network;
  });

  chrome.storage.sync.get("vault", ({ vault }) => {
    data.vault = vault;
  });

  function submit() {
    chrome.storage.sync.set({
      network: data.network,
      vault: data.vault,
    });
  }
</script>

<form on:submit|preventDefault={submit}>
  <h2>Your vault</h2>

  <label for="network">Network address</label>
  <input type="text" name="network" bind:value={data.network} />

  <label for="vault">Your vault</label>
  <input type="text" name="vault" bind:value={data.vault} />
  <p class="hint">Do not share this with anyone!</p>

  <input type="submit" value="Apply" />
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

    & > h1 {
      margin-bottom: 2rem;
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
