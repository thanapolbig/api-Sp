//var config =require('./config')
var mongoose = require('mongoose')
const logger = require('../Util/logger.js');
// read package.json<Scripts> 
const ORG = process.env.ORG.toLocaleLowerCase()
const url =`mongodb+srv://development:ZGFMzUvDJ745GFDq@clustermaster-zvis2.mongodb.net/wallet${ORG}?retryWrites=true&w=majority`;
module.exports =  function () {
    mongoose.set('debug :', true);
    logger.info('mongoUri :'+url);
    var db = mongoose.connect(url,
        { useNewUrlParser : true}
    );

    require('../models/admin');
    require('../models/user');
    return db

}