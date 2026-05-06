const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
require('dotenv').config();

app.use(cors(
    {
        origin: 'http://localhost:5173' ,
        credentials: true
    }
));
app.use(express.json()); // returns middleware
app.use(cookieParser()); // returns middleware that parse cookie in request object

app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/profile", profileRouter);
app.use("/", authRouter);

connectDB()
    .then(() => {
        console.log("Database connected successfully!!!");
        app.listen("process.env.PORT", () => {
            console.log("The app is started listening to requests on port " + process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("Database not connected!!!");
        console.log(err);
    })
