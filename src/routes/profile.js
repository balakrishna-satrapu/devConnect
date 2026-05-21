const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const validator = require("validator");

profileRouter.get("/view", userAuth, (req, res) => {
    res.send(req.user)
});

profileRouter.patch("/edit", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const data = req.body;

        const allowedFields = [
            "firstName",
            "lastName",
            "gender",
            "age",
            "profileImageURL",
            "about"
        ];

        const isAllowedEdit = Object.keys(data).every( k => allowedFields.includes(k));

        if(!isAllowedEdit) {
            throw new Error("Invalid data");
        }

        Object.keys(data).forEach(k => {
            loggedInUser[k] = data[k];
        });

        await loggedInUser.save();

        res.send("update succesful!!");

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/changePassword", userAuth, async(req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        console.log(oldPassword);
        console.log(newPassword);
        const loggedInUser = req.user;
        console.log(loggedInUser);
        if(oldPassword !== loggedInUser.password) {
            throw new Error("old Password is incorrect");
        }

        // check new password

        if(oldPassword === newPassword) {
            throw new Error("oldPassword and newPassword are same");
        }

        if(!validator.isStrongPassword(newPassword)) {
            throw new Error("password should contain minimum 8 characters, 1 Uppercase letter, 1 Number and 1 special character");
        }

        const updatedProfile = await User.findOneAndUpdate({ _id: loggedInUser._id }, { password: newPassword}, { new: true });

        res.json(
            { 
                "message": "password changed Succesfully !!!",
                "data": updatedProfile 
            }
        );

    } catch (err) {
        console.log(err.message);
        res.status(400).send(err);
    }
});

profileRouter.delete("/delete", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const { password } = req.body;

        if(loggedInUser.password !== password) {
            throw new Error("invalid password");
        }

        await User.findOneAndDelete({emailId: loggedInUser.emailId});
        
        await ConnectionRequest.deleteMany({
            $or: [
                {senderUserId: loggedInUser._id},
                {receiverUserId: loggedInUser._id}
            ]
        });

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        
        res.send("Account Deleted Permanently");
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
    
});

module.exports = profileRouter;