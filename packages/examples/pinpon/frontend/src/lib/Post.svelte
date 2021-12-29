<script lang="ts">
  import type { Pinpon } from "pinpon-common/Pinpon";
  export let content: Pinpon;
</script>

<article>
  <h3>{content.title}</h3>
  <p>{content.text}</p>
</article>

<style lang="scss">
  @import "../resources/all.scss";

  article {
    padding: 2rem;
    border-radius: 2rem;

    background: mix($color-fg, transparent, 5%);

    h3 {
      color: mix($color-fg, transparent, 100%);
    }

    p {
      color: mix($color-fg, transparent, 60%);
    }
  }
</style>
