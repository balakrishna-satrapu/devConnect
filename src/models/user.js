const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            const isAllowedTypes = ["male", "female", "others"];
            if(!isAllowedTypes.includes(value.lowercase())) {
                throw new Error("Gender is not valid");
            }
        }
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    },
    profileImageURL: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    }
}, { timestamps: true });

const User = new mongoose.model("User", userSchema);

module.exports = User;