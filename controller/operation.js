const service = require('../blockchain/service.js')
const attribute = require('./attribute')
const converthash = require('../Util/hash256.js')
const logger = require('../Util/logger.js');

const CC_NAME_REGISTER_CONSUMER = "registerConsumer"
const CC_NAME_ADD_POINT = "addPoint"
const CC_NAME_ISSUE_PRODUCT = "IssueProduct"
const CC_NAME_USE_POINT = "usePoint"
const CC_NAME_ISSUE_GARDEN = "IssueGarden"
const CC_NAME_ISSUE_STOCK = "IssueStock"
const CC_NAME_ISSUE_PREPARESTOCK = "IssuePrepareStock"
const CC_NAME_ISSUE_PLANYEARMODEL = "IssuePlanYearModel"
const CC_NAME_ISSUE_SELLING = "AddSelling"
const CC_NAME_CREATE_ManagePlanting = "IssueManagePlanting"
const CC_NAME_CREATE_Harvest = "IssueHarvest"
const CC_NAME_ISSUE_PLANTING = "IssuePlanting"
const CC_NAME_VERIFY = "Verify"
const CC_NAME_QUERY_PlantHistory = "queryPlantHistory"
const CC_NAME_QUERY_queryMainpage = "queryMainpage"




class request {
    // -----------------------------registerUser----------------------
    async registerUser(unparsedAttrs) {
        let functionName = `[registerUser]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`registerUser.bc_user is required`)
                var OrgDepartment = unparsedAttrs.OrgDepartment || reject(`registerUser.OrgDepartment is required`)
                var result = await new service().registerUser(bc_user.toString().trim(), OrgDepartment.toString().trim())
                let message = {
                    statusCode: 201,
                    message: result
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} registerUser failed : bc_user=${bc_user} ,OrgDepartment=${OrgDepartment} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------IssueProduct---------------------------------------------------------- 
    async IssueProduct(unparsedAttrs) {
        var functionName = '[IssueProduct]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`${functionName}.bc_user is required`)
                var plant_info = unparsedAttrs.plant_info
                var HashPlanting = []
                for(var i=0; i<plant_info.length; i++) {
                    var garden_id = plant_info[i].garden_id || reject(`${functionName}.garden_id is required`)
                    var planyear_date = plant_info[i].planyear_date || reject(`${functionName}.planyear_date is required`)
                    var plant_id = plant_info[i].plant_id || reject(`${functionName}.plant_id is required`)
                    var hash_planyear = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                    var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_planyear}`)
                    HashPlanting.push(hash_planting)
                }
                var lotNo = unparsedAttrs.lotNo || reject( `IssueProduct.lotNo is required`)
                var ProductKey = "ProductDoc|"
                var hash_product = converthash.hash(`${lotNo.toString().trim()}`)
                console.log(JSON.stringify(HashPlanting))
                var parsedAttrs = await attribute.ParseIssueProductAttr(unparsedAttrs, hash_product, HashPlanting)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_PRODUCT, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE ${ProductKey}${hash_product} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ProductKey}${hash_product} [Error] ${error}`
            }
            logger.error(messageError.message)
            reject(messageError)
        }
        })
    }
    async queryProduct(unparsedAttrs) {
        let functionName = `[queryProduct]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryProduct.bc_user is required`)
                var lotNo = unparsedAttrs.lotNo || reject(`queryProduct.app_user is required`)
                var ProductKey = "ProductDoc|"
                var hash_product = converthash.hash(`${lotNo.toString().trim()}`)
                var result = await new service().query(bc_user.toString().trim(), ProductKey+hash_product)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ProductKey}${hash_product} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------IssueStock---------------------------------------------------------- 
    async IssueStock(unparsedAttrs) {
        var functionName = '[IssueStock]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssueStock.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`IssueStock.app_user is required`)
                var StockKey = "StockDoc|"
                var hash_stock = converthash.hash(`${app_user.toString().trim()}`)
                var parsedAttrs = await attribute.ParseIssueStockAttr(unparsedAttrs, hash_stock)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_STOCK, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE ${StockKey}${hash_stock} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} IssueStock failed : ${StockKey}|${hash_stock} [Error] ${error}`
            }
            logger.error(messageError.message)
            reject(messageError)
        }
        })
    }
    // -----------------------------IssuePrepareStock------------------------------------------------------------
    async IssuePrepareStock(unparsedAttrs) {
        var functionName = '[IssuePrepareStock]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssuePrepareStock.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`IssuePrepareStock.app_user is required`)
                var StockKey = "StockDoc|"
                var hash_stock = converthash.hash(`${app_user.toString().trim()}`)
                var parsedAttrs = await attribute.ParseIssuePrepareStockAttr(unparsedAttrs, hash_stock)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_PREPARESTOCK, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} UPDATE ${StockKey}${hash_stock} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} IssuePrepareStock failed : ${StockKey}|${hash_stock} [Error] ${error}`
            }
            logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryStock(unparsedAttrs) {
        let functionName = `[queryStock]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryStock.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`queryStock.app_user is required`)
                var StockKey = "StockDoc|"
                var hash_stock = converthash.hash(`${app_user.toString().trim()}`)
                var result = await new service().query(bc_user.toString().trim(), StockKey + hash_stock)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryStock failed : ${StockKey + hash_stock} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------Consumer---------------------------------------------------------- 
    async registerConsumer(unparsedAttrs) {
        var functionName = '[registerConsumer]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`registerConsumer.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`registerConsumer.app_user is required`)
                var Platform = unparsedAttrs.Platform || reject(`registerConsumer.Platform is required`)
                var ConsumerKey = `${Platform.toLowerCase()}|`
                var hash_consumer = converthash.hash(app_user.toString().trim())
                var parsedAttrs = await attribute.ParseregisterConsumerAttr(unparsedAttrs, hash_consumer)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_REGISTER_CONSUMER, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE ${ConsumerKey}${hash_consumer} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ConsumerKey}${hash_consumer} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async addPoint(unparsedAttrs) {
        var functionName = '[addPoint]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`addPoint.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`addPoint.app_user is required`)
                var Platform = unparsedAttrs.Platform || reject(`addPoint.Platform is required`)
                var ConsumerKey = `${Platform.toLowerCase()}|`
                var hash_consumer = converthash.hash(app_user.toString().trim())
                var parsedAttrs = await attribute.ParseaddPointAttr(unparsedAttrs, hash_consumer)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ADD_POINT, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} UPDATE ${ConsumerKey}${hash_consumer} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ConsumerKey}${hash_consumer} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async usePoint(unparsedAttrs) {
        var functionName = '[usePoint]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`usePoint.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`usePoint.app_user is required`)
                var Platform = unparsedAttrs.Platform || reject(`usePoint.Platform is required`)
                var ConsumerKey = `${Platform.toLowerCase()}|`
                var hash_consumer = converthash.hash(app_user.toString().trim())
                var parsedAttrs = await attribute.ParseusePointAttr(unparsedAttrs, hash_consumer)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_USE_POINT, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} UPDATE ${ConsumerKey}${hash_consumer} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ConsumerKey}${hash_consumer} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryConsumer(unparsedAttrs) {
        let functionName = `[queryConsumer]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryConsumer.bc_user is required`)
                var app_user = unparsedAttrs.app_user || reject(`queryConsumer.app_user is required`)
                var Platform = unparsedAttrs.Platform || reject(`queryConsumer.Platform is required`)
                var ConsumerKey = `${Platform.toLowerCase()}|`
                var hash_consumer = converthash.hash(app_user.toString().trim())
                var result = await new service().query(bc_user.toString().trim(), ConsumerKey + hash_consumer)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName}  failed : ${ConsumerKey}${hash_consumer} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------Garden------------------------------------------------------------
    async IssueGarden(unparsedAttrs) {
        var functionName = '[IssueGarden]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssueGarden.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`IssueGarden.garden_id is required`)
                var hash_garden = converthash.hash(`${garden_id.toString().trim()}`)
                var parsedAttrs = await attribute.ParseIssueGardenAttr(unparsedAttrs, hash_garden)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_GARDEN, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE GardenDoc|${hash_garden} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} IssueGarden failed : GardenDoc|${hash_garden} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryGarden(unparsedAttrs) {
        let functionName = `[queryGarden]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryGarden.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`queryGarden.garden_id is required`)
                var GardenKey = "GardenDoc|"
                var hash_garden = converthash.hash(`${garden_id.toString().trim()}`)
                var result = await new service().query(bc_user.toString().trim(), GardenKey + hash_garden)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryGarden failed : ${GardenKey + hash_garden} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------PlanYear------------------------ 
    async IssuePlanYear(unparsedAttrs) {
        var functionName = '[IssuePlanYear]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssuePlanYear.bc_user is required`) 
                var garden_id = unparsedAttrs.garden_id || reject(`IssuePlanYear.garden_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`IssuePlanYear.planyear_date is required`)
                var PlanYearKey = "PlanYearDoc|"
                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_garden = converthash.hash(`${garden_id.toString().trim()}`)
                var parsedAttrs = await attribute.ParsePlanYearAttr(unparsedAttrs, hash_plant_year, hash_garden)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_PLANYEARMODEL, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE PlanYearDoc|${hash_plant_year} and UPDATE GardenDoc|${hash_garden} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} IssuePlanYear failed  : ${PlanYearKey + hash_plant_year} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }

    async queryPlanYear(unparsedAttrs) {
        let functionName = `[queryPlanYear]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryPlanYear.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`queryPlanYear.garden_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`queryPlanYear.planyear_date is required`)

                var PlanYearkey = "PlanYearDoc|"
                var Plantingkey = "PlantDoc|"
                var Combine = []
                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var result_queryPlanYear = await new service().query(bc_user, PlanYearkey + hash_plant_year)
                // console.log(JSON.parse(result_queryPlanYear.toString()).planting_model)
                result_queryPlanYear = JSON.parse(result_queryPlanYear.toString())

                Combine.push(result_queryPlanYear)
                if(result_queryPlanYear.planting_model!=null){
                    for(var i=0; i<result_queryPlanYear.planting_model.length; i++){
                        var hash_planting = result_queryPlanYear.planting_model[i].plant_id
                        var result_queryPlanting = await new service().query(bc_user.toString().trim(), Plantingkey + hash_planting)
                        result_queryPlanting = JSON.parse(result_queryPlanting)
                        Combine.push(result_queryPlanting)
                    }
                }
                let message = {
                    statusCode: 200,
                    message: Combine
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryPlanYear failed : ${PlanYearkey + hash_plant_year} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------IssuePlanting---------------------
    async IssuePlanting(unparsedAttrs) {
        var functionName = '[IssuePlanting]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssuePlanting.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`IssuePlanting.garden_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`IssuePlanting.planyear_date is required`)
                var plant_id = unparsedAttrs.plant_id || reject(`IssuePlanting.plant_id is required`)

                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                var hash_garden = converthash.hash(`${garden_id.toString().trim()}`)
                var parsedAttrs = await attribute.ParseIssuePlantingAttr(unparsedAttrs, hash_planting, hash_plant_year, hash_garden)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_PLANTING, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE PlantDoc|${hash_planting} and UPDATE PlanYearDoc|${hash_plant_year} ,GardenDoc|${hash_garden} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} IssuePlanting failed : PlantYearDoc|${hash_plant_year} ,GardenDoc|${hash_garden} ,PlantingDoc|${hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryPlanting(unparsedAttrs) {
        let functionName = `[queryPlanting]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryPlanting.bc_user is required`)
                var plant_id = unparsedAttrs.plant_id || reject(`queryPlanting.plant_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`queryPlanting.planyear_date is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`queryPlanting.garden_id is required`)

                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                var planting_key = "PlantDoc|"
                var result = await new service().query(bc_user.toString().trim(), planting_key + hash_planting)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryPlanting failed : ${planting_key + hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------AddManagePlanting----------------
    async AddManagePlanting(unparsedAttrs) {
        var functionName = '[AddManagePlanting]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`AddManagePlanting.bc_user is required`)
                var plant_id = unparsedAttrs.plant_id || reject(`AddManagePlanting.plant_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`AddManagePlanting.planyear_date is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`AddManagePlanting.garden_id is required`)

                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                var parsedAttrs = await attribute.ParseManagePlantingAttr(unparsedAttrs, hash_planting)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_CREATE_ManagePlanting, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} UPDATE PlantingDoc|${hash_planting} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} AddManagePlanting failed : PlantingDoc|${hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    // -----------------------------AddHarvest------------------------ 
    async AddHarvest(unparsedAttrs) {
        var functionName = '[AddHarvest]'
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`AddHarvest.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`AddHarvest.garden_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`AddHarvest.planyear_date is required`)
                var plant_id = unparsedAttrs.plant_id || reject(`AddHarvest.plant_id is required`)
                var harvest_id = unparsedAttrs.harvest_id || reject(`AddHarvest.harvest_id is required`)
                var lot_no = unparsedAttrs.lot_no || reject(`AddHarvest.lot_no is required`)

                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                var hash_harvest = converthash.hash(`${harvest_id.toString().trim()}|${lot_no.toString().trim()}`)
                var parsedAttrs = await attribute.ParseHarvestAttr(unparsedAttrs, hash_planting,hash_harvest)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_CREATE_Harvest, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} UPDATE  Harvest|${hash_harvest} and PlantingDoc|${hash_planting} : ${result}`
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} AddHarvest failed :  Harvest|${hash_harvest} and PlantingDoc|${hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }


    //-----------------------------AddSelling-----------------
    async AddSelling(unparsedAttrs) {
        let functionName = `[AddSelling]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`AddSelling.bc_user is required`)
                var garden_id = unparsedAttrs.garden_id || reject(`AddSelling.garden_id is required`)
                var planyear_date = unparsedAttrs.planyear_date || reject(`AddSelling.planyear_date is required`)
                var plant_id = unparsedAttrs.plant_id || reject(`AddSelling.plant_id is required`)
                var selling_id = unparsedAttrs.selling_id || reject(`AddHarvest.selling_id is required`)
                var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                var hash_selling = converthash.hash(selling_id.toString().trim())
                var parsedAttrs = await attribute.ParseAddSellingAttr(unparsedAttrs, hash_planting, hash_selling)
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_ISSUE_SELLING, parsedAttrs)
                let message = {
                    statusCode: 200,
                    message: `Request for ${functionName} CREATE Selling|${hash_selling} and UPDATE PlantingDoc|${hash_planting} : ${result}`
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} AddSelling failed : Selling|${hash_selling} ,PlantingDoc|${hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    //-----------------------------querySelling-----------------
    async querySelling(unparsedAttrs) {
        let functionName = `[querySelling]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`querySelling.bc_user is required`)
                var selling_id = unparsedAttrs.selling_id || reject(`querySelling.selling_id is required`)
                var hash_selling = converthash.hash(selling_id.toString().trim())
                var selling_key = "Selling|"
                var result = await new service().query(bc_user.toString().trim(), selling_key + hash_selling)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} querySelling failed : ${selling_key + hash_selling} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
        // -----------------------------verify------------------------------------------------------------
    async Verify(unparsedAttrs) {
        let functionName = `[Printverifyform]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`Verify.bc_user is required`)
                var plant_info = unparsedAttrs.plant_info || reject(`plant_info is required`) 
                var issue_date = unparsedAttrs.issue_date || reject(`issue_date is required`) 
                var user_id = unparsedAttrs.user_id || reject(`user_id is required`) 
            
                var hash_plant_years = []
                var hash_plantings =[]
                for (let i = 0; i < plant_info.length; i++) {
                    var hash_plant_year = converthash.hash(`${plant_info[i].garden_id.toString().trim()}|${plant_info[i].planyear_date.toString().trim()}`)
                    var hash_planting = converthash.hash(`${plant_info[i].plant_id.toString().trim()}|${hash_plant_year}`)
                    hash_plant_years.push(hash_plant_year)
                    hash_plantings.push(hash_planting)
                }

                var Verify = "VerifyDoc|"
                var Verifyhash = converthash.hash(`${issue_date.toString().trim()}|${user_id.toString().trim()}`)
                var parsedAttrs = await attribute.ParseVerifyAttr(unparsedAttrs,JSON.stringify(hash_plant_years),JSON.stringify(hash_plantings),Verifyhash,plant_info[0].plant_id)
                var result = await new service().invoke(bc_user,CC_NAME_VERIFY, parsedAttrs)
                let message = {
                    statusCode: 201,
                    message: `Request for ${functionName} CREATE VerifyDoc|${Verifyhash} : ${result}`
                }
                resolve(message)

            }
            catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} Verify failed  : ${Verify + Verifyhash} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryVerify(unparsedAttrs) {
        let functionName = `[queryVerify]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryVerify.bc_user is required`)
                var issue_date = unparsedAttrs.issue_date || reject(`queryVerify.issue_date is required`)
                var user_id = unparsedAttrs.user_id || reject(`queryVerify.user_id is required`)

                var Verify = "VerifyDoc|"
                var Verifyhash = converthash.hash(`${issue_date.toString().trim()}|${user_id.toString().trim()}`)
                var result = await new service().query(bc_user.trim(), Verify + Verifyhash)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }

                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryVerify failed : ${GardenKey + hash_garden} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
   
    async queryPlantHistory(unparsedAttrs) {
        let functionName = `[queryPlantHistory]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssuePlanting.bc_user is required`)
                // var garden_id = unparsedAttrs.garden_id || reject(`IssuePlanting.garden_id is required`)
                // var planyear_date = unparsedAttrs.planyear_date || reject(`IssuePlanting.planyear_date is required`)
                // var plant_id = unparsedAttrs.plant_id || reject(`IssuePlanting.plant_id is required`)

                // var hash_plant_year = converthash.hash(`${garden_id.toString().trim()}|${planyear_date.toString().trim()}`)
                // var hash_planting = converthash.hash(`${plant_id.toString().trim()}|${hash_plant_year}`)
                // var hash_garden = converthash.hash(`${garden_id.toString().trim()}`)
                var hash_planting = unparsedAttrs.hash_planting
                var result = await new service().invoke(bc_user.toString().trim(), CC_NAME_QUERY_PlantHistory, [hash_planting])
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryPlanting failed : ${planting_key + hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }

    async queryMainpage(unparsedAttrs) {
        let functionName = `[queryMainpage]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`IssuePlanting.bc_user is required`)
                var harvest_id = unparsedAttrs.harvest_id || reject(`AddHarvest.harvest_id is required`)
                var lot_no = unparsedAttrs.lot_no || reject(`AddHarvest.lot_no is required`)

                var hash_harvest = converthash.hash(`${harvest_id.toString().trim()}|${lot_no.toString().trim()}`)

                var result = await new service().invoke(bc_user.toString().trim(),CC_NAME_QUERY_queryMainpage,[hash_harvest])
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryMainpage failed : ${planting_key + hash_planting} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async queryHarvest(unparsedAttrs) {
        let functionName = `[queryHarvest]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`queryHarvest bc_user is required`)
                var harvest_id = unparsedAttrs.harvest_id || reject(`queryHarvest harvest_id is required`)
                var lot_no = unparsedAttrs.lot_no || reject(`AddHarvest.lot_no is required`)

                var harvest_key = "Harvest|"
                var hash_harvest = converthash.hash(`${harvest_id.toString().trim()}|${lot_no.toString().trim()}`)
                var result = await new service().query(bc_user.toString().trim(),harvest_key + hash_harvest)
                console.log(hash_harvest)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} queryHarvest failed : ${hash_harvest} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async querySelling(unparsedAttrs) {
        let functionName = `[querySelling]`
        logger.info(functionName)
        return new Promise(async function (resolve, reject) {
            try {
                var bc_user = unparsedAttrs.bc_user || reject(`querySelling bc_user is required`)
                var selling_id = unparsedAttrs.selling_id || reject(`querySelling selling_id is required`)
                var selling_key = "Selling|"
                var hash_selling = converthash.hash(`${selling_id.toString().trim()}`)
                var result = await new service().query(bc_user.toString().trim(),selling_key + hash_selling)
                console.log(hash_selling)
                let message = {
                    statusCode: 200,
                    message: JSON.parse(result.toString())
                }
                resolve(message)
            } catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${functionName} querySelling failed : ${hash_selling} [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
}
module.exports = request