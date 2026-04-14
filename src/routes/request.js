const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const receiverUserId = req.params.userId;
        const status = req.params.status;
        const connection = new ConnectionRequest({
            senderUserId: loggedInUser._id,
            receiverUserId: receiverUserId,
            status: status
        });

        await connection.save();

        res.send("request sent successful!!!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;