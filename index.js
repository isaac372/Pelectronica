const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const servidor = http.createServer(app.use(cors(),bodyParser.json()));
const socketio = require("socket.io");

const io = socketio(servidor);
const { Board, Sensor, Led } = require("johnny-five");
const board = new Board();
//modelo de la base de datos
const modelTemp = require("./models/Modeltemp");
///base de datos
const conectarDB = require("./config/db");
conectarDB();

let ldr, lm35, celsuistemp;
let led11, led12, led13;

board.on("ready", () => {
  const SendorTemperatura = { pin: "A0", freq: 50 };
  const SendorLuz = { pin: "A1", freq: 50 };
  lm35 = new Sensor(SendorTemperatura);
  ldr = new Sensor(SendorLuz);

  ondear();
});

const ondear = async () => {
  const temp = lm35.value;
  const luz = ldr.value;
  led11 = new Led(11);
  led12 = new Led(12);
  led13 = new Led(13);
  celsuistemp = (5 * temp * 100) / 1024;
  if (celsuistemp > 22) {
    led13.on();
    led12.off();
  } else {
    led12.on();
    led13.off();
  }

  if (luz < 75) {
    led11.on();
  } else {
    led11.off();
  }
  try {
    let body = {
      temperatura: parseInt(celsuistemp),
      luminicidad: luz,
    };

    console.log(body)
    User=new modelTemp(body);
      await User.save()

    const ver = await modelTemp.find({}).sort({ _id: -1 }).limit(1);

    console.log(ver);
    io.emit("temperatura", ver);
  } catch (error) {
    console.log(error);
  }

  setTimeout(ondear, 5000);
};

const PORT = process.env.PORT || 4000;
servidor.listen(PORT, () => {
  console.log(`el puerto esta funcionando  ${PORT}`);
});
