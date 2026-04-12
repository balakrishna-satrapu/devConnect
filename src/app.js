const express = require("express");
const app = express();
const validator = require("validator");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { secretKey, MONGODB_CONNECTION_STRING } = require("./privateKeys");

app.use(express.json()); // returns middleware

app.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, emailId, password} = req.body;
        if(firstName.length < 4 || lastName.length < 4) {
            throw new Error("FirstName and LastName should contain atleast 4 character");
        }
        if(!validator.isEmail(emailId)) {
            throw new Error("emailId is not valid");
        }
        if(!validator.isStrongPassword(password)) {
            throw new Error("password should contain minimun 8 characters, 1 Uppercase letter, 1 Number and 1 special character");
        }

        const userInDB = await User.findOne({ emailId });
        
        if(userInDB) {
            throw new Error("user with this emailId already exist");
        }
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password
        });

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
