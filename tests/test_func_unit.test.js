// lib //npm install mocha -g
const chai = require("chai")
const chai_http = require("chai-http")

// app url
const app = require("../server")
// mock data sample 

// use time to mock identity document for unit case
var moment = require('moment')
const mock_register_BC_user = require("./mock_register_BC_user")

//mock service
const service = require('../blockchain/service')
const operation = require('../controller/operation')
const attribute = require('../controller/attribute')

// jest.mock('../controller/operation')
jest.mock('../blockchain/service')
jest.mock('../controller/attribute')

//hash sha256
const converthash = require('../Util/hash256')
// apikey
const apikey = converthash.hash("sampran|api_sdk_service") //"558344f429d66e42b53ff6449710cea0f79211c2163d3d92b4180eaee3b6afd1"
var hash_garden = converthash.hash("1") //"715fa1897856e980c20252fdc4cefb44ef38b03104c4da22de11a31a5d32c893"
var hash_plan_year = converthash.hash("1|2018-08-04") //"93d84274e56ef83e6f33b7d432694ff671102af71404ba44563ceb8157134899"
var hash_planting = converthash.hash(`2|${hash_plan_year}`) //"cde9687d582fd954b976ad4579c175143f4c3583f18a9fdd35ec58ebcf4fd65a" 
var hash_verify = converthash.hash(`${hash_plan_year}|2018-10-21|12345`)
var hash_stock = converthash.hash(`ธนพล`)
var hash_consumer = converthash.hash(`Ohmsm0150`)

var GardenDockeyword = "GardenDoc|"
var PlanYearkeyword = "PlanYearDoc|"
var Plantingkeyword = "PlantDoc|"
var Verifykeyword = "VerifyDoc|"
var Stockkeyword = "StockDoc|"

//chaincode_name
const CC_NAME_ISSUE_GARDEN = "IssueGarden"
const CC_NAME_ISSUE_STOCK = "IssueStock"
const CC_NAME_ISSUE_PREPARESTOCK = "IssuePrepareStock"
const CC_NAME_ISSUE_PLANYEARMODEL = "IssuePlanYearModel"
const CC_NAME_ISSUE_SELLING = "AddSelling"
const CC_NAME_ISSUE_ManagePlanting = "IssueManagePlanting"
const CC_NAME_ISSUE_Harvest = "IssueHarvest"
const CC_NAME_ISSUE_PLANTING = "IssuePlanting"
const CC_NAME_REGISTER_CONSUMER = "registerConsumer"
const CC_NAME_ADD_POINT = "addPoint"
const CC_NAME_USE_POINT = "usePoint"
const CC_NAME_VERIFY = "Verify"

chai.use(chai_http)

