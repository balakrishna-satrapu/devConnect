const express = require("express");
const app = express();
const validator = require("validator");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { secretKey, MONGODB_CONNECTION_STRING } = require("./privateKeys");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");

app.use(express.json()); // returns middleware
app.use(cookieParser()); // returns middleware that parse cookie in request object

app.post("/signup", async (req, res) => {
    try {
        const allowedFields = [
            "firstName",
            "lastName",
            "emailId",
            "password",
            "gender",
            "age",
            "profileImageURL",
            "skills"
        ];

        const data = req.body;

        const isAllowedUser = Object.keys(data).every((k) => allowedFields.includes(k));

        if(!isAllowedUser) {
            throw new Error("Invalid credentials");
        }

        const { emailId } = data;

        const userInDB = await User.findOne({ emailId });
        
        if(userInDB) {
            throw new Error("user with this emailId already exists");
        }
        
        const user = new User(data);

        await user.save();

        const token = jwt.sign({emailId}, secretKey);

        res.cookie("token", token).send("user registered sucessfully");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("invalid credentials");
        }

        const user = await User.findOne({emailId});

        if(!user || user.password !== password) {
            throw new Error("invalid credentials");
        }

        const token = jwt.sign({emailId}, secretKey);

        res.cookie("token", token);
        res.send("Login Successful!!");
    } catch (err) {
        res.send("ERROR : " + err.message);
    }
});

app.get("/profile/view", userAuth, (req, res) => {
    res.send(req.user)
});

const connectDB = async () => {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
}

connectDB()
    .then(() => {
        console.log("Database connected successfully!!!");
        app.listen("7777", () => {
            console.log("The app is started listening to requests on port 7777");
        });
    })
    .catch((err) => {
        console.log("Database not connected sucessfully!!!");
        console.log(err);
    })
