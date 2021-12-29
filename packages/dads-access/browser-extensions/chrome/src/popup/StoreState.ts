import type { State } from "src/States";

export type StoreState = {
  systemState: State;
  options: {
    network: string;
    vault: string;
  };
};
