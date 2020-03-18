var express = require('express')
var bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')

const ORG = process.env.ORG
const ROLE = process.env.ROLE || "developer"
var swaggerDocument
module.exports = function()
{
    var app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.text())
    app.use(cors({ origin: '*' }));

    if (ROLE == "production"){
        swaggerDocument = require(`../swagger/swaggerPro${ORG}.json`);
    }else{
        swaggerDocument = require(`../swagger/swagger${ORG}.json`);
    }

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    require('../router/index.js')(app)
    return app
}
