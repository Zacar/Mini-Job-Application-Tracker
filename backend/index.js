const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json()); // req.body

app.post("/mini_tracker", (req, res) => {
  console.log(req.body);
});

app.listen(8080, () => {
  console.log("Testing on a completely different port: 8080");
});
