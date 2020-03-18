module.exports = function (app) {
    var request = require('../controller/operation')
    var verifyAPIkey = require('../Util/verifyAPIkey')
    const logger = require('../Util/logger.js');

    // ลงทะเบียนสมาชิก
    app.post('/registerUser', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().registerUser(req.body))
            res.status(result.statusCode)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------Product ------------------------
    app.post('/IssueProduct', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssueProduct(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.post('/queryProduct', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryProduct(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.get('/queryGarden', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryProduct(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------Consumer ------------------------
    app.post('/registerConsumer', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().registerConsumer(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.put('/addPoint', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().addPoint(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.put('/usePoint', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().usePoint(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryConsumer', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryConsumer(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryConsumer', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryConsumer(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------Garden ------------------------
    app.post('/IssueGarden', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssueGarden(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.post('/queryGarden', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryGarden(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.get('/queryGarden', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryGarden(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.put('/IssuePrepareStock', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssuePrepareStock(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)
            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/IssueStock', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssueStock(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryStock', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryStock(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    // -----------------------------PlanYears------------------------------------------
    app.post('/IssuePlanYear', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssuePlanYear(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.post('/queryPlanYear', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryPlanYear(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.get('/queryPlanYear', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryPlanYear(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------Planting---------------------------------------------------------- 
    app.post('/IssuePlanting', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().IssuePlanting(req.body))
            res.status(201)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.post('/queryPlanting', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryPlanting(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })

    app.get('/queryPlanting', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().queryPlanting(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------AddManagePlanting------------------------------------------
    app.put('/AddManagePlanting', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().AddManagePlanting(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    // -----------------------------AddHarvest------------------------------------------
    app.put('/AddHarvest', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().AddHarvest(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    //-------------------------------AddSelling-------------------
    app.put('/AddSelling', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().AddSelling(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/AddSelling', verifyAPIkey, async (req, res) => {
        try {
            var result = (await new request().AddSelling(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    
    // การตรวจสอบเอกสาร
    app.post('/Verify', async (req, res) => {
        try {
            var result = (await new request().Verify(req.body))
            res.status(201)
            //var status = "201"
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryVerify', async (req, res) => {
        try {
            var result = (await new request().queryVerify(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryVerify', async (req, res) => {
        try {
            var result = (await new request().queryVerify(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryHarvest', async (req, res) => {
        try {
            var result = (await new request().queryHarvest(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryHarvest', async (req, res) => {
        try {
            var result = (await new request().queryHarvest(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/querySelling', async (req, res) => {
        try {
            var result = (await new request().querySelling(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/querySelling', async (req, res) => {
        try {
            var result = (await new request().querySelling(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryPlantHistory', async (req, res) => {
        try {
            var result = (await new request().queryPlantHistory(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryPlantHistory', async (req, res) => {
        try {
            var result = (await new request().queryPlantHistory(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryMainpage', async (req, res) => {
        try {
            var result = (await new request().queryMainpage(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryMainpage', async (req, res) => {
        try {
            var result = (await new request().queryMainpage(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.get('/queryHarvest', async (req, res) => {
        try {
            var result = (await new request().queryHarvest(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/queryHarvest', async (req, res) => {
        try {
            var result = (await new request().queryHarvest(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })
    app.post('/querySelling', async (req, res) => {
        try {
            var result = (await new request().querySelling(req.body))
            res.status(200)
            res.json(result)
        } catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                message: error.message || error
            }
            logger.error(messageError.message)

            res.status(messageError.statusCode)
            res.json(messageError)
        }
    })






}

