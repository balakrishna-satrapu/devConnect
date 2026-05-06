const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    //user authentication
    try {
        const { token } = req.cookies;
        if(!token) {
            throw new Error("invalid Token");
        }
        const { emailId } = jwt.verify(token, process.env.SECRET_KEY);
        const loggedInUser = await User.findOne({ emailId });
        if(!loggedInUser) {
            throw new Error("User not found");
        }
        req.user = loggedInUser;
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = userAuth;