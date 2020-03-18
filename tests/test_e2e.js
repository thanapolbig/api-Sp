// lib //npm install mocha -g
const chai = require("chai")
const chai_http = require("chai-http")

// app url
const app = require("../server")
// mock data sample 

// use time to mock identity document for unit case
var moment = require('moment')
const mock_register_BC_user = require("./mock_register_BC_user")

//hash sha256
const hash = require('../Util/hash256')
// apikey
const apikey = hash.hash("sampran|api_sdk_service") //"558344f429d66e42b53ff6449710cea0f79211c2163d3d92b4180eaee3b6afd1"

//===============================================================Positive========================================================================================

chai.use(chai_http)
var timestamp = moment().add(0, 'days').format('YYYY-MM-DDTHH-mm-ss') //รับจากเวลาเครื่อง

describe('Positive(+) End2End test api service sdk to HLF .', () => {

  //example bc_user : unit_testl2019-09-18T10-11-03
  it("POST register BC_user", async function () {
    this.timeout(5000)

    let userPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "OrgDepartment": "org1.department1",
    }

    let result = await chai.request(app)
      .post("/registerUser") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(userPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("POST issue Garden Document", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "bc_123",
      "garden_id": `garden_idl${timestamp}`,
      "garden_name": "ลำไย",
      "owner": "JoJo",
      "areas": "13ไร่ 2งาน",
      "date_final_use_chemical": timestamp,
      "history_use_chemical": [
        {
          "name_use_chemical": "toxic chemical"
        }
      ],
      "status": "อินทรีย์",
      "path_image": [
        "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
      ],
    }
    let result = await chai.request(app)
      .post("/IssueGarden") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("POST Query Garden Document", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "garden_id": `garden_idl${timestamp}`
    }
    let result = await chai.request(app)
      .post("/queryGarden") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST issue PlanYear Document", async function () {
    this.timeout(5000)

    let PlanYearPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "planyear_date": timestamp,
      "user_name": "นายสมชาย สมใจ",
      "group_name": "ไร่สมชาย",
      "garden_id": `garden_idl${timestamp}`,
      "agri_standard": "Ifoam"
    }
    let result = await chai.request(app)
      .post("/IssuePlanYear") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlanYearPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("POST Query PlanYear Document", async function () {
    this.timeout(5000)

    let PlanYearPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "garden_id": `garden_idl${timestamp}`,
      "planyear_date": timestamp
    }
    let result = await chai.request(app)
      .post("/queryPlanYear") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlanYearPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST issue Planting Document", async function () {
    this.timeout(5000)

    let PlantingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "plant_id": `plant_idl${timestamp}`,
      "plant_name": "ลำไย",
      "seed_type": "ลำไยเนื้อหนา",
      "garden_id": `garden_idl${timestamp}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "path_images": "/home/sampran/images.jp",
      "predict_harvest": timestamp,
      "predict_quantity": 1000,
      "update_date": timestamp
    }
    let result = await chai.request(app)
      .post("/IssuePlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlantingPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("POST Query Planting Document", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "garden_id": `garden_idl${timestamp}`,
      "plant_id": `plant_idl${timestamp}`,
      "plant_date": timestamp,
      "planyear_date": timestamp
    }
    let result = await chai.request(app)
      .post("/queryPlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("PUT Add Manage Planting", async function () {
    this.timeout(5000)

    let ManagePlantingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "plant_id": `plant_idl${timestamp}`,
      "production_id": `production_idl${timestamp}`,
      "production_name": "รดน้ำ",
      "activities_detail": "รดน้ำวันละ3ครั้ง",
      "production_date": timestamp,
      "production_factor": "ฝักบัว"
    }
    let result = await chai.request(app)
      .put("/AddManagePlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(ManagePlantingPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("PUT Add Harvest", async function () {
    this.timeout(5000)

    let HarvestPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "harvesting_product_date_data": timestamp,
      "harvest_transform_check": "NO",
      "plant_id": `plant_idl${timestamp}`,
      "garden_id": `garden_idl${timestamp}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "harvest_date": timestamp,
      "quantity": [
        {
          "quantity_grade": "5",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "4",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "3",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "2",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "1",
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
    let result = await chai.request(app)
      .put("/AddHarvest") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(HarvestPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("PUT Add Selling", async function () {
    this.timeout(5000)

    let SellingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "selling_grade": "a+",
      "selling_market_place": "rudsapa",
      "selling_amout": 50,
      "selling_date": timestamp,
      "garden_id": `garden_idl${timestamp}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "plant_id": `plant_idl${timestamp}`,
      "lot_no": `lot_nol${timestamp}`,
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
    }
    let result = await chai.request(app)
      .put("/AddSelling") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(SellingPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST issue Verify Document", async function () {
    this.timeout(5000)

    let verifyPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "planyear_date": timestamp,
      "app_user": "สมชาย1",
      "farmer_name": "ภพสรรค์​เอมโอษฐ์",
      "garden": `garden_idl${timestamp}`,
      "product_factor": {
        "available": true,
        "complete": false
      },
      "garden_doc": {
        "available": true,
        "complete": false
      },
      "organic_standard": true,
      "basic_production_info": {
        "option1": true,
        "option2": true
      },
      "verify_limit": {
        "option1": true,
        "option2": true,
        "option3": true,
        "option4": true,
        "option5": true
      },
      "ceritificate": {
        "option1": "ดีครับ",
        "option2": "ดีครับ",
        "option3": "ดีครับ",
        "option4": "ดีครับ",
        "option5": "ดีครับ"
      },
      "imgs_report": [
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        },
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        }
      ],
      "imgs_result": [
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        },
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        }
      ],
      "img_signature": "11111",
      "issue_date": timestamp
    }
    let result = await chai.request(app)
      .post("/Verify") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(verifyPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("POST Query Verify Document", async function () {
    this.timeout(5000)

    let verifyPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "planyear_date": timestamp,
      "garden": `garden_idl${timestamp}`,
      "issue_date": timestamp,
    }
    let result = await chai.request(app)
      .post("/queryVerify") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(verifyPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST issue Stock Document", async function () {
    this.timeout(5000)

    let StockPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Owner": "Ohmsm",
      "Location": "Ekkamai28",
      "CreateDate": timestamp
    }
    let result = await chai.request(app)
      .post("/IssueStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(StockPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("PUT issue PrepareStock Document", async function () {
    this.timeout(5000)

    let PrepareStockPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "id": `idl${timestamp}`,
      "product_unit_id": `product_unit_idl${timestamp}`,
      "product_unit_name": "ห่อ",
      "name": "พลั่ว",
      "is_diy": "ture",
      "buy_from": "7-11",
      "price": 120,
      "quantity": 12,
      "image": "cp/git/stock/produck1.png"
    }
    let result = await chai.request(app)
      .put("/IssuePrepareStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PrepareStockPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST Query Stock Document", async function () {
    this.timeout(5000)

    let queryStockPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
    }
    let result = await chai.request(app)
      .post("/queryStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(queryStockPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST register Consumer Document", async function () {
    this.timeout(5000)

    let ConsumerPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Platform": "Sampran"
    }
    let result = await chai.request(app)
      .post("/registerConsumer") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(ConsumerPayload);
    chai.expect(result.status).to.equal(201)
  });

  it("PuT add Point Document", async function () {
    this.timeout(5000)

    let addPointPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Platform": "Sampran",
      "Point": 100
    }
    let result = await chai.request(app)
      .put("/addPoint") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(addPointPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("PUT use Point Document", async function () {
    this.timeout(5000)

    let usePointPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Platform": "Sampran",
      "Point": 100
    }
    let result = await chai.request(app)
      .put("/usePoint") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(usePointPayload);
    chai.expect(result.status).to.equal(200)
  });

  it("POST Query Consumer Document", async function () {
    this.timeout(5000)

    let queryConsumerPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Platform": "Sampran"
    }
    let result = await chai.request(app)
      .post("/queryConsumer") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(queryConsumerPayload);
    chai.expect(result.status).to.equal(200)
  });



  // after(function () {
  //     // app.close();
  //     process.exit(0)
  // });

})

//===============================================================Negative========================================================================================

describe('Negative(-) End2End test api service sdk to HLF .', () => {
  var timestamp = moment().add(0, 'days').format('YYYY-MM-DDTHH-mm-ss') //รับจากเวลาเครื่อง

  it("POST API KEY authorization ", async function () {
    this.timeout(5000)

    let userPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "OrgDepartment": "org1.department1",
    }

    let result = await chai.request(app)
      .post("/registerUser") // request_url 
      //.set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(userPayload);
    chai.expect(result.status).to.equal(401)
  });

  //example bc_user : unit_testl2019-09-18T10-11-03
  it("POST register BC_user", async function () {
    this.timeout(5000)

    let userPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "OrgDepartment": "org1.department1",
    }

    let result = await chai.request(app)
      .post("/registerUser") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(userPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST issue Garden Document already exist", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "bc_123",
      "garden_id": `garden_idl${timestamp}`,
      "garden_name": "ลำไย",
      "owner": "JoJo",
      "areas": "13ไร่ 2งาน",
      "date_final_use_chemical": timestamp,
      "history_use_chemical": [
        {
          "name_use_chemical": "toxic chemical"
        }
      ],
      "status": "อินทรีย์",
      "path_image": [
        "/home/itsaraphap/Desktop/messageImage_1567519885643.jpg"
      ],
    }
    let result = await chai.request(app)
      .post("/IssueGarden") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query Garden Document", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย2",
      "garden_id": `garden_idl${timestamp + 1}`
    }
    let result = await chai.request(app)
      .post("/queryGarden") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST issue PlanYear Document", async function () {
    this.timeout(5000)

    let PlanYearPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "planyear_date": timestamp,
      "user_name": "นายสมชาย สมใจ",
      "group_name": "ไร่สมชาย",
      "garden_id": `garden_idl${timestamp}`,
      "agri_standard": "Ifoam"
    }
    let result = await chai.request(app)
      .post("/IssuePlanYear") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlanYearPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query PlanYear Document", async function () {
    this.timeout(5000)

    let PlanYearPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "garden_id": `garden_idl${timestamp}`,
      "planyear_date": timestamp + 1
    }
    let result = await chai.request(app)
      .post("/queryPlanYear") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlanYearPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST issue Planting Document", async function () {
    this.timeout(5000)

    let PlantingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "plant_id": `plant_idl${timestamp}`,
      "plant_name": "ลำไย",
      "seed_type": "ลำไยเนื้อหนา",
      "garden_id": `garden_idl${timestamp}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "path_images": "/home/sampran/images.jp",
      "predict_harvest": timestamp,
      "predict_quantity": 1000,
      "update_date": timestamp
    }
    let result = await chai.request(app)
      .post("/IssuePlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PlantingPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query Planting Document", async function () {
    this.timeout(5000)

    let GardenPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "garden_id": `garden_idl${timestamp + 1}`,
      "plant_id": `plant_idl${timestamp + 1}`,
      "plant_date": timestamp,
      "planyear_date": timestamp
    }
    let result = await chai.request(app)
      .post("/queryPlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(GardenPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PUT Add Manage Planting", async function () {
    this.timeout(5000)

    let ManagePlantingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "plant_id": `plant_idl${timestamp + 1}`,
      "production_id": `production_idl${timestamp}`,
      "production_name": "รดน้ำ",
      "activities_detail": "รดน้ำวันละ3ครั้ง",
      "production_date": timestamp,
      "production_factor": "ฝักบัว"
    }
    let result = await chai.request(app)
      .put("/AddManagePlanting") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(ManagePlantingPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PUT Add Harvest", async function () {
    this.timeout(5000)

    let HarvestPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "harvesting_product_date_data": timestamp,
      "harvest_transform_check": "NO",
      "plant_id": `plant_idl${timestamp + 1}`,
      "garden_id": `garden_idl${timestamp + 1}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "harvest_date": timestamp,
      "quantity": [
        {
          "quantity_grade": "5",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "4",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "3",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "2",
          "quantity_amount": 100,
          "quantity_amount_sell": 100
        },
        {
          "quantity_grade": "1",
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
    let result = await chai.request(app)
      .put("/AddHarvest") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(HarvestPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PUT Add Selling", async function () {
    this.timeout(5000)

    let SellingPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1", //new
      "selling_grade": "a+",
      "selling_market_place": "rudsapa",
      "selling_amout": 50,
      "selling_date": timestamp,
      "garden_id": `garden_idl${timestamp+1}`,
      "plant_date": timestamp,
      "planyear_date": timestamp,
      "plant_id": `plant_idl${timestamp}`,
      "lot_no": `lot_nol${timestamp}`,
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
    }
    let result = await chai.request(app)
      .put("/AddSelling") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(SellingPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST issue Verify Document", async function () {
    this.timeout(5000)

    let verifyPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "planyear_date": timestamp,
      "app_user": "สมชาย1",
      "farmer_name": "ภพสรรค์​เอมโอษฐ์",
      "garden": `garden_idl${timestamp}`,
      "product_factor": {
        "available": true,
        "complete": false
      },
      "garden_doc": {
        "available": true,
        "complete": false
      },
      "organic_standard": true,
      "basic_production_info": {
        "option1": true,
        "option2": true
      },
      "verify_limit": {
        "option1": true,
        "option2": true,
        "option3": true,
        "option4": true,
        "option5": true
      },
      "ceritificate": {
        "option1": "ดีครับ",
        "option2": "ดีครับ",
        "option3": "ดีครับ",
        "option4": "ดีครับ",
        "option5": "ดีครับ"
      },
      "imgs_report": [
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        },
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        }
      ],
      "imgs_result": [
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        },
        {
          "path": "MacBook-Pro-khxng-Popsan:api-sampran popsan$",
          "remark": "wow"
        }
      ],
      "img_signature": "11111",
      "issue_date": timestamp
    }
    let result = await chai.request(app)
      .post("/Verify") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(verifyPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query Verify Document", async function () {
    this.timeout(5000)

    let verifyPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": "สมชาย1",
      "planyear_date": timestamp,
      "garden": `garden_idl${timestamp + 1}`,
      "issue_date": timestamp,
    }
    let result = await chai.request(app)
      .post("/queryVerify") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(verifyPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST issue Stock Document", async function () {
    this.timeout(5000)

    let StockPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Owner": "Ohmsm",
      "Location": "Ekkamai28",
      "CreateDate": timestamp
    }
    let result = await chai.request(app)
      .post("/IssueStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(StockPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PUT issue PrepareStock Document", async function () {
    this.timeout(5000)

    let PrepareStockPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp + 1}`, //new
      "id": `idl${timestamp}`,
      "product_unit_id": `product_unit_idl${timestamp}`,
      "product_unit_name": "ห่อ",
      "name": "พลั่ว",
      "is_diy": "ture",
      "buy_from": "7-11",
      "price": 120,
      "quantity": 12,
      "image": "cp/git/stock/produck1.png"
    }
    let result = await chai.request(app)
      .put("/IssuePrepareStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(PrepareStockPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query Stock Document", async function () {
    this.timeout(5000)

    let queryStockPayload = {
      "bc_user": `unit_testl${timestamp + 1}`,
      "app_user": `app_userl${timestamp + 1}`, //new
    }
    let result = await chai.request(app)
      .post("/queryStock") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(queryStockPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST register Consumer Document", async function () {
    this.timeout(500)

    let ConsumerPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp}`, //new
      "Platform": "Sampran"
    }
    let result = await chai.request(app)
      .post("/registerConsumer") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(ConsumerPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PuT add Point Document", async function () {
    this.timeout(5000)

    let addPointPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp + 1}`, //new
      "Platform": "Sampran",
      "Point": 100
    }
    let result = await chai.request(app)
      .put("/addPoint") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(addPointPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("PUT use Point Document", async function () {
    this.timeout(5000)

    let usePointPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp + 1}`, //new
      "Platform": "Sampran",
      "Point": 100
    }
    let result = await chai.request(app)
      .put("/usePoint") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(usePointPayload);
    chai.expect(result.status).to.equal(500)
  });

  it("POST Query Consumer Document", async function () {
    this.timeout(5000)

    let queryConsumerPayload = {
      "bc_user": `unit_testl${timestamp}`,
      "app_user": `app_userl${timestamp + 1}`, //new
      "Platform": "Sampran"
    }
    let result = await chai.request(app)
      .post("/queryConsumer") // request_url 
      .set('apikey', apikey) // request_header 
      .set("Content-Type", "application/json")
      .send(queryConsumerPayload);
    chai.expect(result.status).to.equal(500)
  });

})

