const express = require("express");
const chatRouter = express.Router();
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const userId = req.user?._id;

    const { targetUserId } = req.params;

    let chat = await Chat.findOne({
        participants: {$all: [userId, targetUserId]}
    }).populate({
        path: "messages.senderId",
        select: "firstName lastName gender",
    });

    if(!chat) {
        chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
        });
    }

    res.json(chat);
});

module.exports = chatRouter;