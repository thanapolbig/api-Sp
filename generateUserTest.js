const request = require("./controller/operation");
const service = require("./blockchain/service");

const logger = require("./Util/logger");
const Dummyregister = require("./tests/mock/dummy-registerUser-mock.json")

new service().Init()

async function createDummyRegisterUser() {
    return new Promise(async(resolve, reject) => {
        try {
            var result = await new request().registerUser(Dummyregister)
            //logger('transaction submit')
            resolve(result)
        } catch (error) {
           // logger('erorrrrr')
            reject(error)
        }
    });
}

setTimeout(function () {
    try {
        return createDummyRegisterUser();
    } catch (error) {
        return error
    }
}, 10000)
