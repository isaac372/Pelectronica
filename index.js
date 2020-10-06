const express = require("express");
const app = express();
const serialPort = require("serialport");
const Readline = serialPort.parsers.Readline;

const PORT = process.env.PORT || 4000;

const Board = new serialPort("COM3", {
  baudRate: 9600,
});

const parser = Board.pipe(new Readline({ delimiter: "\r\n" }));

parser.on("open", function () {
  console.log("Conexion Abierta");
});

parser.on("data", function (data) {
  console.log(data);
});

Board.on("error", function (error) {
  console.log(error);
});
console.log("jdjdj");
app.get("/", (req, res) => {
  res.send("Desde mi codigo de arduino");
});

app.listen(PORT, () => {
  console.log(`el puerto esta funcionando en el puerto ${PORT}`);
});
