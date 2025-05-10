import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.status(200).json({ success: true });
});

app.get("/test", function (req, res) {
  res.status(200).json({ success: true });
});

app.listen(4000, () => console.log("Server ready on port 4000."));