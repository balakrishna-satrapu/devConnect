const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://dev-connect-web-hazel.vercel.app"
            ]
        },
    });

    io.on("connection", (socket) => {
        // Handle Events
        socket.on("joinChat", ({firstName, lastName, userId, targetUserId}) => {
            const roomId = [userId, targetUserId].sort().join("");
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({firstName, userId, targetUserId, newMessage}) => {
            try {   
                const roomId = [userId, targetUserId].sort().join("");
                // TODOs
                // save the message into the database
                // find previous chat
                let chat = await Chat.findOne({participants: { $all: [userId, targetUserId]}});
                // if there is no previous chat, create one
                if(!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                }
                // append newMessage to the previous chat
                chat.messages.push({
                    senderId: userId,
                    text: newMessage
                });

                await chat.save();

                const newChats = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]}
                }).populate("messages.senderId", "firstName gender lastName");

                io.to(roomId).emit("messageReceived", newChats);
            } catch(err) {
                console.log(err.message);
            }
        });
        socket.on("disconnect", () => {});
    });
}

module.exports = initializeSocket;