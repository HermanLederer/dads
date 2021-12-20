<script lang="ts">
  import type { Pinpon } from "pinpon-common/Pinpon";
  import { dads } from "./dads";

  //
  // Import componenets

  import Post from "./lib/Post.svelte";

  //
  // Pinpons

  let pinpons: Pinpon[] = [];

  async function loadPinpons() {
    try {
      //
      // Attempt to get a shelfcopy of pinpon-interests
      // and load pinpons with that shelfcopy

      const shelfcopy = await dads.getShelfcopy("pinpon-interests");
      const res = await fetch(
        `http://localhost:8000/pinpons?shelfcopy=${shelfcopy}`
      );
      pinpons = (await res.json()).pinpons;
    } catch (e) {
      //
      // Shelfcopy was not retreived
      // load general pinpons and display a warning

      const res = await fetch(`http://localhost:8000/pinpons`);
      pinpons = (await res.json()).pinpons;
    }
  }

  //
  // Load pinpons when window is loaded
  // dads api is not available before that

  window.addEventListener("load", loadPinpons);
</script>

<header>
  <h1>PinPon</h1>
</header>
<main>
  <button on:click={loadPinpons}>Refresh</button>
  {#each pinpons as post}
    <Post content={post} />
  {/each}
</main>
