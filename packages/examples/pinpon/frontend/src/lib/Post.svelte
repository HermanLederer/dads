<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Pinpon } from "pinpon-common/Pinpon";
  import { interests } from "pinpon-common/Interest";
  export let content: Pinpon;

  const dispatch = createEventDispatcher();
</script>

<article>
  <div class="content" style={`height: ${200 + Math.random() * 300}px;`} />

  <div class="meta">
    <h3>{content.title}</h3>
    <!-- <p>{content.text}</p> -->
    <!-- <ul>
      {#each content.interests as interest}
        <li>{interest}</li>
      {/each}
    </ul> -->
  </div>
</article>

<style lang="scss">
  @import "../resources/all.scss";

  article {
    border-radius: 1rem;
    cursor: pointer;

    &:hover {
      background: mix($color-fg, transparent, 1%);

      .content {
        transform: scale(0.99);
      }
    }

    .content {
      margin-bottom: 1rem;

      background: mix($color-fg, $color-bg, 20%);
      border-radius: 1rem;

      transition: $trans-med;
    }

    .meta {
      padding: 0 2rem;

      h3 {
        margin-bottom: 1rem;
        color: mix($color-fg, transparent, 100%);
        font-size: 1rem;
      }

      p {
        margin-bottom: 0.5rem;
        color: mix($color-fg, transparent, 60%);
      }

      ul {
        margin-top: -0.5rem;
        list-style: none;

        li {
          margin-top: 0.5rem;
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;

          background: mix($color-fg, transparent, 10%);
          color: mix($color-fg, transparent, 80%);
          border-radius: 1rem;
          font-size: 0.8rem;

          display: inline-block;
        }
      }
    }
  }
</style>
