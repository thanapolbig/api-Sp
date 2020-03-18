const logger = require('../Util/logger.js');
// -----------------------------ParseIssueProductAttr---------------------------------------------------------- 
function ParseIssueProductAttr(unParsedAttrs, hash_product, HashPlanting) {
    let functionName = '[ParseIssueProductAttr(unParsedAttrs, hash_product, HarvestId)]';
    return new Promise(async function (resolve, reject) {
        try {
            var ParsedAttrs = {
                hashPlanting: await ParseHashPlantingAttr(HashPlanting),
                lotNo: unParsedAttrs.lotNo,
                product_name: unParsedAttrs.product_name,
                product_image: unParsedAttrs.product_image
            }

            resolve([
                hash_product.toString().trim(),
                JSON.stringify(ParsedAttrs.hashPlanting),
                ParsedAttrs.lotNo.toString().trim(),
                ParsedAttrs.product_name.toString().trim(),
                ParsedAttrs.product_image.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}

function ParseHashPlantingAttr(HashPlanting) {
    let functionName = 'ParseHashPlantingAttr(HashPlanting)'
    var HashPlantingAsArray = []
    return new Promise(async function (resolve, reject) {
        try {
            for (let i = 0; i < HashPlanting.length; i++) {
                HashPlantingAsArray.push(HashPlanting[i])
            }
            resolve(HashPlantingAsArray)
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParseIssueGardenAttr---------------------------------------------------------- 
function ParseIssueGardenAttr(unParsedAttrs, hash_garden) {
    let functionName = '[ParseIssueGardenAttr(unParsedAttrs,hash_garden)]';
    return new Promise(async function (resolve, reject) {
        try {
            var ParsedAttrs = {
                garden_id: unParsedAttrs.garden_id || reject(`IssueGarden.garden_id is required`),
                garden_name: unParsedAttrs.garden_name || reject(`IssueGarden.garden_name is required`),
                owner: unParsedAttrs.owner || reject(`IssueGarden.owner is required`),
                areas: unParsedAttrs.areas || reject(`IssueGarden.areas is required`),
                date_final_use_chemical: unParsedAttrs.date_final_use_chemical || reject(`IssueGarden.date_final_use_chemical is required`),
                details: unParsedAttrs.details || reject(`IssueGarden.details is required`),

                // history_use_chemical: JSON.stringify(unParsedAttrs.history_use_chemical)
                history_use_chemical: await Parsehistory(unParsedAttrs.history_use_chemical),
                app_user: unParsedAttrs.app_user || reject(`IssueGarden.app_user is required`),
                status: unParsedAttrs.status || reject(`IssueGarden.status is required`),
                path_image: unParsedAttrs.path_image || reject(`IssueGarden.path_image is required`),
            }

            resolve([
                hash_garden.toString().trim(),
                ParsedAttrs.garden_name.toString().trim(),
                ParsedAttrs.garden_id.toString().trim(),
                ParsedAttrs.owner.toString().trim(),
                ParsedAttrs.areas.toString().trim(),
                ParsedAttrs.date_final_use_chemical.toString().trim(),
                JSON.stringify(ParsedAttrs.history_use_chemical),
                ParsedAttrs.status.toString().trim(),
                ParsedAttrs.path_image.toString().trim(),
                ParsedAttrs.app_user.toString().trim(),
                ParsedAttrs.details.toString().trim()

            ])
        }
        catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
function Parsehistory(history_use_chemical) {
    var historyAsArray = []
    for (let i = 0; i < history_use_chemical.length; i++) {
        let tmp_history = {
            name_use_chemical: history_use_chemical[i].name_use_chemical || reject(`AddIssueGarden.history_use_chemical[${i}].name_use_chemical is required`),
        }
        historyAsArray.push(tmp_history)
    }
    return historyAsArray
}

// -----------------------------ParseregisterConsumerAttr---------------------------------------------------------- 
function ParseregisterConsumerAttr(unParsedAttrs, hash_consumer) {
    let functionName = '[ParseregisterConsumerAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                //!add user name
                App_User: unParsedAttrs.app_user || reject(`registerConsumer.app_user is required`),
                Platform: unParsedAttrs.Platform || reject(`registerConsumer.Platform is required`)
            }
            resolve([
                hash_consumer.toString().trim(),
                ParsedAttrs.App_User.toString().trim(),
                ParsedAttrs.Platform.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParseaddPointAttr---------------------------------------------------------- 
function ParseaddPointAttr(unParsedAttrs, hash_consumer) {
    let functionName = '[ParseaddPointAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                App_User: unParsedAttrs.app_user || reject(`addPoint.app_user is required`),
                Platform: unParsedAttrs.Platform || reject(`addPoint.Platform is required`),
                Point: unParsedAttrs.Point || reject(`addPoint.Point is required`),
            }
            resolve([
                hash_consumer.toString().trim(),
                ParsedAttrs.App_User.toString().trim(),
                ParsedAttrs.Platform.toString().trim(),
                ParsedAttrs.Point.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParseusePointAttr---------------------------------------------------------- 
function ParseusePointAttr(unParsedAttrs, hash_consumer) {
    let functionName = '[ParseusePointAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                App_User: unParsedAttrs.app_user || reject(`usePoint.app_user is required`),
                Platform: unParsedAttrs.Platform || reject(`usePoint.Platform is required`),
                Point: unParsedAttrs.Point || reject(`usePoint.Point is required`),
            }
            resolve([
                hash_consumer.toString().trim(),
                ParsedAttrs.App_User.toString().trim(),
                ParsedAttrs.Platform.toString().trim(),
                ParsedAttrs.Point.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParseIssueStockAttr---------------------------------------------------------- 
function ParseIssueStockAttr(unParsedAttrs, hash) {
    let functionName = '[ParseIssueStockAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                Owner: unParsedAttrs.Owner || reject(`IssueStock.Owner is required`),
                Location: unParsedAttrs.Location || reject(`IssueStock.Location is required`),
                CreateDate: unParsedAttrs.CreateDate || reject(`IssueStock.CreateDate is required`),
            }
            resolve([
                hash.toString().trim(),
                ParsedAttrs.Owner.toString().trim(),
                ParsedAttrs.Location.toString().trim(),
                ParsedAttrs.CreateDate.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParseIssueStockAttr---------------------------------------------------------- 
function ParseIssuePrepareStockAttr(unParsedAttrs, hash) {
    let functionName = '[ParseIssuePrepareStockAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                id: unParsedAttrs.id || reject(`IssuePrepareStock.id is required`),
                product_unit_id: unParsedAttrs.product_unit_id || reject(`IssuePrepareStock.product_unit_id is required`),
                product_unit_name: unParsedAttrs.product_unit_name || reject(`IssuePrepareStock.product_unit_name is required`),
                name: unParsedAttrs.name || reject(`IssuePrepareStock.name is required`),
                is_diy: unParsedAttrs.is_diy || reject(`IssuePrepareStock.is_diy is required`),
                buy_from: unParsedAttrs.buy_from || reject(`IssuePrepareStock.buy_from is required`),
                price: unParsedAttrs.price || reject(`IssuePrepareStock.price is required`),
                quantity: unParsedAttrs.quantity || reject(`IssuePrepareStock.quantity is required`),
                image: unParsedAttrs.image || reject(`IssuePrepareStock.image is required`),
            }
            resolve([
                hash.toString().trim(),
                ParsedAttrs.id.toString().trim(),
                ParsedAttrs.product_unit_id.toString().trim(),
                ParsedAttrs.product_unit_name.toString().trim(),
                ParsedAttrs.name.toString().trim(),
                ParsedAttrs.is_diy.toString().trim(),
                ParsedAttrs.buy_from.toString().trim(),
                ParsedAttrs.price.toString().trim(),
                ParsedAttrs.quantity.toString().trim(),
                ParsedAttrs.image.toString().trim()
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
// -----------------------------ParsePlanYearAttr---------------------------------------------------------- 
function ParsePlanYearAttr(unParsedAttrs, hash_plant_year, hash_garden) {
    let functionName = '[ParsePlanYearAttr(unParsedAttrs,hash_plant_year,hash_garden)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                planyear_date: unParsedAttrs.planyear_date || reject(`IssuePlanYear.planyear_date is required`),
                app_user: unParsedAttrs.app_user || reject(`IssuePlanYear.app_user is required`),
                user_name: unParsedAttrs.user_name || reject(`IssuePlanYear.user_name is required`),
                group_name: unParsedAttrs.group_name || reject(`IssuePlanYear.group_name is required`),
                garden_id: unParsedAttrs.garden_id || reject(`IssuePlanYear.garden_id is required`),
                agri_standard: unParsedAttrs.agri_standard || reject(`IssuePlanYear.agri_standard is required`),
                register_appuser: unParsedAttrs.register_appuser || reject(`IssuePlanYear.register_appuser is required`),
            }
            resolve([
                hash_plant_year.toString().trim(),
                hash_garden.toString().trim(),
                ParsedAttrs.planyear_date.toString().trim(),
                ParsedAttrs.app_user.toString().trim(),
                ParsedAttrs.user_name.toString().trim(),
                ParsedAttrs.group_name.toString().trim(),
                ParsedAttrs.garden_id.toString().trim(),
                ParsedAttrs.agri_standard.toString().trim(),
                ParsedAttrs.register_appuser.toString().trim(),
            ])
        } catch (error) {
            logger.error(`${functionName} Parsing IssuePlanYear failed ${error}`)
            reject(`${functionName} Parsing IssuePlanYear failed ${error}`)
        }
    })
}
// -----------------------------IssuePlanting---------------------------------------------------------- 
function ParseIssuePlantingAttr(unParsedAttrs, hash_planting, hash_plant_year, hash_garden) {
    let functionName = '[ParseIssuePlantingAttr(unParsedAttrs,hash_planting, hash_plant_year, hash_garden)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                //! add user_name app_user
                app_user: unParsedAttrs.app_user || reject(`IssuePlanting.app_user is required`),
                plant_id: unParsedAttrs.plant_id || reject(`IssuePlanting.plant_id is required`),
                plant_date: unParsedAttrs.plant_date || reject(`IssuePlanting.plant_date is required`),
                plant_name: unParsedAttrs.plant_name || reject(`IssuePlanting.plant_name is required`),
                seed_type: unParsedAttrs.seed_type || reject(`IssuePlanting.seedtype is required`),
                reproduction_type: unParsedAttrs.reproduction_type,
                seed_marketplace: unParsedAttrs.seed_marketplace,
                predict_harvest: unParsedAttrs.predict_harvest || reject(`IssuePlanting.predict_harvest is required`),
                predict_quantity: unParsedAttrs.predict_quantity || reject(`IssuePlanting.predict_quantity is required`),
                path_images: unParsedAttrs.path_images || reject(`IssuePlanting.path_images is required`),
            }
            resolve([
                hash_planting.toString().trim(),
                hash_plant_year.toString().trim(),
                hash_garden.toString().trim(),
                ParsedAttrs.plant_id.toString().trim(),
                ParsedAttrs.plant_date.toString().trim(),
                ParsedAttrs.plant_name.toString().trim(),
                ParsedAttrs.seed_type.toString().trim(),
                ParsedAttrs.reproduction_type.toString().trim(),
                ParsedAttrs.seed_marketplace.toString().trim(),
                ParsedAttrs.path_images.toString().trim(),
                ParsedAttrs.predict_harvest.toString().trim(),
                ParsedAttrs.predict_quantity,
            ])
        } catch (error) {
            logger.error(`${functionName} Parsing IssuePlanting failed ${error}`)
            reject(`${functionName} Parsing IssuePlanting failed ${error}`)
        }
    })
}


// -----------------------------ManagePlantingAttr---------------------------------------------------------- 
function ParseManagePlantingAttr(unParsedAttrs, hash_planting) {
    let functionName = '[ManagePlantingAttr(unParsedAttrs,hash_planting)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                //! edit name variable
                //! add user_name app_user
                app_user: unParsedAttrs.app_user || reject(`AddManagePlanting.app_user is required`),
                production_id: unParsedAttrs.production_id || reject(`AddManagePlanting.production_id is required`),
                production_name: unParsedAttrs.production_name || reject(`AddManagePlanting.production_name is required`),
                production_date: unParsedAttrs.production_date || reject(`AddManagePlanting.production_date is required`),
                activities_detail: unParsedAttrs.activities_detail || reject(`AddManagePlanting.activities_detail is required`),
                production_factor: unParsedAttrs.production_factor || reject(`AddManagePlanting.production_factor is required`),
            }
            resolve([
                hash_planting.toString().trim(),
                ParsedAttrs.app_user.toString().trim(),
                ParsedAttrs.production_id.toString().trim(),
                ParsedAttrs.production_name.toString().trim(),
                ParsedAttrs.production_date.toString().trim(),
                ParsedAttrs.activities_detail.toString().trim(),
                ParsedAttrs.production_factor.toString().trim(),
            ])
        } catch (error) {
            logger.error(`${functionName} Parsing AddManagePlanting failed ${error}`)
            reject(`${functionName} Parsing AddManagePlanting failed ${error}`)
        }
    })
}
// -----------------------------กิจกรรมการผลิต(HarvestAttr)----------------------------------------------------------    
function ParseHarvestAttr(unParsedAttrs, hash_planting, hash_harvest) {
    let functionName = '[ParseHarvestAttr(unParsedAttrs,hash_planting, hash_plant_year)]';
    return new Promise(async function (resolve, reject) {
        try {
            var ParsedAttrs = {
                // plant_document_ref: unParsedAttrs.plant_document_ref || reject(`AddHarvest.plant_document_ref is required`),
                harvest_date: unParsedAttrs.harvest_date || reject(`AddHarvest.harvest_date is required`),
                app_user: unParsedAttrs.app_user || reject(`AddHarvest.app_user is required`),
                harvest_transform_check: unParsedAttrs.harvest_transform_check || reject(`AddHarvest.harvest_transform_check is required`),
                product_grade_a: unParsedAttrs.product_grade_a || reject(`AddHarvest.product_grade_a is required`),
                product_grade_b: unParsedAttrs.product_grade_b || reject(`AddHarvest.product_grade_b is required`),
                product_grade_c: unParsedAttrs.product_grade_c || reject(`AddHarvest.product_grade_c is required`),
                product_grade_d: unParsedAttrs.product_grade_d || reject(`AddHarvest.product_grade_d is required`),
                product_grade_e: unParsedAttrs.product_grade_e || reject(`AddHarvest.product_grade_e is required`),
                product_total_bad: unParsedAttrs.product_total_bad || reject(`AddHarvest.product_total_bad is required`),
                unit: unParsedAttrs.unit || reject(`AddHarvest.unit is required`),
                // image_path: unParsedAttrs.image_path || reject(`AddHarvest.image_path is required`),
                process_image: unParsedAttrs.process_image || reject(`AddHarvest.process_image is required`),
                product_image: unParsedAttrs.product_image || reject(`AddHarvest.product_image is required`),
                harvest_status: unParsedAttrs.harvest_status || reject(`AddHarvest.harvest_status is required`),
                tools: unParsedAttrs.tools || reject(`AddHarvest.product_image is required`),
            }
            resolve([
                hash_harvest.toString().trim(),
                hash_planting.toString().trim(),
                ParsedAttrs.harvest_date.toString().trim(),
                ParsedAttrs.app_user.toString().trim(),
                ParsedAttrs.harvest_transform_check.toString().trim(),
                ParsedAttrs.product_grade_a.toString().trim(),
                ParsedAttrs.product_grade_b.toString().trim(),
                ParsedAttrs.product_grade_c.toString().trim(),
                ParsedAttrs.product_grade_d.toString().trim(),
                ParsedAttrs.product_grade_e.toString().trim(),
                ParsedAttrs.product_total_bad.toString().trim(),
                ParsedAttrs.unit.toString().trim(),
                // ParsedAttrs.image_path.toString().trim(),
                ParsedAttrs.process_image.toString().trim(),
                ParsedAttrs.product_image.toString().trim(),
                ParsedAttrs.harvest_status.toString().trim(),
                ParsedAttrs.tools.toString().trim(),


            ])
        } catch (error) {
            logger.error(`${functionName} Parsing AddHarvest failed ${error}`)
            reject(`${functionName} Parsing AddHarvest failed ${error}`)
        }
    })
}
//-------------------------------------AddSelling------------------------------
function ParseAddSellingAttr(unParsedAttrs, hash_planting, hash_selling) {
    let functionName = '[ParseSellingAttr(unParsedAttrs,hash_planting, hash_plant_year)]';
    return new Promise(async function (resolve, reject) {
        try {
            //! add user_name app_user
            var ParsedAttrs = {
                // app_user: unParsedAttrs.app_user || reject(`AddHarvest.app_user is required`),
                selling_list: await ParseSelling(unParsedAttrs.selling_list),
                // selling_grade: unParsedAttrs.selling_grade || reject(`AddSelling.selling_grade is required`),
                // selling_market_place: unParsedAttrs.selling_market_place || reject(`AddSelling.selling_market_place is required`),
                // selling_amout: unParsedAttrs.selling_amout || reject(`AddSelling.selling_amout is required`),

            }
            console.log(ParsedAttrs.selling_list)
            resolve([
                hash_selling,
                hash_planting,
                // ParsedAttrs.selling_grade.toString().trim(),
                // ParsedAttrs.selling_market_place.toString().trim(),
                // ParsedAttrs.selling_amout.toString().trim(),
               JSON.stringify(ParsedAttrs.selling_list),
                // JSON.stringify(ParsedAttrs.selling_list),
                // ParsedAttrs.selling_date.toString().trim(),
                // ParsedAttrs.app_user.toString().trim(),
                // ParsedAttrs.lot_no.toString().trim(),

            ])
        } catch (error) {
            logger.error(`${functionName} Parsing AddSelling failed ${error}`)
            reject(`${functionName} Parsing AddSelling failed ${error}`)
        }
    })
}

function ParseSelling(selling_list) {
    var sellingAsArray = []
    return new Promise(async function (resolve, reject) {
        for (let i = 0; i < selling_list.length; i++) {
            let tmp_selling = {
                sold_grade_a: selling_list[i].sold_grade_a,//|| reject(`AddSelling.selling_list[${i}].sold_grade_a is required`),
                sold_grade_b: selling_list[i].sold_grade_b,//|| reject(`AddSelling.selling_list[${i}].sold_grade_b is required`),
                sold_grade_c: selling_list[i].sold_grade_c,//|| reject(`AddSelling.selling_list[${i}].sold_grade_c is required`),
                sold_grade_d: selling_list[i].sold_grade_d,//|| reject(`AddSelling.selling_list[${i}].sold_grade_d is required`),
                sold_grade_e: selling_list[i].sold_grade_e,//|| reject(`AddSelling.selling_list[${i}].sold_grade_e is required`),
                // sold_total:selling_list[i].sold_total || reject(`AddSelling.selling_list[${i}].sold_total is required`),
                buyer: selling_list[i].buyer || reject(`AddSelling.selling_list[${i}].buyer is required`),
                // selling_market_place: selling_list[i].selling_market_place || reject(`AddSelling.selling[${i}].selling_market_place is required`),
                sold_date: selling_list[i].sold_date || reject(`AddSelling.selling_list[${i}].sold_date is required`),
                app_user: selling_list[i].app_user || reject(`AddSelling.selling_list[${i}].app_user is required`),
                lot_no: selling_list[i].lot_no,//|| reject(`AddSelling.selling_list[${i}].lot_no is required`),
                // selling_amout: selling_list[i].selling_amout || reject(`AddSelling.selling[${i}].selling_amout is required`),
                // selling_date: unParsedAttrs.selling_date || reject(`AddSelling.selling_date is required`),
                // app_user: unParsedAttrs.app_user || reject(`AddSelling.app_user is required`),
                // lot_no: unParsedAttrs.lot_no || reject(`AddSelling.lot_no is required`),
            }
            sellingAsArray.push(tmp_selling)
        }
        console.log(sellingAsArray)
        resolve(sellingAsArray)
    })
}


//-------------------------------------ParseVerifyAttr------------------------------


function ParseVerifyAttr(unParsedAttrs, hash_plant_year,hash_planting, Verifyhash,Garden_id) {
    let functionName = '[ParseVerifyAttr(unParsedAttrs,hash)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                Farmer_name: unParsedAttrs.farmer_name,
                Id: unParsedAttrs.id,
                Company_id: unParsedAttrs.company_id,
                User_id: unParsedAttrs.user_id,
                Is_pass: unParsedAttrs.is_pass,
                Is_approve: unParsedAttrs.is_approve,
                Is_draft: unParsedAttrs.is_draft,
                Inspect_date: unParsedAttrs.inspect_date,
                Inspect_start_time: unParsedAttrs.inspect_start_time,
                Inspect_end_time: unParsedAttrs.inspect_end_time,
                Approve_start_date: unParsedAttrs.approve_start_date,
                Approve_end_date: unParsedAttrs.approve_end_date,
                Remark: unParsedAttrs.remark,
                Data: JSON.stringify(unParsedAttrs.data),
                User_fullname: unParsedAttrs.user_fullname,
                User_farmer_code: unParsedAttrs.user_farmer_code,
                User_address: unParsedAttrs.user_address,
                User_latitude: unParsedAttrs.user_latitude,
                User_longitude: unParsedAttrs.user_longitude,
                Zip_code: unParsedAttrs.zip_code,
                District_name: unParsedAttrs.district_name,
                Amphur_name: unParsedAttrs.amphur_name,
                Province_name: unParsedAttrs.province_name,
                User_phone: unParsedAttrs.user_phone,
                Group_id: unParsedAttrs.group_id,
                Group_name: unParsedAttrs.group_name,
                Garden_name: unParsedAttrs.garden_name,
                Problem_images: JSON.stringify(unParsedAttrs.problem_images),
                Report_images: JSON.stringify(unParsedAttrs.report_images),
            }
            resolve([
                hash_plant_year,
                Verifyhash,
                ParsedAttrs.Farmer_name,
                ParsedAttrs.Id,
                ParsedAttrs.Company_id,
                ParsedAttrs.User_id,
                Garden_id,
                ParsedAttrs.Is_pass,
                ParsedAttrs.Is_approve,
                ParsedAttrs.Is_draft,
                ParsedAttrs.Inspect_date,
                ParsedAttrs.Inspect_start_time,
                ParsedAttrs.Inspect_end_time,
                ParsedAttrs.Approve_start_date,
                ParsedAttrs.Approve_end_date,
                ParsedAttrs.Remark,
                ParsedAttrs.Data,
                ParsedAttrs.User_fullname,
                ParsedAttrs.User_farmer_code,
                ParsedAttrs.User_address,
                ParsedAttrs.User_latitude,
                ParsedAttrs.User_longitude,
                ParsedAttrs.Zip_code,
                ParsedAttrs.District_name,
                ParsedAttrs.Amphur_name,
                ParsedAttrs.Province_name,
                ParsedAttrs.User_phone,
                ParsedAttrs.Group_id,
                ParsedAttrs.Group_name,
                ParsedAttrs.Problem_images,
                ParsedAttrs.Report_images,
                hash_planting,
            ])
        } catch (error) {
            console.log(`${functionName} Parsing treatment failed ${error}`)
            reject(`${functionName} Parsing treatment failed ${error}`)
        }
    })
}
function ParsePlanting_History(unParsedAttrs, hash_planting, hash_plant_year, hash_garden) {
    let functionName = '[ParseIssuePlantingAttr(unParsedAttrs,hash_planting, hash_plant_year, hash_garden)]';
    return new Promise(function (resolve, reject) {
        try {
            var ParsedAttrs = {
                //! add user_name app_user
                app_user: unParsedAttrs.app_user || reject(`IssuePlanting.app_user is required`),
                plant_id: unParsedAttrs.plant_id || reject(`IssuePlanting.plant_id is required`),
                plant_date: unParsedAttrs.plant_date || reject(`IssuePlanting.plant_date is required`),
                plant_name: unParsedAttrs.plant_name || reject(`IssuePlanting.plant_name is required`),
                seed_type: unParsedAttrs.seed_type || reject(`IssuePlanting.seedtype is required`),
                predict_harvest: unParsedAttrs.predict_harvest || reject(`IssuePlanting.predict_harvest is required`),
                predict_quantity: unParsedAttrs.predict_quantity || reject(`IssuePlanting.predict_quantity is required`),
                path_images: unParsedAttrs.path_images || reject(`IssuePlanting.path_images is required`),
            }
            resolve([
                hash_planting.toString().trim(),
                hash_plant_year.toString().trim(),
                hash_garden.toString().trim(),
                ParsedAttrs.plant_id.toString().trim(),
                ParsedAttrs.plant_date.toString().trim(),
                ParsedAttrs.plant_name.toString().trim(),
                ParsedAttrs.seed_type.toString().trim(),
                ParsedAttrs.path_images.toString().trim(),
                ParsedAttrs.predict_harvest.toString().trim(),
                ParsedAttrs.predict_quantity.toString().trim(),
            ])
        } catch (error) {
            logger.error(`${functionName} Parsing IssuePlanting failed ${error}`)
            reject(`${functionName} Parsing IssuePlanting failed ${error}`)
        }
    })
}


module.exports = {
    ParseregisterConsumerAttr: ParseregisterConsumerAttr,
    ParseaddPointAttr: ParseaddPointAttr,
    ParseusePointAttr: ParseusePointAttr,
    ParseIssueGardenAttr: ParseIssueGardenAttr,
    ParseIssueStockAttr: ParseIssueStockAttr,
    ParseIssuePlantingAttr: ParseIssuePlantingAttr,
    ParsePlanYearAttr: ParsePlanYearAttr,
    ParseIssuePrepareStockAttr: ParseIssuePrepareStockAttr,
    ParseManagePlantingAttr: ParseManagePlantingAttr,
    ParseHarvestAttr: ParseHarvestAttr,
    ParseAddSellingAttr: ParseAddSellingAttr,
    ParseVerifyAttr: ParseVerifyAttr,
    ParsePlanting_History: ParsePlanting_History,
    ParseIssueProductAttr: ParseIssueProductAttr
}
