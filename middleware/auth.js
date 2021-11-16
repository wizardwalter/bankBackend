const { json } = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const enviromentVariable = require("../enviroment_variables.json");


module.exports.checkAuth = (req,res,next) =>{
    const token = req.headers['Authorization'].split(' ')[1];
    if(token){
        jwt.verify(token, enviromentVariable["jwt-secret"], (err, decoded) =>{
            if(err) return res.json({
                error:error,
                message: 'Hackerrr',
                isLoggedin: false
            })
            req.user = {};
            req.user.id = decoded.id
            req.user.email = decoded.email
            next();
        })
    }else{
        res.json({
            message: 'no token',
            isLoggedin: false
        })
    }
}