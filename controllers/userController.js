const { json } = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const enviromentVariable = require("../enviroment_variables.json");
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(enviromentVariable["CLIENT_ID"])

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      balance: req.body.balance,
    });
    user
      .save()
      .then((result) => {
        const token = jwt.sign(
          { userEmail: result.email, userId: result._id },
          enviromentVariable["jwt-secret"],
          { expiresIn: 5000 }
        ); 
        res.status(201).json({
          ok:true,
          message: "User created!",
          user: result,
          token: token
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};
// fix then catch blocks :)
module.exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.json({
          message: "Wrong password please try again",
        });
      }
      const token = jwt.sign(
        { userEmail: fetchedUser.email, userId: fetchedUser._id },
        enviromentVariable["jwt-secret"],
        { expiresIn: 5000 }
      );
      console.log("fetchedUser", fetchedUser);
      res.status(200).json({
        ok: true,
        token: token,
        user: fetchedUser,
      });
    })
    .catch((err) => {
      return res.json({
        message: "No user found please create an account"
      });
    })
    .catch((err) => {
      return res.json({
        message: "Are you trying to hack me?",
      });
    });
};
// have to figure out this payload and how to query to the db with it
module.exports.googleLoginUser = async (req, res) => {
  const  token   = req.params.token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: enviromentVariable["CLIENT_ID"]
});

const { name, email, picture } = ticket.getPayload();
  User.findOne({email: email})
    .then((user) => {
      console.log(user);
      const token = jwt.sign(
        { userEmail: user.email, userId: user._id },
        enviromentVariable["jwt-secret"],
        { expiresIn: 5000 }
      );
      res.status(200).json({
        user: { 
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      },
        token: token
      });
    })
    .catch((error) => console.log(error));
};
module.exports.googleCreateUser = async (req, res) => {
  const  token   = req.params.token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: enviromentVariable["CLIENT_ID"]
});
const { name, email } = ticket.getPayload();
const user = new User({
  name: name,
  email: email,
  balance: 0
});
user
.save()
.then((result) => {
  const token = jwt.sign(
    { userEmail: result.email, userId: result._id },
    enviromentVariable["jwt-secret"],
    { expiresIn: 5000 }
  ); 
  res.status(201).json({
    ok:true,
    message: "User created!",
    user: result,
    token: token
  });
})
.catch((err) => {
  res.status(500).json({
    error: err,
  });
});
};

module.exports.getUser = (req, res) => {
  console.log(req.params.email);
  User.findOne({ email: req.params.email })
    .then((user) => {
      console.log(user);
      res.status(200).json({
        userId: user._id
      });
    })
    .catch((error) => console.log(error));
};

module.exports.setbalance = (req, res) => {
  console.log(req.body.balance);
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        balance: req.body.balance,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log(user);
      res.status(200).json({ user: user });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Error", error: err });
    });
};
