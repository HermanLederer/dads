import type { State } from "../States";

let n = "http://localhost:3132";
let v = "000000000000000";

// Save default values on install

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ network: n, vault: v });
});

function reloadData() {
  chrome.storage.sync.get("network", ({ network }) => {
    n = network;
  });

  chrome.storage.sync.get("vault", ({ vault }) => {
    v = vault;
  });
}

// DADS api
type Dads = {
  state: State;
  permission: {
    grant(): void;
    deny(): void;
  };
};

const dads: Dads = {
  state: {
    state: "idle",
  },
  permission: {
    async grant() {},
    deny() {},
  },
};

function openPopup() {
  chrome.windows.create({
    url: chrome.runtime.getURL("../popup/index.html"),
    type: "popup",
    width: 14 * 22,
    height: 14 * 30,
  });
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "content") return;

  port.onMessage.addListener(async function (msg) {
    if (!msg.target) return;
    if (msg.target !== "dads-access") return;
    if (!msg.event) return;

    // Reload extension data
    reloadData();

    //
    //
    // Load shelfcopy and post it to extension port
    if (msg.event === "get-shelfcopy") {
      // Set current permission request functions
      // WARNING: This will break with multiple apps requesting at the same time
      dads.permission = {
        async grant() {
          // Change the state back to idle and notify the popup
          dads.state = {
            state: "idle",
          };
          popup.updateState();

          // Attempt to get the shelfcopy
          try {
            const res = await fetch(
              `${n}/shelfcopy?vault=${v}&shelf=${msg.shelf}`
            );
            const data = await res.text();
            port.postMessage({
              target: "dads-app",
              event: "new-shelfcopy",
              data,
            });
          } catch (error) {
            port.postMessage({
              target: "dads-app",
              event: "error",
              error,
            });
          }
        },

        deny() {
          // Change the state back to idle and notify the popup
          dads.state = {
            state: "idle",
          };
          popup.updateState();

          // Notify the app
          port.postMessage({
            target: "dads-app",
            event: "error",
            error: "user permission denied",
          });
        },
      };

      // Notify the popup to switch state
      dads.state = {
        state: "permission-read",
        shelf: msg.shelf,
      };

      // TODO: Bring up the popup
      // Currently impossible to do in chrome
      // Open a new window instead
      openPopup();
    }

    //
    //
    // Load shelf content and post it to extension port
    else if (msg.event === "get-shelf-content") {
      try {
        const res = await fetch(`${n}/shelfcopies/${msg.shelfcopy}`);
        const data = await res.text();
        port.postMessage({
          target: "dads-app",
          event: "shelf-content",
          data,
        });
      } catch (error) {
        port.postMessage({
          target: "dads-app",
          event: "error",
          error,
        });
      }
    }

    //
    //
    // Save data
    else if (msg.event === "save-to-shelf") {
      // Set current permission request functions
      // WARNING: This will break with multiple apps requesting at the same time
      dads.permission = {
        async grant() {
          // Change the state back to idle and notify the popup
          dads.state = {
            state: "idle",
          };
          popup.updateState();

          // Attempt to write to shelf
          try {
            await fetch(`${n}/${v}/${msg.shelf}`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ newContent: msg.newData }),
            });

            port.postMessage({
              target: "dads-app",
              event: "saved-to-shelf",
              data: {},
            });
          } catch (error) {
            port.postMessage({
              target: "dads-app",
              event: "error",
              error,
            });
          }
        },
        deny() {
          // Change the state back to idle and notify the popup
          dads.state = {
            state: "idle",
          };
          popup.updateState();

          // Notify the app
          port.postMessage({
            target: "dads-app",
            event: "error",
            error: "user permission denied",
          });
        },
      };

      // Notify the popup to switch state
      dads.state = {
        state: "permission-write",
        shelf: msg.shelf,
        newData: msg.newData,
      };

      // TODO: Bring up the popup
      // Currently impossible to do in chrome
      // Open a new window instead
      openPopup();
    }

    // else {}
  });
});

const popup = {
  port: null,
  updateState() {
    this.port.postMessage({
      target: "dads-access",
      event: "update-state",
      state: dads.state,
    });
  },
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "popup") return;

  popup.port = port;
  port.onDisconnect.addListener(() => {
    popup.port = null;
  });

  popup.updateState();

  port.onMessage.addListener(async function (msg) {
    if (!msg.target) return;
    if (msg.target !== "dads-access") return;
    if (!msg.event) return;

    if (msg.event === "permission") {
      if (!msg.data) return;

      if (msg.data === "grant") dads.permission.grant();
      else dads.permission.deny();
    }
  });
});

export {};
