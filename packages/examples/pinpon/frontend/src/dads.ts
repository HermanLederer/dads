let dads = null;

function setupDADS() {
  window.addEventListener("message", (event) => {
    // console.log(event.data);

    if (event.data.target && event.data.target === "dads-app") {
      if (event.data.event && event.data.event === dads.awaitingResponse) {
        if (event.data.data) {
          dads.resolve(event.data.data);
        }
      }
      else if (event.data.event && event.data.event === "error") {
        dads.reject();
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
