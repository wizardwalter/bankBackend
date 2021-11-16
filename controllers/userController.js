const { json } = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const enviromentVariable = require("../enviroment_variables.json");

module.exports.createUser = (req, res, next) =>{
     bcrypt.hash(req.body.password, 10).then(hash => {
            const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash,
              balance: req.body.balance
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created!",
                  result: result
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          });
    };

  module.exports.loginUser = (req,res,next) =>{
      console.log(req.body)
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
          console.log(user)
        if (!user) {
          return res.status(401).json({
            message: "Auth failed 1"
          });
        }
        fetchedUser = user;
          return bcrypt.compare(req.body.password, user.password)
      })
          .then (result => {
              console.log('result:' ,result)
              if (!result) {
                return res.status(401).json({
                  message: "Auth failed 2 "
                });
              }
              const token = jwt.sign(
                { userEmail: fetchedUser.email, userId: fetchedUser._id },
                enviromentVariable["jwt-secret"],
                { expiresIn: 5000 }
              );
              console.log('fetchedUser', fetchedUser)
              res.status(200).json({
                ok: true,
                token: token,
                user: fetchedUser
              });
            })
            .catch(err => {
              return res.status(401).json({
                message: "Auth failed 3",
                error: err
              });
            });
  };

  module.exports.getUser = (req,res)=>{
    console.log(req.params.id)
    User.findById(req.params.id)
      .then(user =>{
        console.log(user)
        res.status(200).json({
          userId: user._id,
          username: user.name,
          email: user.email,
          balance: user.balance
        })
      })
      .catch(error => console.log(error))
}

  module.exports.setbalance =  (req,res) =>{
    console.log(req.body.balance)
     User.findByIdAndUpdate(req.params.id,{$set:{
      balance:req.body.balance
  }},{new:true})
  .then(user=>{
    console.log(user)
    res.status(200).json({user:user})
  })
   .catch(err =>{
     res.status(500).json({message:"Internal Error", error:err})
   }) 
  }
