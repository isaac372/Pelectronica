const express = require("express");
 const http = require("http");
const app = express();
const servidor = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(servidor);
const modelTemp=require('./models/Modeltemp')
const SerialPort = require("serialport");

const conectarDB = require("./config/db");

conectarDB();



//app.use('/api/Temp',require('./routes/mostrardata'));
const Board = new SerialPort("COM3", {
  baudRate: 9600,
});

Board.on('open', function () {
  console.log("Conexion Abierta");
});

Board.on('data',  async (data)=>{
  try {
    
  let body={
 temperatura:parseInt(data,10)
  }
  console.log(body)
  // User=new modelTemp(body);
  //   await User.save()

  const ver=await modelTemp.find().sort({temperatura:-1}).limit(1)
  io.emit("temperatura", ver);

    
  } catch (error) {
    console.log(error)
  }
  

  //
})


Board.on("error", function (error) {
  console.log(error);
});

// io.on("connection", (socket) => {
//   socket.on("conectado", () => {
// console.log("conectado desde cliente")

   
//   });
// });

app.get("/", (req, resp) => {
  resp.send("HOLa mundo como se encuentran hoy");
});


const PORT = process.env.PORT || 4000;
servidor.listen(PORT, () => {
  console.log(`el puerto esta funcionando  ${PORT}`);
});


