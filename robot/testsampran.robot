*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Library    OperatingSystem
*** Variables ***
${URL_GET}    http://localhost:7777
${jwt_token2}    558344f429d66e42b53ff6449710cea0f79211c2163d3d92b4180eaee3b6afd1
${bc_user}      "123456"
*** Keywords ***
POST Doc registerUser
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user":${bc_user},"OrgDepartment":"org1.department1"}
    ${response} =  postRequest   url    /registerUser   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc IssueGarden
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}    SetVariable    {"bc_user": "123456","garden_id": "1","garden_name": "ลำไย","owner": "JoJo","areas": "13ไร่ 2งาน","date_final_use_chemical": "2019-7-3", "history_use_chemical": [ { "name_use_chemical": "toxic chemical" } ],"status": "อินทรีย์","path_image": ["/home/itsaraphap/Desktop/messageImage_1567519885643.jpg" ],"app_user": "bc_123","details": "พื้นที่สูงรกรากมีหน้าผา แห้งแล้ง"}
    ${response} =  postRequest   url    /IssueGarden   headers=${headers}     data=${data} 
    ${json} =  SetVariable   ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc IssuePlanYear
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}    SetVariable    {"bc_user": ${bc_user},"planyear_date": "2018-08-04","app_user": "สมชาย1","user_name": "นายสมชาย สมใจ","group_name": "ไร่สมชาย","garden_id": "1","agri_standard": "Ifoam","register_appuser": "22/01/2000"}    
    ${response} =  postRequest   url    /IssuePlanYear   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc IssuePlanting
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"app_user": "สมชาย1","plant_id": "2","plant_name": "สวน","seed_type": "ต้นกล้า","reproduction_type": "ปักชำ", "seed_marketplace": "LemonFarm","garden_id": "1","plant_date": "2018-08-04","planyear_date": "2018-08-04","path_images": "/home/sampran/images.jp","predict_harvest": "2019-10-19","predict_quantity": 1000,"update_date": "2018-10-13"}   
    ${response} =  postRequest   url    /IssuePlanting   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc IssuePlanting2
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"app_user": "สมชาย1","plant_id": "3","plant_name": "สวน","seed_type": "ต้นกล้า","reproduction_type": "ปักชำ", "seed_marketplace": "LemonFarm","garden_id": "1","plant_date": "2018-08-04","planyear_date": "2018-08-04","path_images": "/home/sampran/images.jp","predict_harvest": "2019-10-19","predict_quantity": 1000,"update_date": "2018-10-13"}   
    ${response} =  postRequest   url    /IssuePlanting   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

PUT Doc AddManagePlanting
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"app_user": "Jirapon0150","plant_id": "2","production_id": "1","production_name": "รดน้ำ","activities_detail": "รดน้ำวันละ3ครั้ง","production_date": "2018-08-04","production_factor": "ฝักบัว","garden_id": "1","planyear_date": "2018-08-04"} 
    ${response} =  putRequest   url    /AddManagePlanting   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

PUT Doc AddHarvest
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"plant_id": "2","harvest_id": "1","lot_no": "19902","harvest_transform_check": "yes","app_user": "123456","harvest_date": "2020-12-20","product_grade_a": "100","product_grade_b": "100","product_grade_c": "100","product_grade_d": "100","product_grade_e": "100","product_total_bad": "100","unit": "ผล","process_image": "cp/git/stock/produck1.png","product_image": "cp/git/stock/produck2.png","harvest_status": "คงค้าง","tools": "รถไถ","garden_id": "1","planyear_date": "2018-08-04"}
    ${response} =  putRequest   url    /AddHarvest   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

