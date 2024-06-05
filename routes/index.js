var express = require('express');
const { login, register , Otpp } = require('../Controller/User_controller');
var router = express.Router();

router.post("/",login)
router.post("/register",register)
router.post("/sendotp",Otpp)




module.exports = router;
