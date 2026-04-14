const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");

profileRouter.get("/view", userAuth, (req, res) => {
    res.send(req.user)
});

module.exports = profileRouter;