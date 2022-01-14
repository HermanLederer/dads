import { resolve } from "path";
import express from "express";
import cors from "cors";

import { pinpons } from "./pinpons";
import type { Pinpon } from "../../common/Pinpon";

function shuffle(array: Pinpon[]): void {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

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
  console.log(`\x1b[43m\x1b[30mBACKEND RECEIVED:\x1b[0m ${req.url}`);

  shuffle(pinpons);

  const interests = req.query.interests as string;

  if (interests) {
    // TODO: Filter pinpons by interest
    res.status(200).json({
      pinpons: pinpons.filter((e) => {
        for (let i = 0; i < e.interests.length; ++i) {
          if (interests.includes(e.interests[i])) return true;
        }
      }),
    });

    return;
  }

  res.status(200).json({ pinpons });
});

app.listen(8000);

console.log("\x1b[43m\x1b[30mBACKEND IS LISTENING ON PORT 8000\x1b[0m");
