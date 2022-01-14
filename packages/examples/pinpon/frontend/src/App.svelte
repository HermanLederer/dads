<script lang="ts">
  import type { Pinpon } from "pinpon-common/Pinpon";
  import type { Interest } from "pinpon-common/Interest";
  import { interests } from "pinpon-common/Interest";
  import { dads } from "./dads";
  import { interests as userInterests } from "./stores";

  //
  // Import componenets

  import Grid from "./lib/MasonryGrid.svelte";
  import Post from "./lib/Post.svelte";
  import Selector from "./lib/InterestSelector.svelte";

  let refreshLayout;

  //
  // Interests

  let selectedInterests: Interest[];
  userInterests.subscribe((value) => {
    selectedInterests = value;
  });

  async function loadInterests() {
    userInterests.set([]);
    try {
      const shelfcopy = await dads.getShelfcopy("pinpon-interests");
      const loadedInterests = await (
        await fetch(`http://localhost:3132/shelfcopies/${shelfcopy}`)
      ).text();
      userInterests.set(loadedInterests.split(",") as Interest[]);
    } catch (err) {}
  }

  //
  // Pinpons

  let pinpons: Pinpon[] = [];

  async function loadPinpons() {
    pinpons = [];

    try {
      const res = await fetch(
        `http://localhost:8000/pinpons?interests=${selectedInterests.join(",")}`
      );
      pinpons = (await res.json()).pinpons;
    } catch (e) {
      const res = await fetch(`http://localhost:8000/pinpons`);
      pinpons = (await res.json()).pinpons;
    }
  }

  //
  // Load pinpons when window is loaded
  // dads api is not available before that

  window.addEventListener("load", async () => {
    await loadInterests();
    loadPinpons();
  });
</script>

<div class="app">
  <main>
    <header>
      <h1>PinPon</h1>
      <!-- <ul>
        <li><button /></li>
        <li><button /></li>
        <li><button /></li>
      </ul> -->
    </header>
    <div class="scroll">
      <Grid gridGap="1rem;" items={pinpons} bind:refreshLayout>
        {#each pinpons as post}
          <Post
            content={post}
            on:load={() => {
              refreshLayout();
              console.log(1);
            }}
          />
        {/each}
      </Grid>
    </div>
  </main>

  <aside>
    <Selector interests={[...interests]} on:update={loadPinpons} />
  </aside>
</div>

<style lang="scss">
  @import "./resources/all.scss";

  .app {
    height: 100vh;
    display: grid;
    grid-template-columns: auto 20rem;

    main {
      .scroll {
        height: calc(100vh - 5rem - 1px);
        overflow: hidden;
        overflow-y: scroll;
      }

      header {
        padding: 0 1rem;

        border-bottom: 1px solid mix($color-fg, $color-bg, 10%);

        display: flex;
        align-items: center;
        justify-content: space-between;

        // ul {
        //   list-style: none;
        //   display: flex;
        // }

        // button {
        //   min-width: 2rem;
        //   height: 2rem;
        //   margin-left: 0.5rem;
        // }
      }
    }

    aside {
      padding: 0 1rem;
      border-left: 1px solid mix($color-fg, $color-bg, 10%);
    }
  }
</style>
