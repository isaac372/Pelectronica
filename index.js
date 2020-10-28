const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
const http = require("http");
const servidor = http.createServer(app);
var io = require('socket.io').listen(servidor);
io.origins('*:*');
const { Board, Sensor, Led } = require("johnny-five");
const board = new Board();
//modelo de la base de datos
const modelTemp = require("./models/Modeltemp");
///base de datos
const conectarDB = require("./config/db");
conectarDB();

//Sensores
let MQ135, LM35, LDR;
//Led a Encender
let celsuistemp, ledAire, ledC02, ledGas, led11, led12, led13;
let valueM0 = "",
  valueM1 = "",
  valueM2 = "";

board.on("ready", () => {
  const Sensor_Aire_CO2_Gas = { pin: "A0", freq: 50 };
  const SendorTemperatura = { pin: "A1", freq: 50 };
  const SendorLuz = { pin: "A2", freq: 50 };

  MQ135 = new Sensor(Sensor_Aire_CO2_Gas);
  LM35 = new Sensor(SendorTemperatura);
  LDR = new Sensor(SendorLuz);

  ondear();
});
io.on('connection', (socket) => {
  console.log('a user connected');
});

const ondear = async () => {
  const valorMq135 = MQ135.value;
  const valorTemperatura = LM35.value;
  const valorLuz = LDR.value;
  ledAire = new Led(8);
  ledC02 = new Led(9);
  ledGas = new Led(10);
  led11 = new Led(11);
  led12 = new Led(12);
  led13 = new Led(13);
  console.log(valorMq135);
  //MQ135//
  if (valorMq135 <= 55) {
    ledAire.on();
    ledC02.off();
    ledGas.off();
    valueM0 = valorMq135;
    valueM1=null;
    valueM2=null;
    console.log("desde Aire")
  }
  if (valorMq135 >= 56 && valorMq135 <= 65) {
    ledAire.off();
    ledC02.on();
    ledGas.off();
    valueM1 = valorMq135;
    valueM0=null;
    valueM2=null;
    console.log("desde Co2")
  }
  if (valorMq135 >= 74 && valorMq135 <= 350) {
    ledAire.off();
    ledC02.off();
    ledGas.on();
    valueM2 = valorMq135;
    valueM0=null;
    valueM1=null;
    console.log("desde gas")
  }

  //Temperatura//
  celsuistemp = (5 * valorTemperatura * 100) / 1024;
  if (celsuistemp > 22) {
    led13.on();
    led12.off();
  } else {
    led12.on();
    led13.off();
  }

  //Luz//
  if (valorLuz < 75) {
    led11.on();
  } else {
    led11.off();
  }
  try {
    let body = {
      temperatura: parseInt(celsuistemp),
      luminicidad: valorLuz,
      aire: valueM0,
      co2: valueM1,
      gas: valueM2,
    };

     
    // User=new modelTemp(body);
    //   await User.save()

    const ver = await modelTemp.find({}).sort({ _id: -1 }).limit(1);
  

    io.emit("temperatura", ver);
  } catch (error) {
    console.log(error);
  }

  setTimeout(ondear, 1000);
};

const port = process.env.PORT || 4000;
servidor.listen(port, "0.0.0.0", () => {
  console.log(`el puerto esta funcionando  ${port}`);
});