PUT Doc AddHarvest2
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"plant_id": "2","harvest_id": "2","lot_no": "19902","harvest_transform_check": "yes","app_user": "123456","harvest_date": "2020-12-20","product_grade_a": "100","product_grade_b": "100","product_grade_c": "100","product_grade_d": "100","product_grade_e": "100","product_total_bad": "100","unit": "ผล","process_image": "cp/git/stock/produck1.png","product_image": "cp/git/stock/produck2.png","harvest_status": "คงค้าง","tools": "รถไถ","garden_id": "1","planyear_date": "2018-08-04"}
    ${response} =  putRequest   url    /AddHarvest   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

PUT Doc AddSelling
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"selling_id": "1","selling_list": [{"sold_grade_a": 50,"sold_grade_b": 30,"sold_grade_c": 20,"sold_grade_d": 50,"sold_grade_e": 50,"buyer": "darkmarket","sold_date": "2019-10-11","lot_no": "2020-12-20","app_user": "123456"}],"garden_id": "1","plant_date": "2018-08-04","planyear_date": "2018-08-04","plant_id": "2"}
    ${response} =  putRequest   url    /AddSelling   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

PUT Doc AddSelling2
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"selling_id": "2","selling_list": [{"sold_grade_a": 50,"sold_grade_b": 30,"sold_grade_c": 20,"sold_grade_d": 50,"sold_grade_e": 50,"buyer": "darkmarket","sold_date": "2019-10-11","lot_no": "2020-12-20","app_user": "123456"}],"garden_id": "1","plant_date": "2018-08-04","planyear_date": "2018-08-04","plant_id": "2"}
    ${response} =  putRequest   url    /AddSelling   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

POST Doc Verify
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user}, "plant_info": [ { "garden_id": "1", "planyear_date": "2018-08-04", "plant_id": "2" }, { "garden_id": "1", "planyear_date": "2018-08-04", "plant_id": "3" } ], "issue_date": "2018-12-21", "id": "3", "company_id": "1", "user_id": "4", "is_pass": "1", "is_approve": "null", "is_draft": "1", "inspect_date": "2019-11-18", "inspect_start_time": "12:00:00", "inspect_end_time": "17:00:00", "approve_start_date": "null", "approve_end_date": "null", "remark": "null", "data": { "inspect_type": { "type": "ตรวจโดยไม่แจ้งล่วงหน้า", "year": "null" }, "standard_type": { "type": "PGS", "year": "null" }, "consideration_for_approve": { "plan_product_support_standard": [ { "product_id": "1", "name": "ผักสลัด" }, { "product_id": "15", "name": "สลัด" } ], "approvement_and_condition": "123", "period_of_change": "123", "plan_product_unsupport_standard": [ { "product_id": "ยี่หร่า", "name": "ยี่หร่า" } ], "next_inspection": "fdsafdaf" }, "farm_document": { "prepare_plating": "มี", "farm_plan_document": "มี", "organic_standard": "มี", "prepare_plating_is_completely": "ต้องปรับปรุง", "prepare_plating_describe": "รายละเอียดปรับปรุง", "farm_plan_document_is_completely": "ต้องปรับปรุง", "farm_plan_document_describe": "รายละเอียดปรับปรุง", "organic_standard_describe": "รายละเอียดปรับปรุง" }, "planting_data": { "info": "ข้อมูลตามแผน" }, "inspection_scope": { "is_all_oranic_garden": "true", "remark": "123" }, "user_sign_data": { "farmer": { "sign_image": "/upload/inspection_verifier_sign/inspection_verifier_sign-5dde43d6710a62.93582640.png", "sign_date": "2019-12-17" }, "inspector": { "sign_image": "null", "sign_date": "2018-12-17", "sign_image_upload": "/upload/inspection_verifier_sign/inspection_verifier_sign-5dde43d6710a62.93582640.png" }, "endorser": { "sign_image": "null", "sign_date": "2019-12-17", "sign_image_upload": "/upload/inspection_verifier_sign/inspection_verifier_sign-5dde43d6710a62.93582640.png" } } }, "user_fullname": "บุญล้อม เรืองแสง", "user_farmer_code": "FAR0004", "user_address": "27 หมู่5 ", "user_latitude": "12.59968640", "user_longitude": "99.54296710", "zip_code": "76170", "district_name": "ป่าเด็ง", "amphur_name": "แก่งกระจาน", "province_name": "เพชรบุรี", "user_phone": "0868665456", "group_id": "1", "group_name": "organic", "garden_name": "แปลงที่ 1", "problem_images": [ { "id": "6", "inspect_verifier_id": "3", "image_path": "/upload/inspection_verifier_problem/inspection_verifier_problem-5de09c75b41b60.30134576.png" }, { "id": "6", "inspect_verifier_id": "3", "image_path": "/upload/inspection_verifier_problem/inspection_verifier_problem-5de0d0e3265458.89572852.png" } ], "report_images": [ { "id": "6", "inspect_verifier_id": "3", "image_path": "/upload/inspection_verifier_report/inspection_verifier_report-5de09c7e7c6894.79609671.png" } ]}   
    ${response} =  postRequest   url    /Verify   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc IssueStock
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user}, "app_user": "ธนพล", "Owner": "Ohmsum", "Location": "Ekkamai28", "CreateDate": "2019-10-19"}   
    ${response} =  postRequest   url    /IssueStock   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

