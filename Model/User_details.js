var mongoose = require('mongoose');

var User_schema = new mongoose.Schema({
    name : {type : String},
    email : {type : String},
    password : {type : String},
    mobile_number:{type : String},
})


module.exports = mongoose. model('User_details',User_schema);