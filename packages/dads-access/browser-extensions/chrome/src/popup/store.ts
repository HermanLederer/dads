import { writable } from "svelte/store";
import type {State} from "./State"

export const store = writable<State>({
  state: "idle",
  description: "",
  options: {
    network: "",
    vault: "",
  }
});
