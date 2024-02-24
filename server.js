const express = require("express");
const app = express();
const port = process.env.PORT || 3006;
const cors = require("cors");
let mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const mailjetModule = require("node-mailjet");
const multer = require("multer");
// const twilio = require("twilio");
app.use(bodyParser.json());
app.use(cors());
function GetId() {
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));
  return rawData.length ? rawData[rawData.length - 1].id + 1 : 1;
}
app.get("/", async (req, res) => {
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));

  //   console.log(data);
  res.json(rawData);
});
app.post("/PushItem", async (req, res) => {
  console.log(req.body);
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));
  rawData.push({ ...req.body, id: GetId() });
  fs.writeFileSync("./Data.json", JSON.stringify(rawData, null, 2));
  res.json(JSON.parse(fs.readFileSync("./Data.json")));
});
app.delete("/Delete/:id", async (req, res) => {
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));
  //   console.log(rawData);
  //   console.log(req.params.id);
  rawData = rawData.filter((e) => e.id !== +req.params.id);
  //   console.log(rawData);
  fs.writeFileSync("./Data.json", JSON.stringify(rawData, null, 2));
  res.json(JSON.parse(fs.readFileSync("./Data.json")));
});
app.get("/FindItem/:id", async (req, res) => {
  const id = req.params.id;
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));
  let item = rawData.find((e) => {
    return e.id === +id;
  });
  console.log(item);
  res.json(item);
});
app.put("/PutData", async (req, res) => {
  let rawData = JSON.parse(fs.readFileSync("./Data.json"));
  const i = rawData.findIndex((e) => e.id === req.body.id);
  console.log(i);
  rawData[i] = req.body;
  fs.writeFileSync("./Data.json", JSON.stringify(rawData, null, 2));

  res.json(JSON.parse(fs.readFileSync("./Data.json")));
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
