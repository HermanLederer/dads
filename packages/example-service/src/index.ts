import { resolve } from "path";
import express from "express";
import cors from "cors";

import { pinpons } from "./pinpons";

const app = express();
// app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 204,
  })
);

app.use("/public/", express.static(resolve("public")));

app.get("/pinpons", async (req, res) => {
  const { shelfcopy, key } = req.query;

  if (shelfcopy && key) {
    // TODO: Filter pinpons by interest
    res.status(200).json({ pinpons });
    return;
  }

  res.status(200).json({ pinpons });
});

app.listen(8000);
