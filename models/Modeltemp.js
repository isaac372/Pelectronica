const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  aire: {
    type: Number,
  },
  co2: {
    type: Number,
  },
  gas: {
    type: Number,
  },
  temperatura: {
    type: Number,
  },
  luminicidad: {
    type: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
