
const logger = require('./logger');
const API_KEY = "apikey";
const API_SECURITY_ENABLED = process.env.API_SECURITY_ENABLED !== 'false'; //Default value is true

async function verifyAPIkey(req, res, next) {
    logger.info(`[verify API KEY]`)

    if (API_SECURITY_ENABLED) {
        var header_apikey = req.headers[API_KEY];
        // let data = await sqlKVS.getKey(); //get api key
        // sampran|api_sdk_service => sha256
        // 558344f429d66e42b53ff6449710cea0f79211c2163d3d92b4180eaee3b6afd1
        let main_apikey = "558344f429d66e42b53ff6449710cea0f79211c2163d3d92b4180eaee3b6afd1"
        logger.info(`main_apikey   : ${main_apikey}`)
        logger.debug(`header_apikey : ${header_apikey}`)
        if (main_apikey != header_apikey) {
            logger.error(`Failed to Authenticate API KEY.`);
            return res.status(401).send({ statusCode: 401, message: `Failed to Authenticate API KEY. apikey : ${header_apikey}` });
        }
        else {
            logger.info(`Accept API KEY : ${header_apikey}`)
            next();
        }
    } else {
        logger.debug('Freedom party! Security disabled, skipping all checks.');
        req.user = {
            email: process.env.ADMIN_ID
        }
    }
}
module.exports = verifyAPIkey;