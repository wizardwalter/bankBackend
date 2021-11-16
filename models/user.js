var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
	email: String,
    password: String,
    balance: Number
});
module.exports = mongoose.model('user', userSchema);