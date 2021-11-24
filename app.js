const { json } = require("body-parser");
const express = require("express");
const cors = require ("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const  mongoose  = require("mongoose");
const userRoute  = require('./routes/users');




var app = express();
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://walter:thesecret@bankapp.xfg4s.mongodb.net/bankApp?retryWrites=true&w=majority", {useNewUrlParser: true })
    .then(()=>{
        console.log("connection successful");
    })
    .catch(()=>{
        console.log("connection failed");
    });
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type, Accept, authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
});

app.use('/users', userRoute)

const port = process.env.PORT || 8080


app.listen(port, () =>{
    console.log(`Server is listening on port:${port}`)
})