PUT Doc IssuePrepareStock
    create session      url     ${URL_GET}
    ${headers}      create dictionary       Content-Type=application/json       apikey=${jwt_token2}
    ${data}     SetVariable     {"bc_user": ${bc_user}, "app_user": "ธนพล", "id": 1, "product_unit_id": 3, "product_unit_name": "ห่อ", "name": "พลั่ว", "is_diy": "ture", "buy_from": "7-11", "price": 120, "quantity": 12, "image": "cp/git/stock/produck1.png"}
    ${response}    putRequest      url  /IssuePrepareStock      headers=${headers}      data=${data}
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

POST Doc IssueProduct
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user}, "plant_info": [ { "garden_id": 1, "planyear_date": "2018-08-04", "plant_id": 2 } ], "lotNo": "1", "product_name": "Weedy", "product_image": "cp/git/stock/produck2.png"}   
    ${response} =  postRequest   url    /IssueProduct   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  201

POST Doc queryMainpage
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user}, "harvest_id": "1", "lot_no": "19902"}   
    ${response} =  postRequest   url    /queryMainpage   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

POST Doc queryPlantHistory
    create session    url    ${URL_GET}
    ${headers}  create dictionary     Content-Type=application/json         apikey=${jwt_token2}
    ${data}   SetVariable    {"bc_user": ${bc_user},"hash_planting": "472b01093cf63449a189e5b5e08ce325346094eb83b90d3304a92659415870e2"}   
    ${response} =  postRequest   url    /queryPlantHistory   headers=${headers}     data=${data} 
    ${json} =  SetVariable  ${response.json()}
    Log   ${json}
    Log   ${response}
    Log   ${data}
    Should Be Equal As Strings  ${response.status_code}  200

*** Test Cases ***
Test POST Doc registerUser
    POST Doc registerUser
Test POST Doc IssueGarden
    POST Doc IssueGarden
Test POST Doc IssuePlanYear
    POST Doc IssuePlanYear
Test POST Doc IssuePlanting
    POST Doc IssuePlanting
    POST Doc IssuePlanting2     
Test PUT Doc AddManagePlanting
    PUT Doc AddManagePlanting
Test PUT Doc AddHarvest
    PUT Doc AddHarvest
    PUT Doc AddHarvest2
Test PUT Doc AddSelling
    PUT Doc AddSelling
    PUT Doc AddSelling2
Test POST Doc IssueStock
    POST Doc IssueStock
Test PUT Doc IssuePrepareStock
    PUT Doc IssuePrepareStock
Test Post Doc IssueProduct
    Post Doc IssueProduct
Test POST Doc Verify
    POST Doc Verify
Test POST Doc queryMainpage
    POST Doc queryMainpage
Test Post Doc queryPlantHistory
    Post Doc queryPlantHistory






