let ui = {
  network: document.getElementById("network"),
  vault: document.getElementById("vault"),
  submit: document.getElementById("unlock"),
};

chrome.storage.sync.get("network", ({ network }) => {
  ui.network.value = network;
});

chrome.storage.sync.get("vault", ({ vault }) => {
  ui.vault.value = vault;
});

ui.submit.addEventListener("click", (e) => {
  e.preventDefault();

  chrome.storage.sync.set({
    network: ui.network.value,
    vault: ui.vault.value,
  });
});
