const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { secretKey } = require("../privateKeys");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;