const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");

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
            "skills"
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

module.exports = profileRouter;