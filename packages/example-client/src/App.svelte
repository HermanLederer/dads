<script lang="ts">
  import { onMount } from "svelte";
  import type { Pinpon } from "pinpon-common/Pinpon";

  // Import componenets
  import Post from "./lib/Post.svelte";

  // DADS
  let dads = {
    shelfcopy: "",
    key: "",
  };

  // Loading pinpons from the backend
  let pinpons: Pinpon[] = [];

  async function loadPinpons() {
    const res = await fetch(
      `http://localhost:8000/pinpons?shelfcopy=${dads.shelfcopy}&key=${dads.key}`
    );
    pinpons = (await res.json()).pinpons;
  }

  // Load pinpons when the app is mounted
  onMount(loadPinpons);
</script>

<header>
  <h1>PinPon</h1>
  <form on:submit|preventDefault={loadPinpons}>
    <label for="shelf-location">Shelfcopy location</label>
    <input type="text" id="dads-shelfcopy" bind:value={dads.shelfcopy} />
    <br />

    <label for="shelf-location">Decryption key</label>
    <input type="text" id="dads-key" bind:value={dads.key} />
    <br />

    <input type="submit" value="Go" />
  </form>
</header>
<main>
  {#each pinpons as post}
    <Post content={post} />
  {/each}
</main>
