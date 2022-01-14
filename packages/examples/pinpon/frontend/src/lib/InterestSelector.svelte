<script lang="ts" context="module">
  import type { Interest } from "pinpon-common/Interest";
</script>

<script lang="ts">
  import { dads } from "../dads";

  export let interests: Interest[];
  export let selected: Interest[] = [];
</script>

<header>
  <h2>Interests</h2>
  <!-- <button>Update</button> -->
</header>

{#each interests as interest}
  <button
    class="interest"
    class:is-selected={selected.includes(interest)}
    on:click={async () => {
      // Save
      try {
        await dads.saveToShelf("pinpon-interests", selected.join(", "));

        // Update locally
        let i = selected.indexOf(interest);
        if (i >= 0) {
          selected = selected.filter((e) => e != interest);
        } else {
          selected = [...selected, interest];
        }
      } catch (e) {
        alert("Failed to save preferences")
      }
    }}>{interest}</button
  >
{/each}

<style lang="scss">
  @import "../resources/all.scss";

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin-bottom: 1.5rem;
    }
  }

  .interest {
    margin-top: 0.5rem;
    margin-right: 0.5rem;

    &.is-selected {
      background: $color-fg;
      color: mix($color-bg, transparent, 100%);
    }
  }
</style>
