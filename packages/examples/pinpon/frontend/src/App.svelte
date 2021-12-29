<script lang="ts">
  import type { Pinpon } from "pinpon-common/Pinpon";
  import { dads } from "./dads";

  //
  // Import componenets

  import Grid from "svelte-masonry/Masonry.svelte";
  import Post from "./lib/Post.svelte";
  import Selector from "./lib/InterestSelector.svelte";

  //
  // Pinpons

  let pinpons: Pinpon[] = [];

  async function loadPinpons() {
    pinpons = [];

    try {
      throw new Error("tmp");

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

<div class="app">
  <main>
    <header>
      <h1>PinPon</h1>
    </header>
    <Grid gridGap="1rem;">
      {#each pinpons as post}
        <Post content={post} />
      {/each}
    </Grid>
  </main>

  <aside>
    <Selector
      interests={["Test", "Future", "Future", "Future", "Future", "Future"]}
    />
  </aside>
</div>

<style lang="scss">
  @import "./resources/all.scss";

  .app {
    height: 100vh;
    display: grid;
    grid-template-columns: auto 20rem;

    main {
      // padding: 0 1rem;
      // background: mix($color-bg, $color-fg, 95%);

      header {
        padding: 0 1rem;

        border-bottom: 1px solid mix($color-fg, $color-bg, 10%);
      }
    }

    aside {
      padding: 0 1rem;
      border-left: 1px solid mix($color-fg, $color-bg, 10%);
    }
  }
</style>