/*
##################################################################################################
#################################### UNIT TEST POSITIVE(+) #######################################
##################################################################################################
*/
describe('Positive(+) Uint test controller.', function () {
    // beforeAll(function () {
    //     const service.mockImplement

    // })

    // it("POST API KEY authorization ", async function () {
    //     this.timeout(5000)

    //     let userPayload = {
    //         "bc_user": `123456${timestamp}`,
    //         "OrgDepartment": "org1.department1",
    //     }

    //     let result = await chai.request(app)
    //         .post("/registerUser") // request_url 
    //         //.set('apikey', apikey) // request_header 
    //         .set("Content-Type", "application/json")
    //         .send(userPayload);
    //     chai.expect(result.status).to.equal(401)
    // });

    //example bc_user : 1234562019-09-18T10-11-03
    it("@1 called operation register BC_user", async function () {
        let userPayload = {
            "bc_user": `123456`,
            "OrgDepartment": "org1.department1",
        }
        let resmessage = `Successfully registered blockchain user ${userPayload.bc_user} and insert it into mongoDB`
        const blockchain_service_mock = {};
        blockchain_service_mock.registerUser = jest
            .fn()
            .mockResolvedValue(resmessage);
        service.mockImplementation(() => blockchain_service_mock)
        let result = await new operation().registerUser(userPayload)
        expect(blockchain_service_mock.registerUser).toHaveBeenCalledWith(
            userPayload.bc_user,
            userPayload.OrgDepartment
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(resmessage)
    });

    it("@2 called operation Issue Garden Document", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);

        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_garden,
            IssueGardenPayload.app_user,
            IssueGardenPayload.garden_name,
            IssueGardenPayload.owner,
            IssueGardenPayload.areas,
            JSON.stringify(IssueGardenPayload.history_use_chemical),
        ]

        attribute.ParseIssueGardenAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().IssueGarden(IssueGardenPayload)
        expect(attribute.ParseIssueGardenAttr).toHaveBeenCalledWith(
            IssueGardenPayload,
            hash_garden
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            IssueGardenPayload.bc_user,
            CC_NAME_ISSUE_GARDEN,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(`Request for [IssueGarden] CREATE GardenDoc|${hash_garden} : ${resInvoke}`)
    });

    it("@3 called operation Query Garden Document", async function () {
        let GardenPayload = {
            "bc_user": `123456`,
            "garden_id": `1`
        }
        let QueryResult = {
            "statusCode": 200,
            "message": {
                "garden_name": "แปลงป้าจำเจียก",
                "garden_id": "1",
                "owner": "สมชาย นะครับ",
                "areas": "13ไร่ 2งาน",
                "date_final_use_chemical": "2019-7-3",
                "history_use_chemical": {
                    "name_use_chemical": "toxic chemical"
                },
                "status": "อินทรีย์",
                "path_image": [
                    "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
                ],
                "app_user": "สมชาย1"
            }
        }
        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));

        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryGarden(GardenPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            GardenPayload.bc_user,
            GardenDockeyword + hash_garden
        )
        expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
        // expect(result.statusCode).toEqual(200)
        // expect(result.message).toMatchObject(QueryResult)
    });

    it("@4 called operation Issue PlanYear Document", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_plan_year,
            hash_garden,
            PlanYearPayload.planyear_date,
            PlanYearPayload.app_user,
            PlanYearPayload.user_name,
            PlanYearPayload.group_name,
            PlanYearPayload.garden_id,
            PlanYearPayload.agri_standard

        ]
        attribute.ParsePlanYearAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().IssuePlanYear(PlanYearPayload)
        expect(attribute.ParsePlanYearAttr).toHaveBeenCalledWith(
            PlanYearPayload,
            hash_plan_year,
            hash_garden
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            PlanYearPayload.bc_user,
            CC_NAME_ISSUE_PLANYEARMODEL,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(`Request for [IssuePlanYear] CREATE PlanYearDoc|${hash_plan_year} and UPDATE GardenDoc|${hash_garden} : ${resInvoke}`)
    });

    it("@5 called operation Query PlanYear Document", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "garden_id": `1`,
            "planyear_date": "2018-08-04"
        }
        let QueryResult = {
            "statusCode": 200,
            "message": {
                "update_date": "2018-08-04",
                "username": "สมชาย สมใจ",
                "name": "สมชาย ",
                "group": "ไร่สมชาย",
                "garden": "1",
                "planting_model": [],
                "agri_standard": "Ifoam"
            }
        }

        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryPlanYear(PlanYearPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            PlanYearPayload.bc_user,
            PlanYearkeyword + hash_plan_year
        )
        expect(result).toMatchObject({ statusCode: 200, message: [QueryResult] })
    });

    it("@6 called operation Issue Planting Document", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_planting,
            hash_plan_year,
            hash_garden,
            PlantingPayload.plant_id,
            PlantingPayload.plant_date,
            PlantingPayload.plant_name,
            PlantingPayload.seed_type,
            PlantingPayload.path_images,
            PlantingPayload.predict_harvest,
            PlantingPayload.predict_quantity
        ]
        attribute.ParseIssuePlantingAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().IssuePlanting(PlantingPayload)
        expect(attribute.ParseIssuePlantingAttr).toHaveBeenCalledWith(
            PlantingPayload,
            hash_planting,
            hash_plan_year,
            hash_garden
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            PlantingPayload.bc_user,
            CC_NAME_ISSUE_PLANTING,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(`Request for [IssuePlanting] CREATE PlantDoc|${hash_plan_year} and UPDATE PlanYearDoc|${hash_planting} ,GardenDoc|${hash_garden} : ${resInvoke}`)
    });

    it("@7 called operation Query Planting Document", async function () {
        let PlantingPayload = {
            "bc_user": `123456`,
            "garden_id": `1`,
            "plant_id": `2`,
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04"
        }
        let QueryResult = {
            "statusCode": 200,
            "message": {
                "plan_id": "2",
                "plant_date": "2018-08-04",
                "plant_name": "สวน",
                "seed_type": "qwerty",
                "predict_harvest": "2019-10-19",
                "predict_quantity": 1000,
                "production_activities": [],
                "harvest": [],
                "selling": [],
                "path_images": "/home/sampran/images.jp",
                "update_date": "2018-08-04"
            }
        }

        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryPlanting(PlantingPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            PlantingPayload.bc_user,
            Plantingkeyword + hash_planting
        )
        expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
    });


    it("@8 called operation Add Manage Planting Document", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_planting,
            ManagePlantingPayload.app_user,
            ManagePlantingPayload.production_id,
            ManagePlantingPayload.production_name,
            ManagePlantingPayload.production_date,
            ManagePlantingPayload.activities_detail,
            ManagePlantingPayload.production_factor,

        ]
        attribute.ParseManagePlantingAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        expect(attribute.ParseManagePlantingAttr).toHaveBeenCalledWith(
            ManagePlantingPayload,
            hash_planting
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            ManagePlantingPayload.bc_user,
            CC_NAME_ISSUE_ManagePlanting,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(200)
        expect(result.message).toEqual(`Request for [AddManagePlanting] UPDATE PlantingDoc|${hash_planting} : ${resInvoke}`)
    });

    it("@9 called operation Add Harvest Document", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_planting,
            hash_plan_year,
            HarvestPayload.harvest_transform_check,
            HarvestPayload.harvesting_product_date_data,
            JSON.stringify(HarvestPayload.quantity),
            JSON.stringify(HarvestPayload.total),
            HarvestPayload.app_user,
            HarvestPayload.harvest_date
        ]
        attribute.ParseHarvestAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().AddHarvest(HarvestPayload)
        expect(attribute.ParseHarvestAttr).toHaveBeenCalledWith(
            HarvestPayload,
            hash_planting,
            hash_plan_year
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            HarvestPayload.bc_user,
            CC_NAME_ISSUE_Harvest,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(200)
        expect(result.message).toEqual(`Request for [AddHarvest] UPDATE PlantYearDoc|${hash_plan_year} and PlantingDoc|${hash_planting} : ${resInvoke}`)
    });

    it("@10 called operation Add Selling Document", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_planting,
            hash_plan_year,
            JSON.stringify(SellingPayload.sell),
            SellingPayload.selling_date,
            SellingPayload.app_user,
            SellingPayload.lot_no
        ]
        attribute.ParseAddSellingAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().AddSelling(SellingPayload)
        expect(attribute.ParseAddSellingAttr).toHaveBeenCalledWith(
            SellingPayload,
            hash_planting,
            hash_plan_year
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            SellingPayload.bc_user,
            CC_NAME_ISSUE_SELLING,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(200)
        expect(result.message).toEqual(`Request for [AddSelling] UPDATE PlantYearDoc|${hash_plan_year} and PlantingDoc|${hash_planting} : ${resInvoke}`)
    });

    /*it("@11 called operation Query PlanYear & planting Document", async function () {
        let PlanYearPayload = {
            "bc_user": "123456",
            "garden_id": 1,
            "planyear_date": "2018-08-04"
        }
        let QueryPYResult = {
            "statusCode": 200,
            "message": [
                {
                    "update_date": "2018-08-04",
                    "username": "สมชาย1",
                    "name": "นายสมชาย สมใจ",
                    "group": "ไร่สมชาย",
                    "planting_model": [
                        {
                            "plant_id": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
                            "status": "ขายแล้ว",
                            "plant_name": "สวน",
                            "path_images": "/home/sampran/images.jp"
                        },
                    ],
                    "garden": "1",
                    "agri_standard": "Ifoam"
                }
            ]
        }
        let QueryPResult = {
            "statusCode": 200,
            "message": {
                "plan_id": "2",
                "plant_date": "2018-08-04",
                "plant_name": "สวน",
                "seed_type": "qwerty",
                "predict_harvest": "2019-10-19",
                "predict_quantity": 1000,
                "production_activities": [
                    {
                        "app_user": "Jirapon0150",
                        "production_id": 1,
                        "production_name": "รดน้ำ",
                        "production_date": "2018-08-04",
                        "activities_detail": "รดน้ำวันละ3ครั้ง",
                        "production_factor": "ฝักบัว"
                    }
                ],
                "harvest": [
                    {
                        "App_user": "123456",
                        "Harvest_date": "2020-12-20",
                        "harvest_transform_check": "yes",
                        "harvesting_product_date_data": "2018-09-04",
                        "quantity": [
                            {
                                "quantity_grade": "A",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 60
                            },
                            {
                                "quantity_grade": "B",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 60
                            },
                            {
                                "quantity_grade": "C",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 100
                            },
                            {
                                "quantity_grade": "D",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 100
                            },
                            {
                                "quantity_grade": "E",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 100
                            },
                            {
                                "quantity_grade": "weste",
                                "quantity_amount": 100,
                                "quantity_amount_sell": 100
                            }
                        ],
                        "total": [
                            {
                                "total_grade": "good",
                                "total_amount": 500,
                                "total_amount_sell": 420
                            },
                            {
                                "total_grade": "bod",
                                "total_amount": 100,
                                "total_amount_sell": 0
                            }
                        ],
                        "lote_no": ""
                    }
                ],
                "selling": [
                    {
                        "Sell": [
                            {
                                "selling_grade": "A",
                                "selling_market_place": "rudsapa",
                                "selling_amount": 40
                            },
                            {
                                "selling_grade": "B",
                                "selling_market_place": "TH",
                                "selling_amount": 40
                            }
                        ],
                        "selling_date": "2019-10-11",
                        "app_user": "123456",
                        "lot_no": "2020-12-20"
                    }
                ],
                "path_images": "/home/sampran/images.jp",
                "update_date": "2018-09-04"
            }
        }
        let QueryResult = [
            {
                "statusCode": 200,
                "message": [
                    {
                        "update_date": "2018-08-04",
                        "username": "สมชาย1",
                        "name": "นายสมชาย สมใจ",
                        "group": "ไร่สมชาย",
                        "planting_model": [
                            {
                                "plant_id": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
                                "status": "ขายแล้ว",
                                "plant_name": "สวน",
                                "path_images": "/home/sampran/images.jp"
                            }
                        ],
                        "garden": "1",
                        "agri_standard": "Ifoam"
                    },
                    {
                        "plan_id": "2",
                        "plant_date": "2018-08-04",
                        "plant_name": "สวน",
                        "seed_type": "qwerty",
                        "predict_harvest": "2019-10-19",
                        "predict_quantity": 1000,
                        "production_activities": [
                            {
                                "app_user": "Jirapon0150",
                                "production_id": 1,
                                "production_name": "รดน้ำ",
                                "production_date": "2018-08-04",
                                "activities_detail": "รดน้ำวันละ3ครั้ง",
                                "production_factor": "ฝักบัว"
                            }
                        ],
                        "harvest": [
                            {
                                "App_user": "123456",
                                "Harvest_date": "2020-12-20",
                                "harvest_transform_check": "yes",
                                "harvesting_product_date_data": "2018-09-04",
                                "quantity": [
                                    {
                                        "quantity_grade": "A",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 60
                                    },
                                    {
                                        "quantity_grade": "B",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 60
                                    },
                                    {
                                        "quantity_grade": "C",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 100
                                    },
                                    {
                                        "quantity_grade": "D",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 100
                                    },
                                    {
                                        "quantity_grade": "E",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 100
                                    },
                                    {
                                        "quantity_grade": "weste",
                                        "quantity_amount": 100,
                                        "quantity_amount_sell": 100
                                    }
                                ],
                                "total": [
                                    {
                                        "total_grade": "good",
                                        "total_amount": 500,
                                        "total_amount_sell": 420
                                    },
                                    {
                                        "total_grade": "bad",
                                        "total_amount": 100,
                                        "total_amount_sell": 0
                                    }
                                ],
                                "lote_no": ""
                            }
                        ],
                        "selling": [
                            {
                                "Sell": [
                                    {
                                        "selling_grade": "A",
                                        "selling_market_place": "rudsapa",
                                        "selling_amount": 40
                                    },
                                    {
                                        "selling_grade": "B",
                                        "selling_market_place": "TH",
                                        "selling_amount": 40
                                    }
                                ],
                                "selling_date": "2019-10-11",
                                "app_user": "123456",
                                "lot_no": "2020-12-20"
                            }
                        ],
                        "path_images": "/home/sampran/images.jp",
                        "update_date": "2018-09-04"
                    }
                ]
            }
        ]

        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryPYResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryPlanYear(PlanYearPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            PlanYearPayload.bc_user,
            PlanYearkeyword + hash_plan_year
        )

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryPResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            PlanYearPayload.bc_user,
            Plantingkeyword + QueryPYResult.message[0].planting_model[0].plant_id
        )
        expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
    });*/

    it("@12 called operation Verify Document", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);
        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_plan_year,
            hash_verify,
            VerifyPayload.farmer_name,
            VerifyPayload.garden,
            VerifyPayload.product_factor,
            VerifyPayload.garden_doc,
            VerifyPayload.organic_standard,
            VerifyPayload.basic_production_info,
            VerifyPayload.verify_limit,
            VerifyPayload.ceritificate,
            VerifyPayload.imgs_report,
            VerifyPayload.imgs_result,
            VerifyPayload.img_signature,
            VerifyPayload.issue_date,
            VerifyPayload.app_user
        ]
        attribute.ParseVerifyAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().Verify(VerifyPayload)
        expect(attribute.ParseVerifyAttr).toHaveBeenCalledWith(
            VerifyPayload,
            hash_plan_year,
            hash_verify
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            VerifyPayload.bc_user,
            CC_NAME_VERIFY,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(`Request for [Printverifyform] CREATE VerifyDoc|${hash_verify} : ${resInvoke}`)
    });
    it("@13 called operation Query Verify Document", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "garden": "1",
            "issue_date": "2018-10-21"
        }
        let QueryResult = {
            "statusCode": 200,
            "message": {
                "farmer_name": "ภพสรรค์​เอมโอษฐ์",
                "garden": "1",
                "product_factor": {
                    "available": "true",
                    "complete": "false"
                },
                "garden_doc": {
                    "available": "true",
                    "complete": "false"
                },
                "organic_standard": "true",
                "basic_production_info": {},
                "verify_limit": {
                    "option1": "true",
                    "option2": "true",
                    "option3": "true",
                    "option4": "true",
                    "option5": "true"
                },
                "ceritificate": {
                    "option1": "บลาาาาาๆๆๆๆๆ",
                    "option2": "บลาาาาาๆๆๆๆๆ",
                    "option3": "บลาาาาาๆๆๆๆๆ",
                    "option4": "บลาาาาาๆๆๆๆๆ",
                    "option5": "บลาาาาาๆๆๆๆๆ"
                },
                "imgs_report": [
                    {
                        "path": "/Users/popsan/Documents/sampran/api-sampran",
                        "Remark": ""
                    },
                    {
                        "path": "/Users/popsan/Documents/sampran/api-sampran",
                        "Remark": ""
                    }
                ],
                "imgs_result": [
                    {
                        "path": "/Users/popsan/Documents/sampran/api-sampran",
                        "Remark": ""
                    },
                    {
                        "path": "/Users/popsan/Documents/sampran/api-sampran",
                        "Remark": ""
                    }
                ],
                "Img_signature": "123456789",
                "Issue_date": "2018-10-21",
                "App_user": "12345"
            }
        }

        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryVerify(VerifyPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            VerifyPayload.bc_user,
            Verifykeyword + hash_verify
        )
        expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
    });
    it("@14 called operation Issue Stock Document", async function () {
        let StockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "Owner": "Ohmsum",
            "Location": "Ekkamai28",
            "CreateDate": "2019-10-19"
        }

        const blockchain_service_mock = {};
        let resInvoke = `Transaction has been submitted`

        blockchain_service_mock.invoke = jest
            .fn()
            .mockResolvedValue(resInvoke);

        service.mockImplementation(() => blockchain_service_mock)

        let ParsedAttrs = [
            hash_stock,
            StockPayload.bc_user,
            StockPayload.app_user,
            StockPayload.Owner,
            StockPayload.Location,
            StockPayload.CreateDate
        ]
        attribute.ParseIssueStockAttr.mockResolvedValue(ParsedAttrs);

        let result = await new operation().IssueStock(StockPayload)
        expect(attribute.ParseIssueStockAttr).toHaveBeenCalledWith(
            StockPayload,
            hash_stock
        )
        expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
            StockPayload.bc_user,
            CC_NAME_ISSUE_STOCK,
            ParsedAttrs
        )
        expect(result.statusCode).toEqual(201)
        expect(result.message).toEqual(`Request for [IssueStock] CREATE StockDoc|${hash_stock} : ${resInvoke}`)
    });

    it("@15 called operation Query Stock Document", async function () {
        let StockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล"
        }
        let QueryResult = {
            "statusCode": 200,
            "message": {
                "Owner": "Ohmsum",
                "Location": "Ekkamai28",
                "CreateDate": "2019-10-19",
                "Stock_material": []
            }
        }
        const blockchain_service_mock = {};

        blockchain_service_mock.query = jest
            .fn()
            .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));
        service.mockImplementation(() => blockchain_service_mock)

        let result = await new operation().queryStock(StockPayload)
        expect(blockchain_service_mock.query).toHaveBeenCalledWith(
            StockPayload.bc_user,
            Stockkeyword + hash_stock
        )
        expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
    });

})
it("@16 called operation Add PrepareStock", async function () {
    let AddPrepareStockPayload = {
        "bc_user": "123456",
        "app_user": "ธนพล",
        "id": 1,
        "product_unit_id": 3,
        "product_unit_name": "ห่อ",
        "name": "พลั่ว",
        "is_diy": "ture",
        "buy_from": "7-11",
        "price": 120,
        "quantity": 12,
        "image": "cp/git/stock/produck1.png"
    }

    const blockchain_service_mock = {};
    let resInvoke = `Transaction has been submitted`

    blockchain_service_mock.invoke = jest
        .fn()
        .mockResolvedValue(resInvoke);
    service.mockImplementation(() => blockchain_service_mock)

    let ParsedAttrs = [
        hash_stock,
        AddPrepareStockPayload.id,
        AddPrepareStockPayload.product_unit_id,
        AddPrepareStockPayload.product_unit_name,
        AddPrepareStockPayload.name,
        AddPrepareStockPayload.is_diy,
        AddPrepareStockPayload.buy_from,
        AddPrepareStockPayload.price,
        AddPrepareStockPayload.quantity,
        AddPrepareStockPayload.image
    ]
    attribute.ParseIssuePrepareStockAttr.mockResolvedValue(ParsedAttrs);

    let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
    expect(attribute.ParseIssuePrepareStockAttr).toHaveBeenCalledWith(
        AddPrepareStockPayload,
        hash_stock
    )
    expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
        AddPrepareStockPayload.bc_user,
        CC_NAME_ISSUE_PREPARESTOCK,
        ParsedAttrs
    )
    expect(result.statusCode).toEqual(200)
    expect(result.message).toEqual(`Request for [IssuePrepareStock] UPDATE StockDoc|${hash_stock} : ${resInvoke}`)
});
it("@17 called operation registerConsumer Document", async function () {
    let ConsumerPayload = {
        "bc_user": "123456",
        "app_user": "Ohmsm0150",
        "Platform": "Sampran"
    }

    const blockchain_service_mock = {};
    let resInvoke = `Transaction has been submitted`

    blockchain_service_mock.invoke = jest
        .fn()
        .mockResolvedValue(resInvoke);

    service.mockImplementation(() => blockchain_service_mock)

    let ParsedAttrs = [
        hash_consumer,
        ConsumerPayload.app_user,
        ConsumerPayload.Platform
    ]
    attribute.ParseregisterConsumerAttr.mockResolvedValue(ParsedAttrs);

    let result = await new operation().registerConsumer(ConsumerPayload)
    expect(attribute.ParseregisterConsumerAttr).toHaveBeenCalledWith(
        ConsumerPayload,
        hash_consumer
    )
    expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
        ConsumerPayload.bc_user,
        CC_NAME_REGISTER_CONSUMER,
        ParsedAttrs
    )
    expect(result.statusCode).toEqual(201)
    expect(result.message).toEqual(`Request for [registerConsumer] CREATE ${ConsumerPayload.Platform.toLowerCase()}|${hash_consumer} : ${resInvoke}`)
});
it("@18 called operation Query Consumer Document", async function () {
    let ConsumerPayload = {
        "bc_user": "123456",
        "app_user": "Ohmsm0150",
        "Platform": "Sampran",
    }
    let QueryResult = {
        "statusCode": 200,
        "message": {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
            "Point": 100
        }
    }
    const blockchain_service_mock = {};

    blockchain_service_mock.query = jest
        .fn()
        .mockResolvedValue((Buffer.from(JSON.stringify(QueryResult)).toString()));
    service.mockImplementation(() => blockchain_service_mock)

    let result = await new operation().queryConsumer(ConsumerPayload)
    expect(blockchain_service_mock.query).toHaveBeenCalledWith(
        ConsumerPayload.bc_user,
        ConsumerPayload.Platform.toLowerCase() + "|" + hash_consumer
    )
    expect(result).toMatchObject({ statusCode: 200, message: QueryResult })
});
it("@19 called operation addPoint", async function () {
    let addPointPayload = {
        "bc_user": "123456",
        "app_user": "Ohmsm0150",
        "Platform": "Sampran",
        "Point": 100
    }

    const blockchain_service_mock = {};
    let resInvoke = `Transaction has been submitted`

    blockchain_service_mock.invoke = jest
        .fn()
        .mockResolvedValue(resInvoke);
    service.mockImplementation(() => blockchain_service_mock)

    let ParsedAttrs = [
        hash_consumer,
        addPointPayload.app_user,
        addPointPayload.Platform,
        addPointPayload.Point
    ]
    attribute.ParseaddPointAttr.mockResolvedValue(ParsedAttrs);

    let result = await new operation().addPoint(addPointPayload)
    expect(attribute.ParseaddPointAttr).toHaveBeenCalledWith(
        addPointPayload,
        hash_consumer
    )
    expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
        addPointPayload.bc_user,
        CC_NAME_ADD_POINT,
        ParsedAttrs
    )
    expect(result.statusCode).toEqual(200)
    expect(result.message).toEqual(`Request for [addPoint] UPDATE ${addPointPayload.Platform.toLowerCase()}|${hash_consumer} : ${resInvoke}`)
});
it("@20 called operation usePoint", async function () {
    let usePointPayload = {
        "bc_user": "123456",
        "app_user": "Ohmsm0150",
        "Platform": "Sampran",
        "Point": 100
    }

    const blockchain_service_mock = {};
    let resInvoke = `Transaction has been submitted`

    blockchain_service_mock.invoke = jest
        .fn()
        .mockResolvedValue(resInvoke);
    service.mockImplementation(() => blockchain_service_mock)

    let ParsedAttrs = [
        hash_consumer,
        usePointPayload.app_user,
        usePointPayload.Platform,
        usePointPayload.Point
    ]
    attribute.ParseusePointAttr.mockResolvedValue(ParsedAttrs);

    let result = await new operation().usePoint(usePointPayload)
    expect(attribute.ParseusePointAttr).toHaveBeenCalledWith(
        usePointPayload,
        hash_consumer
    )
    expect(blockchain_service_mock.invoke).toHaveBeenCalledWith(
        usePointPayload.bc_user,
        CC_NAME_USE_POINT,
        ParsedAttrs
    )
    expect(result.statusCode).toEqual(200)
    expect(result.message).toEqual(`Request for [usePoint] UPDATE ${usePointPayload.Platform.toLowerCase()}|${hash_consumer} : ${resInvoke}`)
});

