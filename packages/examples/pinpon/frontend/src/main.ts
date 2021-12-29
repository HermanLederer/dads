import App from "./App.svelte";
import { dads, setupDADS } from "./dads";

import "./style.scss";

setupDADS();

const app = new App({
  target: document.body,
});

export default app;
