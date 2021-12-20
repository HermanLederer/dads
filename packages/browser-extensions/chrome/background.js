let n = "http://localhost:3132";
let v = "000000000000000";

// Save default values on install

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ network: n, vault: v });
});

chrome.storage.sync.get("network", ({ network }) => {
  n = network;
});

chrome.storage.sync.get("vault", ({ vault }) => {
  v = vault;
});

// DADS api

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (msg) {
    if (!msg.target) return;
    if (msg.target !== "dads-access") return;
    if (!msg.event) return;

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

// port.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.target !== "dads-access") return;
//   if (request.event !== "get-shelfcopy") return;

// });

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   if (request.type === "getShelfContent") {
//     const res = await fetch(`http://localhost:3132/shelfcopies/${shelfcopy}`);
//     sendResponse({ farewell: await res.text() });
//   }
// });
