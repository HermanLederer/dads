import type { Interest } from "pinpon-common/Interest";
import { writable } from "svelte/store";

export const interests = writable<Interest[]>([]);
