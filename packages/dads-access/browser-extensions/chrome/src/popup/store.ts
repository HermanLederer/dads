import { writable } from "svelte/store";

export const state = writable({
  state: "idle",
  description: "",
});
