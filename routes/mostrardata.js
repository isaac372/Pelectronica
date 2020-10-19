const express = require("express");
const router = express.Router();
const tempContro=require('../controlles/tempControlles')

router.get('/',
tempContro.ObtenerDatos
)


module.exports = router;
