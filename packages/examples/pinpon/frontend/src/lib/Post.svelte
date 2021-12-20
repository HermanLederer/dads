<script lang="ts">
  import type { Pinpon } from "pinpon-common/Pinpon";
  export let content: Pinpon;
</script>

<article>
  <h3>{content.title}</h3>
  <p>{content.text}</p>
</article>
