import { writable } from "svelte/store";
import type { StoreState } from "./StoreState";

export const store = writable<StoreState>({
  systemState: {
    state: "idle",
  },
  options: {
    network: "",
    vault: "",
  },
});
