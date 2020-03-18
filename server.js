
var express = require('./config/express')
const logger = require('./Util/logger.js')
if (process.env.ROLE == "production") {
  var mongoose = require('./config/mongoose')
  var db = mongoose();
}
var app = express()

var service = require('./blockchain/service')
new service().Init()

const port = process.env.PORT || 8000
// const host = "localhost"
app.listen(port,'0.0.0.0', () => {
  logger.info('[Swagger] http://localhost:' + port + '/api-docs/')
  logger.debug(`[Role] ${process.env.ROLE}`)
  logger.info('Start server at port ' + port)

  if (process.env.ROLE == `production`) {
    //token cs_BC
    var token = "Xswf7uOXsbHGHwcPOZXcpUJUyWyU3xA7Z3dkTp36gsr";
    //res notify to group line
    var eventNotify = {
        message: "[PROD]💪API Server Online \n[Swagger] http://206.189.152.78:7777/api-docs/"
    }
    lineNotify(token, eventNotify);

    //LINE NOTIFICATION
  process.on('SIGINT', () => {
    server.close(() => {
        //token cs_BC
        var token = "Xswf7uOXsbHGHwcPOZXcpUJUyWyU3xA7Z3dkTp36gsr";
        //res notify to group line
        var eventNotify = {
            message: "[PROD]💥API Server Shutting Down!!! ",
            //pack sticker https://devdocs.line.me/files/sticker_list.pdf
            stickerPackageId: 1,
            stickerId: 403
        }
        lineNotify(token, eventNotify);
        console.log('Process terminated')
    })
  })

  process.on('SIGTERM', () => {
    server.close(() => {
        //token cs_BC
        var token = "Xswf7uOXsbHGHwcPOZXcpUJUyWyU3xA7Z3dkTp36gsr";
        //res notify to group line
        var eventNotify = {
            message: "[PROD]💥API Server Shutting Down!!! ",
            //pack sticker https://devdocs.line.me/files/sticker_list.pdf
            stickerPackageId: 1,
            stickerId: 403
        }
        lineNotify(token, eventNotify);
        console.log('Process terminated')
    })
  })

  }

})




//line notify event
function lineNotify(token, eventNotify) {
  //LINE@NOTIFY
  console.log('Line notify to Team develop');
  var request = require('request');

  //set http request to line@notify 
  //line@notify validate token add send event to group line
  request({
      method: 'POST',
      uri: 'https://notify-api.line.me/api/notify',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Authorization': 'Bearer RmgbwNGiNZ8nu8y2Y6dMPujBRdsrTQWIZkkQ1LIuRGh'
      },
      auth: {
          'bearer': token
      },
      form: eventNotify
  }, (err, httpResponse, body) => {     //send http request to line@notify 
      if (err) {
          console.log(err);
      } else {
          // res.json({
          //     httpResponse: httpResponse,
          //     body: body
          // });
      }
  });
}


module.exports = app


