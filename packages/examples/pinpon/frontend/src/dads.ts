type Dads = {
  awaitingResponse: string;
  resolve(data: any);
  reject();
  getShelfcopy(shelf: string): Promise<string>;
  saveToShelf(shelf: string, newData: string): Promise<boolean>;
};

let dads: Dads = null;

function setupDADS() {
  window.addEventListener("message", (event) => {
    if (event.data.target && event.data.target === "dads-app") {
      if (event.data.event && event.data.event === dads.awaitingResponse) {
        if (event.data.data) {
          dads.resolve(event.data.data);
        }
      } else if (event.data.event && event.data.event === "error") {
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

    async saveToShelf(shelf: string, newData: string): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        this.reject();

        this.awaitingResponse = "saved-to-shelf";
        this.resolve = resolve;
        this.reject = reject;

        window.postMessage(
          {
            target: "dads-access",
            event: "save-to-shelf",
            shelf,
            newData,
          },
          "*"
        );
      });
    },
  };
}

export { dads, setupDADS };
