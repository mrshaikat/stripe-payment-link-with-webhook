const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_CONNECTION_URI || "";
    await mongoose.connect(uri);
    console.log("Database is connected successsfully.");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
