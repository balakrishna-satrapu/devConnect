const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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

        const userRes = await user.save();

        const token = jwt.sign({emailId}, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
         
         res.send(userRes);
    } catch (err) {
        console.log(err.message);
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

        const token = jwt.sign({emailId}, process.env.JWT_SECRET);

        const { firstName, lastName, age, gender, skills, about, profileImageURL } = user;
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.send({
            firstName,
            lastName,
            age,
            gender,
            skills,
            about,
            profileImageURL
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.send("Logout Successful!!!");
});

module.exports = authRouter;