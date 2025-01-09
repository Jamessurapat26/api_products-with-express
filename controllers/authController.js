const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express();

const secretKey = "api-key";

const reqLogin = passport.authenticate("user-local", { session: false });

router.post("/login", reqLogin, (req, res) => {
  const token = jwt.sign(req.user, secretKey, {
    expiresIn: "1d",
  });

  res.status(201).send({
    message: "login successfully",
    token: token,
  });
});

module.exports = router;
