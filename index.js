const express = require("express");
const http = require("http");
const app = express();
const servidor = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(servidor);
//arduino
const serialPort = require("serialport");
let Readline = serialPort.parsers.Readline;
let Board = new serialPort("COM3", {
  baudRate: 9600,
});
let parser = Board.pipe(new Readline({ delimiter: "\r\n" }));

io.on("connection", (socket) => {
  socket.on("conectado", () => {
console.log("conectado")

    parser.on("open", function () {
      console.log("Conexion Abierta");
    });
    parser.on("data", function (data) {
     // io.emit("temperatura", data);
    });
    io.emit("temperatura", "casa");

    Board.on("error", function (error) {
      console.log(error);
    });
  });
});

///
const PORT = process.env.PORT || 4000;
servidor.listen(PORT, () => {
  console.log(`el puerto esta funcionando  ${PORT}`);
});
