<script lang="ts" context="module">
  export type PostContent = {
    title: string;
    text: string;
  };
</script>

<script lang="ts">
  export let content: PostContent;
</script>

<article>
  <h3>{content.title}</h3>
  <p>{content.text}</p>
</article>
