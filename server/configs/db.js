const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = () => {
  try {
    mongoose.connect(`${process.env.DB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("MongoDB connected")
  } catch (err) {
    console.log("Failed to connect to MongoDB", err)
  }
}

module.exports = { connectDB }
