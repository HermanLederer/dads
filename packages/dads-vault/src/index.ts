import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("success!");
  console.log(1);
});

app.listen(8000);

console.log(app);
