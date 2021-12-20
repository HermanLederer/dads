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

chrome.runtime.onConnect.addListener(function (port) {
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
      try {
        const res = await fetch(`${n}/shelfcopy?vault=${v}&shelf=${msg.shelf}`);
        const data = await res.text();
        port.postMessage({
          target: "dads-app",
          event: "new-shelfcopy",
          data,
        });
      } catch (e) {}
    }

    //
    //
    // Load shelf content and post it to extension port
    else if (msg.event === "get-shelf-content") {
      const res = await fetch(`${n}/shelfcopies/${msg.shelfcopy}`);
      const data = await res.text();
      port.postMessage({
        target: "dads-app",
        event: "shelf-content",
        data,
      });
    }

    // else {}
  });
});
