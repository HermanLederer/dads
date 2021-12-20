let dads = null;

function setupDADS() {
  window.addEventListener("message", (event) => {
    if (event.data.target && event.data.target === "dads-app") {
      if (event.data.event && event.data.event === dads.awaitingResponse) {
        if (event.data.data) {
          dads.resolve(event.data.data);
        }
      }
    }
  });

  dads = {
    awaitingResponse: "",
    resolve: null,
    reject() {},
    async getShelfcopy(shelf: string): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        this.reject();

        this.awaitingResponse = "new-shelfcopy";
        this.resolve = resolve;
        this.reject = reject;

        window.postMessage(
          {
            target: "dads-access",
            event: "get-shelfcopy",
            shelf,
          },
          "*"
        );
      });
    },
  };
}

export { dads, setupDADS };
