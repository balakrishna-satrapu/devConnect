const express = require("express");
const app = express();
const validator = require("validator");
const mongoose = require("mongoose");
const User = require("./models/user");

app.use(express.json());

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
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password
        })

        await user.save();

        res.send("user registered sucessfully");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://balakrishnasatrapu_db_user:C3umfqJ1pUmZLEQR@cluster0.h3x6nxx.mongodb.net/devConnect");
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
