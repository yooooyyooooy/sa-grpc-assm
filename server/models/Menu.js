const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
  _id: String,
  name: String,
  price: Number,
})

const Menu = mongoose.model("Menu", menuSchema)

module.exports = { Menu }
