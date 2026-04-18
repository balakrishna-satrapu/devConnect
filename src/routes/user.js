const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const pendingRequests = await ConnectionRequest.find({
            receiverUserId: loggedInUser._id,
            status: "interested"
        }).populate("senderUserId", ["firstName", "lastName"]);

        res.send(pendingRequests);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;