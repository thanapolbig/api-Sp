var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const admin = new Schema ({
    enrollmentID: {type: String },
    identity : {type: Intl}


});



module.exports=mongoose.model('admin',admin)
