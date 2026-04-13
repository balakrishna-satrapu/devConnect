const mongoose = require("mongoose");
const validator = require("validator");

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
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("emailId is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(password) {
            if(!validator.isStrongPassword(password)) {
                throw new Error("password should contain minimum 8 characters, 1 Uppercase letter, 1 Number and 1 special character");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            const isAllowedTypes = ["male", "female", "others"];
            if(!isAllowedTypes.includes(value.toLowerCase())) {
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