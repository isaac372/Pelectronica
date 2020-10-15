const express = require("express");
const http = require("http");
const app = express();
const servidor = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(servidor);
const SerialPort = require("serialport");


const Board = new SerialPort("COM3", {
  baudRate: 9600,
});

Board.on('open', function () {
  console.log("Conexion Abierta");
});

Board.on('data', function(data){
  let temp =parseInt(data,10)+" ºC";
  console.log(temp);
  io.emit("temperatura", temp);
})


Board.on("error", function (error) {
  console.log(error);
});

io.on("connection", (socket) => {
  socket.on("conectado", () => {
console.log("conectado desde cliente")

   
  });
});

app.get("/", (req, resp) => {
  resp.send("HOLa mundo como se encuentran hoy");
});


const PORT = process.env.PORT || 4000;
servidor.listen(PORT, () => {
  console.log(`el puerto esta funcionando  ${PORT}`);
});


