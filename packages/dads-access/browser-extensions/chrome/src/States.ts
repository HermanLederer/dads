export type StateIdle = {
  state: "idle";
};

export type StatePermissionRead = {
  state: "permission-read";
  shelf: string;
};

export type StatePermissionWrite = {
  state: "permission-write";
  shelf: string;
  newData: string;
};

export type State = StateIdle | StatePermissionRead | StatePermissionWrite;
