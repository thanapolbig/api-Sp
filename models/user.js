var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const user = new Schema ({
    userName: {type: String },
    userIdentity : {type: Intl }


});



module.exports=mongoose.model('user',user)
