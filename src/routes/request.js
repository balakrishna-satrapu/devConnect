const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const senderUserId = loggedInUser._id;
        const receiverUserId = req.params.userId;
        const status = req.params.status;

        if(status !== "interested" && status !== "ignored") {
            throw new Error("status not valid");
        }

        if(senderUserId === receiverUserId) {
            throw new Error("invalid request");
        }

        const user = await User.findById(receiverUserId);

        if(!user) {
            throw new Error("user not found");
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {senderUserId, receiverUserId},
                {senderUserId: receiverUserId, receiverUserId: senderUserId}
            ]
        });

        if(existingRequest) {
            throw new Error("connection already exists");
        }

        const connection = new ConnectionRequest({
            senderUserId: loggedInUser._id,
            receiverUserId,
            status
        });

        await connection.save();

        res.send("request sent successfully!!!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;