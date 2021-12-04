<script lang="ts">
  import Post from "./lib/Post.svelte";
  import type { PostContent } from "./lib/Post.svelte";

  const posts: PostContent[] = [
    {
      title: "Title",
      text: "Lorem ipum",
    },
    {
      title: "Title 2",
      text: "Lorem ipum sdfgnjdfigu hseilruhg ioaweyghrt aehrguyaekj",
    },
    {
      title: "Title",
      text: "Lorem ipuse rfsdfzsdfm",
    },
    {
      title: "Title",
      text: "Lorem 23423 fdgsdfgsdfg sdfg sdgd",
    },
  ];
</script>

<header>
  <h1>PinPon</h1>
</header>
<main>
  {#each posts as post}
    <Post content={post} />
  {/each}
</main>
