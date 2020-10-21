const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  temperatura: {
    type: Number,
  },
  luminicidad:{
    type:Number
  }
});

module.exports = mongoose.model("User", UserSchema);
