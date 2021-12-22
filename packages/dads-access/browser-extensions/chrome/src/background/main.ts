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

const dads = {
  state: {
    state: "idle",
    description: "",
  },
  permission: {
    async grant() {},
    deny() {},
  },
};

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
            state: "iodle",
            description: "",
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
            state: "iodle",
            description: "",
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
        state: "permission",
        description: msg.shelf,
      };

      // TODO: Bring up the popup
      // Currently impossible to do in chrome
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
