import App from "./App.svelte";
import { dads, setupDADS } from "./dads";

setupDADS();

const app = new App({
  target: document.body,
});

export default app;
