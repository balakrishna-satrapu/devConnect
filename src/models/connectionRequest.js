const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        }
    }
}, { timestamps: true});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;