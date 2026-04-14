const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../privateKeys");

const connectDB = async () => {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
}

module.exports = connectDB;