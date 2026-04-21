const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const acceptedConnections = await ConnectionRequest.find({
            $or: [
                {senderUserId: loggedInUser._id, status: "accepted"},
                {receiverUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("senderUserId", "firstName lastName")
        .populate("receiverUserId", "firstName lastName");

        const connections = acceptedConnections.map(connection => {
            if(connection.receiverUserId._id.equals(loggedInUser._id)) {
                return connection.senderUserId;
            }
            return connection.receiverUserId;
        });

        res.send(connections);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        limit = (limit > 100)? 100: limit;

        const hideUsersFromFeed = [];
        hideUsersFromFeed.push(loggedInUser._id);
        const connectedUsers = await ConnectionRequest.find({
            $or: [
                {senderUserId: loggedInUser._id},
                {receiverUserId: loggedInUser._id}
            ]
        });

        connectedUsers.forEach(request => {
            if(request.receiverUserId.equals(loggedInUser._id)) {
                hideUsersFromFeed.push(request.senderUserId);
            } else {
                hideUsersFromFeed.push(request.receiverUserId);
            }
        });

        const usersToShow = await User.find({
            _id: {$nin: hideUsersFromFeed}
        }).select("firstName lastName profileImageURL skills").skip((page-1)*limit).limit(limit);

        res.send(usersToShow);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;