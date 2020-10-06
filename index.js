const express = require("express");
const http=require("http");
const app = express();
const PORT = process.env.PORT || 4000;
const servidor=http.createServer(app);
const socketio=require("socket.io")
const io=socketio(servidor);
///arduino
const serialPort = require("serialport");
let Readline = serialPort.parsers.Readline;
let Board = new serialPort("COM3", {
    baudRate: 9600,
  });
let parser = Board.pipe(new Readline({ delimiter: "\r\n" }));
  
io.on('connection',socket=>{
    socket.on('conectado',()=>{

        console.log("arduino conectado")
      
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
          
    })
})


///
servidor.listen(PORT, () => {
  console.log(`el puerto esta funcionando en el puerto ${PORT}`);
});