/*
##################################################################################################
#################################### UNIT TEST NEGATIVE(-) #######################################
##################################################################################################
*/

describe('Negative(-) Uint test controller.', function () {
    /**==============================================================================================================================================================================
     * =========================================================================================================================================================================
     * ===============================================================================================================================================================================
     * ===============================================================================================================================================================================
     * ==================================================================================================================================================================
     * ===================================================================================================================================================================
     * ===================================================================================================================================================================
     * =====================================================================================================================================================================================
     * =====================================================================================================================================================================
     * =======================================================================================================================================================================
     * ======================================================================================================================================================================
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     *  */
    it("@1 called operation register BC_user : bc_user bad request", async function () {
        let userPayload = {
            //"bc_user": `123456`,
            "OrgDepartment": "org1.department1",
        }
        try {
            let result = await new operation().registerUser(userPayload)
        } catch (error) {
            expect(error).toEqual(`registerUser.bc_user is required`)
        }
    });

    it("@1 called operation register BC_user : OrgDepartment bad request", async function () {
        let userPayload = {
            "bc_user": `123456`,
            //"OrgDepartment": "org1.department1",
        }
        try {
            let result = await new operation().registerUser(userPayload)
        } catch (error) {
            expect(error).toEqual(`registerUser.OrgDepartment is required`)
        }
    });

    it("@2 called operation Issue Garden Document : bc_user bad request", async function () {
        let IssueGardenPayload = {
            //"bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.bc_user is required`)
        }
    });

    it("@3 called operation Issue Garden Document : garden_id bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            //"garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.garden_id is required`)
        }
    });

    it("@4 called operation Issue Garden Document : garden_name bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            //"garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.garden_name is required`)
        }
    });

    it("@5 called operation Issue Garden Document : owner bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            //"owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.owner is required`)
        }
    });

    it("@6 called operation Issue Garden Document : areas bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            //"areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.areas is required`)
        }
    });

    it("@7 called operation Issue Garden Document : date_final_use_chemical bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            //"date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.date_final_use_chemical is required`)
        }
    });

    it("@8 called operation Issue Garden Document : history_use_chemical bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    //"name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.history_use_chemical is required`)
        }
    });

    it("@9 called operation Issue Garden Document : status bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            //"status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.status is required`)
        }
    });

    it("@10 called operation Issue Garden Document : path_image bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            /*"path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],*/
            "app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.path_image is required`)
        }
    });

    it("@11 called operation Issue Garden Document : app_user bad request", async function () {
        let IssueGardenPayload = {
            "bc_user": "123456",
            "garden_id": "1",
            "garden_name": "ลำไย",
            "owner": "JoJo",
            "areas": "13ไร่ 2งาน",
            "date_final_use_chemical": "2019-7-3",
            "history_use_chemical": [
                {
                    "name_use_chemical": "toxic chemical"
                }
            ],
            "status": "อินทรีย์",
            "path_image": [
                "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
            ],
            //"app_user": "สมชาย1"
        }
        try {
            let result = await new operation().IssueGarden(IssueGardenPayload)
        } catch (error) {
            expect(error).toEqual(`IssueGarden.app_user is required`)
        }
    });

    it("@12 called operation Query Garden Document : bc_user bad request", async function () {
        let GardenPayload = {
            //"bc_user": `123456`,
            "garden_id": `1`
        }
        try {
            let result = await new operation().queryGarden(GardenPayload)
        } catch (error) {
            expect(error).toEqual(`queryGarden.bc_user is required`)
        }
    });

    it("@13 called operation Query Garden Document : garden_id bad request", async function () {
        let GardenPayload = {
            "bc_user": `123456`,
            //"garden_id": `1`
        }
        try {
            let result = await new operation().queryGarden(GardenPayload)
        } catch (error) {
            expect(error).toEqual(`queryGarden.garden_id is required`)
        }
    });

    it("@14 called operation Issue PlanYear Document : bc_user bad request", async function () {
        let PlanYearPayload = {
            //"bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.bc_user is required`)
        }
    });

    it("@15 called operation Issue PlanYear Document : planyear_date bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            //"planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.planyear_date is required`)
        }
    });

    it("@16 called operation Issue PlanYear Document : app_user bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            //"app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.app_user is required`)
        }
    });

    it("@17 called operation Issue PlanYear Document : user_name bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            //"user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.user_name is required`)
        }
    });

    it("@18 called operation Issue PlanYear Document : group_name bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            //"group_name": "ไร่สมชาย",
            "garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.group_name is required`)
        }
    });

    it("@19 called operation Issue PlanYear Document : garden_id bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            //"garden_id": "1",
            "agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.garden_id is required`)
        }
    });

    it("@20 called operation Issue PlanYear Document : agri_standard bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "planyear_date": "2018-08-04",
            "app_user": "สมชาย1",
            "user_name": "นายสมชาย สมใจ",
            "group_name": "ไร่สมชาย",
            "garden_id": "1",
            //"agri_standard": "Ifoam"
        }
        try {
            let result = await new operation().IssuePlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanYear.agri_standard is required`)
        }
    });

    it("@21 called operation Query PlanYear Document : bc_user bad request", async function () {
        let PlanYearPayload = {
            //"bc_user": `123456`,
            "garden_id": `1`,
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanYear.bc_user is required`)
        }
    });

    it("@22 called operation Query PlanYear Document : garden_id bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            //"garden_id": `1`,
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanYear.garden_id is required`)
        }
    });

    it("@23 called operation Query PlanYear Document : planyear_date bad request", async function () {
        let PlanYearPayload = {
            "bc_user": `123456`,
            "garden_id": `1`,
            //"planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanYear(PlanYearPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanYear.planyear_date is required`)
        }
    });

    it("@24 called operation Issue Planting Document : bc_user bad request", async function () {
        let PlantingPayload = {
            //"bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.bc_user is required`)
        }
    });

    it("@25 called operation Issue Planting Document : app_user bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            //"app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.app_user is required`)
        }
    });
    
    it("@26 called operation Issue Planting Document : plant_id bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            //"plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.plant_id is required`)
        }
    });
    
    it("@27 called operation Issue Planting Document : plant_name bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            //"plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.plant_name is required`)
        }
    });

    it("@28 called operation Issue Planting Document : seed_type bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            //"seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.seed_type is required`)
        }
    });

    it("@29 called operation Issue Planting Document : garden_id bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            //"garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.garden_id is required`)
        }
    });

    it("@30 called operation Issue Planting Document : plant_date bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            //"plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.plant_date is required`)
        }
    });

    it("@31 called operation Issue Planting Document : path_images bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            //"path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.path_images is required`)
        }
    });

    it("@32 called operation Issue Planting Document : predict_harvest bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            //"predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.predict_harvest is required`)
        }
    });

    it("@33 called operation Issue Planting Document : predict_quantity bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            //"predict_quantity": 1000,
            "update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.predict_quantity is required`)
        }
    });

    it("@34 called operation Issue Planting Document : update_date bad request", async function () {
        let PlantingPayload = {
            "bc_user": "123456",
            "app_user": "สมชาย1",
            "plant_id": "2",
            "plant_name": "สวน",
            "seed_type": "qwerty",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "path_images": "/home/sampran/images.jp",
            "predict_harvest": "2019-10-19",
            "predict_quantity": 1000,
            //"update_date": "2018-10-13"
        }
        try {
            let result = await new operation().IssuePlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePlanting.update_date is required`)
        }
    });

    it("@35 called operation Query Planting Document : bc_user bad request", async function () {
        let PlantingPayload = {
            //"bc_user": `123456`,
            "garden_id": `1`,
            "plant_id": `2`,
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanting.bc_user is required`)
        }
    });

    it("@36 called operation Query Planting Document : garden_id bad request", async function () {
        let PlantingPayload = {
            "bc_user": `123456`,
            //"garden_id": `1`,
            "plant_id": `2`,
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanting.garden_id is required`)
        }
    });

    it("@37 called operation Query Planting Document : plant_id bad request", async function () {
        let PlantingPayload = {
            "bc_user": `123456`,
            "garden_id": `1`,
            //"plant_id": `2`,
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanting.plant_id is required`)
        }
    });

    it("@38 called operation Query Planting Document : planyear_date bad request", async function () {
        let PlantingPayload = {
            "bc_user": `123456`,
            "garden_id": `1`,
            "plant_id": `2`,
            "plant_date": "2018-08-04",
            //"planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().queryPlanting(PlantingPayload)
        } catch (error) {
            expect(error).toEqual(`queryPlanting.planyear_date is required`)
        }
    });

    it("@39 called operation Add Manage Planting Document : bc_user bad request", async function () {
        let ManagePlantingPayload = {
            //"bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.bc_user is required`)
        }
    });

    it("@40 called operation Add Manage Planting Document : app_user bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            //"app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.app_user is required`)
        }
    });

    it("@41 called operation Add Manage Planting Document : plant_id bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            //"plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.plant_id is required`)
        }
    });

    it("@42 called operation Add Manage Planting Document : production_id bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            //"production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.production_id is required`)
        }
    });

    it("@43 called operation Add Manage Planting Document : production_name bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            //"production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.production_name is required`)
        }
    });

    it("@44 called operation Add Manage Planting Document : activities_detail bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            //"activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.activities_detail is required`)
        }
    });

    it("@45 called operation Add Manage Planting Document : production_date bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            //"production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.production_date is required`)
        }
    });

    it("@46 called operation Add Manage Planting Document : production_factor bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            //"production_factor": "ฝักบัว",
            "garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.production_factor is required`)
        }
    });

    it("@47 called operation Add Manage Planting Document : garden_id bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            //"garden_id": "1",
            "planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.garden_id is required`)
        }
    });

    it("@48 called operation Add Manage Planting Document : planyear_date bad request", async function () {
        let ManagePlantingPayload = {
            "bc_user": "123456",
            "app_user": "Jirapon0150",
            "plant_id": "2",
            "production_id": "1",
            "production_name": "รดน้ำ",
            "activities_detail": "รดน้ำวันละ3ครั้ง",
            "production_date": "2018-08-04",
            "production_factor": "ฝักบัว",
            "garden_id": "1",
            //"planyear_date": "2018-08-04"
        }
        try {
            let result = await new operation().AddManagePlanting(ManagePlantingPayload)
        } catch (error) {
            expect(error).toEqual(`AddManagePlanting.planyear_date is required`)
        }
    });

    it("@49 called operation Add Harvest Document : bc_user bad request", async function () {
        let HarvestPayload = {
            //"bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.bc_user is required`)
        }
    });

    it("@50 called operation Add Harvest Document : harvesting_product_date_data bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            //"harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.harvesting_product_date_data is required`)
        }
    });

    it("@51 called operation Add Harvest Document : harvest_transform_check bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            //"harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.harvest_transform_check is required`)
        }
    });

    it("@52 called operation Add Harvest Document : plant_id bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            //"plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.plant_id is required`)
        }
    });

    it("@53 called operation Add Harvest Document : garden_id bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            //"garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.garden_id is required`)
        }
    });

    it("@54 called operation Add Harvest Document : planyear_date bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            //"planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.planyear_date is required`)
        }
    });

    it("@55 called operation Add Harvest Document : harvest_date bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            //"harvest_date": "2020-12-20",
            "app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.harvest_date is required`)
        }
    });

    it("@56 called operation Add Harvest Document : app_user bad request", async function () {
        let HarvestPayload = {
            "bc_user": "123456",
            "harvesting_product_date_data": "2018-09-04",
            "harvest_transform_check": "yes",
            "plant_id": "2",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "harvest_date": "2020-12-20",
            //"app_user": "123456",
            "quantity": [
                {
                    "quantity_grade": "A",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "B",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "C",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "D",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "E",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                },
                {
                    "quantity_grade": "weste",
                    "quantity_amount": 100,
                    "quantity_amount_sell": 100
                }
            ],
            "total": [
                {
                    "total_grade": "good",
                    "total_amount": 500
                },
                {
                    "total_grade": "bad",
                    "total_amount": 100
                }
            ]
        }
        try {
            let result = await new operation().AddHarvest(HarvestPayload)
        } catch (error) {
            expect(error).toEqual(`AddHarvest.app_user is required`)
        }
    });

    it("@57 called operation Add Selling Document : bc_user bad request", async function () {
        let SellingPayload = {
            //"bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.bc_user is required`)
        }
    });

    it("@58 called operation Add Selling Document : sell[].selling_grade bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    //"selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.sell.selling_grade is required`)
        }
    });

    it("@59 called operation Add Selling Document : sell[].selling_market_place bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    //"selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.sell[${i}].selling_market_place is required`)
        }
    });

    it("@60 called operation Add Selling Document : sell[].selling_amount bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    //"selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.sell[0].selling_amount is required`)
        }
    });

    it("@61 called operation Add Selling Document : selling_date bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            //"selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.selling_date is required`)
        }
    });

    it("@62 called operation Add Selling Document : garden_id bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            //"garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.garden_id is required`)
        }
    });

    it("@63 called operation Add Selling Document : planyear_date bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            //"planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.planyear_date is required`)
        }
    });

    it("@64 called operation Add Selling Document : plant_id bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            //"plant_id": "2",
            "app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.plant_id is required`)
        }
    });

    it("@65 called operation Add Selling Document : app_user bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            //"app_user": "123456",
            "lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.app_user is required`)
        }
    });

    it("@66 called operation Add Selling Document : lot_no bad request", async function () {
        let SellingPayload = {
            "bc_user": "123456",
            "sell": [
                {
                    "selling_grade": "A",
                    "selling_market_place": "rudsapa",
                    "selling_amount": 40
                },
                {
                    "selling_grade": "B",
                    "selling_market_place": "TH",
                    "selling_amount": 40
                }
            ],
            "selling_date": "2019-10-11",
            "garden_id": "1",
            "plant_date": "2018-08-04",
            "planyear_date": "2018-08-04",
            "plant_id": "2",
            "app_user": "123456",
            //"lot_no": "2020-12-20"
        }
        try {
            let result = await new operation().AddSelling(SellingPayload)
        } catch (error) {
            expect(error).toEqual(`AddSelling.lot_no is required`)
        }
    });

    it("@67 called operation Verify Document : bc_user bad request", async function () {
        let VerifyPayload = {
            //"bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.bc_user is required`)
        }
    });

    it("@68 called operation Verify Document : planyear_date bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            //"planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.planyear_date is required`)
        }
    });

    it("@69 called operation Verify Document : app_user bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            //"app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.app_user is required`)
        }
    });

    it("@70 called operation Verify Document : farmer_name bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            //"farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.farmer_name is required`)
        }
    });

    it("@71 called operation Verify Document : garden bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            //"garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.garden is required`)
        }
    });

    it("@72 called operation Verify Document : product_factor.available bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                //"available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.product_factor.available is required`)
        }
    });

    it("@73 called operation Verify Document : product_factor.complete bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                //"complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.product_factor.complete is required`)
        }
    });

    it("@74 called operation Verify Document : product_factor.available bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                //"available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.product_factor.available is required`)
        }
    });

    it("@75 called operation Verify Document : product_factor.complete bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                //"complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.bc_user is required`)
        }
    });

    it("@76 called operation Verify Document : organic_standard bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            //"organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.organic_standard is required`)
        }
    });

    it("@77 called operation Verify Document : basic_production_info bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            /*"basic_production_info": {
                "option1": "true",
                "option2": "true"
            },*/
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.basic_production_info is required`)
        }
    });

    it("@78 called operation Verify Document : verify_limit bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            /*"verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },*/
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.verify_limit is required`)
        }
    });

    it("@79 called operation Verify Document : ceritificate bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            /*"ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },*/
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.ceritificate is required`)
        }
    });

    it("@80 called operation Verify Document : imgs_report.path bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    //"path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.imgs_report.path is required`)
        }
    });

    it("@81 called operation Verify Document : imgs_report.remark bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    //"remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.imgs_result.remark is required`)
        }
    });

    it("@82 called operation Verify Document : imgs_result.path bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    //"path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.imgs_result.path is required`)
        }
    });

    it("@83 called operation Verify Document : imgs_result.remark bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    //"remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.imgs_result.remark is required`)
        }
    });

    it("@84 called operation Verify Document : img_signature bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            //"img_signature": "123456789",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.img_signature is required`)
        }
    });

    it("@85 called operation Verify Document : issue_date bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "farmer_name": "ภพสรรค์​เอมโอษฐ์",
            "garden": "1",
            "product_factor": {
                "available": "true",
                "complete": "false"
            },
            "garden_doc": {
                "available": "true",
                "complete": "false"
            },
            "organic_standard": "true",
            "basic_production_info": {
                "option1": "true",
                "option2": "true"
            },
            "verify_limit": {
                "option1": "true",
                "option2": "true",
                "option3": "true",
                "option4": "true",
                "option5": "true"
            },
            "ceritificate": {
                "option1": "บลาาาาาๆๆๆๆๆ",
                "option2": "บลาาาาาๆๆๆๆๆ",
                "option3": "บลาาาาาๆๆๆๆๆ",
                "option4": "บลาาาาาๆๆๆๆๆ",
                "option5": "บลาาาาาๆๆๆๆๆ"
            },
            "imgs_report": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "imgs_result": [
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                },
                {
                    "path": "/Users/popsan/Documents/sampran/api-sampran",
                    "remark": 100
                }
            ],
            "img_signature": "123456789",
            //"issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().Verify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`Verify.issue_date is required`)
        }
    });

    it("@86 called operation Query Verify Document : bc_user bad request", async function () {
        let VerifyPayload = {
            //"bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "garden": "1",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().queryVerify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`queryVerify.bc_user is required`)
        }
    });

    it("@87 called operation Query Verify Document : planyear_date bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            //"planyear_date": "2018-08-04",
            "app_user": "12345",
            "garden": "1",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().queryVerify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`queryVerify.planyear_date is required`)
        }
    });

    it("@88 called operation Query Verify Document : app_user bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            //"app_user": "12345",
            "garden": "1",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().queryVerify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`queryVerify.app_user is required`)
        }
    });

    it("@89 called operation Query Verify Document : garden bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            //"garden": "1",
            "issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().queryVerify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`queryVerify.garden is required`)
        }
    });

    it("@90 called operation Query Verify Document : issue_date bad request", async function () {
        let VerifyPayload = {
            "bc_user": "123456",
            "planyear_date": "2018-08-04",
            "app_user": "12345",
            "garden": "1",
            //"issue_date": "2018-10-21"
        }
        try {
            let result = await new operation().queryVerify(VerifyPayload)
        } catch (error) {
            expect(error).toEqual(`queryVerify.issue_date is required`)
        }
    });

    it("@91 called operation Issue Stock Document : bc_user bad request", async function () {
        let StockPayload = {
            //"bc_user": "123456",
            "app_user": "ธนพล",
            "Owner": "Ohmsum",
            "Location": "Ekkamai28",
            "CreateDate": "2019-10-19"
        }
        try {
            let result = await new operation().IssueStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`IssueStock.bc_user is required`)
        }
    });

    it("@92 called operation Issue Stock Document : app_user bad request", async function () {
        let StockPayload = {
            "bc_user": "123456",
            //"app_user": "ธนพล",
            "Owner": "Ohmsum",
            "Location": "Ekkamai28",
            "CreateDate": "2019-10-19"
        }
        try {
            let result = await new operation().IssueStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`IssueStock.app_user is required`)
        }
    });

    it("@93 called operation Issue Stock Document : Owner bad request", async function () {
        let StockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            //"Owner": "Ohmsum",
            "Location": "Ekkamai28",
            "CreateDate": "2019-10-19"
        }
        try {
            let result = await new operation().IssueStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`IssueStock.Owner is required`)
        }
    });

    it("@94 called operation Issue Stock Document : Location bad request", async function () {
        let StockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "Owner": "Ohmsum",
            //"Location": "Ekkamai28",
            "CreateDate": "2019-10-19"
        }
        try {
            let result = await new operation().IssueStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`IssueStock.Location is required`)
        }
    });

    it("@95 called operation Issue Stock Document : CreateDate bad request", async function () {
        let StockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "Owner": "Ohmsum",
            "Location": "Ekkamai28",
            //"CreateDate": "2019-10-19"
        }
        try {
            let result = await new operation().IssueStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`IssueStock.CreateDate is required`)
        }
    });

    it("@96 called operation Query Stock Document : bc_user bad request", async function () {
        let StockPayload = {
            //"bc_user": "123456",
            "app_user": "ธนพล"
        }
        try {
            let result = await new operation().queryStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`queryStock.bc_user is required`)
        }
    });

    it("@97 called operation Query Stock Document : app_user bad request", async function () {
        let StockPayload = {
            "bc_user": "123456",
            //"app_user": "ธนพล"
        }
        try {
            let result = await new operation().queryStock(StockPayload)
        } catch (error) {
            expect(error).toEqual(`queryStock.app_user is required`)
        }
    });

    it("@98 called operation Add PrepareStock : bc_user bad request", async function () {
        let AddPrepareStockPayload = {
            //"bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.bc_user is required`)
        }
    });

    it("@99 called operation Add PrepareStock : app_user bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            //"app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.app_user is required`)
        }
    });

    it("@100 called operation Add PrepareStock : id bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            //"id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.id is required`)
        }
    });

    it("@101 called operation Add PrepareStock : product_unit_id bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            //"product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.product_unit_id is required`)
        }
    });

    it("@102 called operation Add PrepareStock : product_unit_name bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            //"product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.product_unit_name is required`)
        }
    });

    it("@103 called operation Add PrepareStock : name bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            //"name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.name is required`)
        }
    });

    it("@104 called operation Add PrepareStock : is_diy bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            //"is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.is_diy is required`)
        }
    });

    it("@105 called operation Add PrepareStock : buy_from bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            //"buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.buy_from is required`)
        }
    });

    it("@106 called operation Add PrepareStock : price bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            //"price": 120,
            "quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.price is required`)
        }
    });

    it("@107 called operation Add PrepareStock : quantity bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            //"quantity": 12,
            "image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.quantity is required`)
        }
    });

    it("@108 called operation Add PrepareStock : image bad request", async function () {
        let AddPrepareStockPayload = {
            "bc_user": "123456",
            "app_user": "ธนพล",
            "id": 1,
            "product_unit_id": 3,
            "product_unit_name": "ห่อ",
            "name": "พลั่ว",
            "is_diy": "ture",
            "buy_from": "7-11",
            "price": 120,
            "quantity": 12,
            //"image": "cp/git/stock/produck1.png"
        }
        try {
            let result = await new operation().IssuePrepareStock(AddPrepareStockPayload)
        } catch (error) {
            expect(error).toEqual(`IssuePrepareStock.image is required`)
        }
    });

    it("@109 called operation registerConsumer Document : bc_user bad request", async function () {
        let ConsumerPayload = {
            //"bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran"
        }
        try {
            let result = await new operation().registerConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`registerConsumer.bc_user is required`)
        }
    });

    it("@110 called operation registerConsumer Document : app_user bad request", async function () {
        let ConsumerPayload = {
            "bc_user": "123456",
            //"app_user": "Ohmsm0150",
            "Platform": "Sampran"
        }
        try {
            let result = await new operation().registerConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`registerConsumer.app_user is required`)
        }
    });

    it("@111 called operation registerConsumer Document : Platform bad request", async function () {
        let ConsumerPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            //"Platform": "Sampran"
        }
        try {
            let result = await new operation().registerConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`registerConsumer.Platform is required`)
        }
    });

    it("@112 called operation Query Consumer Document : bc_user bad request", async function () {
        let ConsumerPayload = {
            //"bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
        }
        try {
            let result = await new operation().queryConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`queryConsumer.bc_user is required`)
        }
    });

    it("@113 called operation Query Consumer Document : app_user bad request", async function () {
        let ConsumerPayload = {
            "bc_user": "123456",
            //"app_user": "Ohmsm0150",
            "Platform": "Sampran",
        }
        try {
            let result = await new operation().queryConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`queryConsumer.app_user is required`)
        }
    });

    it("@114 called operation Query Consumer Document : Platform bad request", async function () {
        let ConsumerPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            //"Platform": "Sampran",
        }
        try {
            let result = await new operation().queryConsumer(ConsumerPayload)
        } catch (error) {
            expect(error).toEqual(`queryConsumer.Platform is required`)
        }
    });

    it("@115 called operation addPoint : bc_user bad request", async function () {
        let addPointPayload = {
            //"bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().addPoint(addPointPayload)
        } catch (error) {
            expect(error).toEqual(`addPoint.bc_user is required`)
        }
    });

    it("@116 called operation addPoint : app_user bad request", async function () {
        let addPointPayload = {
            "bc_user": "123456",
            //"app_user": "Ohmsm0150",
            "Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().addPoint(addPointPayload)
        } catch (error) {
            expect(error).toEqual(`addPoint.app_user is required`)
        }
    });

    it("@117 called operation addPoint : Platform bad request", async function () {
        let addPointPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            //"Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().addPoint(addPointPayload)
        } catch (error) {
            expect(error).toEqual(`addPoint.Platform is required`)
        }
    });

    it("@118 called operation addPoint : Point bad request", async function () {
        let addPointPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
            //"Point": 100
        }
        try {
            let result = await new operation().addPoint(addPointPayload)
        } catch (error) {
            expect(error).toEqual(`addPoint.Point is required`)
        }
    });

    it("@119 called operation usePoint : bc_user bad request", async function () {
        let usePointPayload = {
            //"bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().usePoint(usePointPayload)
        } catch (error) {
            expect(error).toEqual(`usePoint.bc_user is required`)
        }
    });

    it("@120 called operation usePoint : app_user bad request", async function () {
        let usePointPayload = {
            "bc_user": "123456",
            //"app_user": "Ohmsm0150",
            "Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().usePoint(usePointPayload)
        } catch (error) {
            expect(error).toEqual(`usePoint.app_user is required`)
        }
    });

    it("@121 called operation usePoint : Platform bad request", async function () {
        let usePointPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            //"Platform": "Sampran",
            "Point": 100
        }
        try {
            let result = await new operation().usePoint(usePointPayload)
        } catch (error) {
            expect(error).toEqual(`usePoint.Platform is required`)
        }
    });

    it("@122 called operation usePoint : Point bad request", async function () {
        let usePointPayload = {
            "bc_user": "123456",
            "app_user": "Ohmsm0150",
            "Platform": "Sampran",
            //"Point": 100
        }
        try {
            let result = await new operation().usePoint(usePointPayload)
        } catch (error) {
            expect(error).toEqual(`usePoint.Point is required`)
        }
    });

})
