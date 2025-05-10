import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.status(200).json({ success: true });
});

app.get("/test", function (req, res) {
  res.status(200).json({ success: true });
});

app.listen(3000, () => console.log("Server ready on port 3000."));