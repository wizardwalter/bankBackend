var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/auth")


 router.post("/create", userController.createUser);

 router.post('/login', userController.loginUser);

 router.get('/google/:token', userController.googleLoginUser);

 router.get('/:email', userController.getUser);

 router.post('/setBalance/:id', userController.setbalance);



module.exports = router;