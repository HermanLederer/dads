<script lang="ts">
  import { onMount } from "svelte";
  import type { Pinpon } from "pinpon-common/Pinpon";

  // Import componenets
  import Post from "./lib/Post.svelte";

  // DADS API
  let DADS = {
    vault: "hasncvosd673950",
    async getShelfcopy(shelf: string): Promise<string> {
      const v = prompt(
        `This website wants to access the shelf ${shelf} in your DADS vault. \n\nDADS ID: `,
        this.vault
      );
      console.log(v);
      if (v) {
        const res = await fetch(
          `http://localhost:3132/shelfcopy?vault=${v}&shelf=${shelf}`
        );
        return await res.text();
      } else return null;
    },
    getShelfContent(shelfcopy: string) {
      return fetch(`http://localhost:3132/shelfcopies/${shelfcopy}`);
    },
  };

  // User interests
  let interestShelfcopy: string;

  async function getInterests() {
    interestShelfcopy = await DADS.getShelfcopy("pinpon-interests");
  }

  // Loading pinpons from the backend
  let pinpons: Pinpon[] = [];

  async function loadPinpons() {
    let res: Response;
    if (interestShelfcopy) {
      res = await fetch(
        `http://localhost:8000/pinpons?shelfcopy=${interestShelfcopy}`
      );
    } else {
      res = await fetch(`http://localhost:8000/pinpons`);
    }
    pinpons = (await res.json()).pinpons;
  }

  // Load pinpons when the app is mounted
  onMount(async () => {
    await getInterests();
    loadPinpons();
  });
</script>

<header>
  <h1>PinPon</h1>
</header>
<main>
  {#each pinpons as post}
    <Post content={post} />
  {/each}
</main>
