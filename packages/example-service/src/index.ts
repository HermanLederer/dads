import { resolve } from "path";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

import { pinpons } from "./pinpons";

console.log("\x1b[43m\x1b[30mSTARTING BACKEND...\x1b[0m");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 204,
  })
);

app.use("/public/", express.static(resolve("public")));

app.get("/pinpons", async (req, res) => {
  const { shelfcopy } = req.query;

  if (shelfcopy) {
    console.log(`\x1b[43m\x1b[30mBACKEND RECEIVED:\x1b[0m ${shelfcopy}`);

    // Get interests
    const fres = await fetch(`http://localhost:3132/shelfcopies/${shelfcopy}`);

    if (fres.status === 200) {
      const interests = await fres.text();
      console.log(`\x1b[43m\x1b[30mBACKEND RECEIVED:\x1b[0m ${interests}`);

      // TODO: Filter pinpons by interest
      res.status(200).json({
        pinpons: [{ title: "Your interests", text: interests }, ...pinpons],
      });

      return;
    }
  }

  res.status(200).json({ pinpons });
});

app.listen(8000);

console.log("\x1b[43m\x1b[30mBACKEND IS LISTENING ON PORT 8000\x1b[0m");
