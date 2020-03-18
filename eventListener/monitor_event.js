var Fabric_Client = require('fabric-client');
var path = require('path');
const fs = require('fs');
var util = require('util');
var ChannelEventArray = []

const mongoose = require('../Util/mongoose.js');

// อ่าน Scripts 
const USER = process.env.USER
const CONNECTTION = process.env.CONNECTTION
const ORG = process.env.ORG
const PORT = process.env.PORT
//อ่านไฟล์ con   
const ccpPath = path.resolve(__dirname, '../blockchain', 'config/' + CONNECTTION);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
var fabric_client = new Fabric_Client();


var peer = fabric_client.newPeer(`grpc://134.209.101.63:${PORT}`);
var order = fabric_client.newOrderer('grpc://178.128.62.186:7050')
console.log(peer);
console.log(order);

//=================================       not finish yet      ==========================================
var start;
var end;
//=================================       not finish yet      ==========================================


// setup the fabric network
var channelArray = []

var store_path = path.join(__dirname, `../blockchain/keyStore/wallet${ORG}/${USER}`)
console.log('Store path:' + store_path);

event()

async function event() {
    try {
        const state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path })
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        const user_from_store = await fabric_client.getUserContext(USER, true);
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded USER from persistence');
            member_user = user_from_store;
        } else {
            throw new Error('Failed to get USER.... run registerUser.js');
        }

        console.log("ChannelEvent OK => ")
        const name = await fabric_client.queryChannels(peer)

        name.channels.forEach(channelName => {
            console.log(`${channelName.channel_id}`);
            channelArray.push(fabric_client.newChannel(channelName.channel_id))
        })
        channelArray.forEach(element => {
            element.addPeer(peer)
            element.addOrderer(order)
            console.log(`--------------------------------------------------------------------------------`);
            ChannelEventArray.push(element.newChannelEventHub(`134.209.101.63:${PORT}`))
        })
        console.log(`--------------------------------------------------------------------------------`);
        ChannelEventArray.forEach(ChannelEvent => {
            ChannelEvent.registerBlockEvent(
                (block) => {
                    //=================================       not finish yet      ==========================================

                    start = (JSON.parse(ChannelEvent.lastBlockNumber(`134.209.101.63:${PORT}`) - 5))
                    end = (JSON.parse(ChannelEvent.lastBlockNumber(`134.209.101.63:${PORT}`)))
                    console.log(start)
                    console.log(end)
                    //=================================       not finish yet      ==========================================



                    //console.log(JSON.stringify(block))

                    block.data.data.forEach(DataInput => {
                        // ใช้เช็ค json format
                        //console.log(JSON.stringify(block))


                        // ==================== Tx Hash ===============
                        const txhash = DataInput.payload.header.channel_header.tx_id
                        var TxHash = Buffer.from(txhash).toString("utf8")
                        console.log(TxHash)

                        // ====================  Timestamp =================
                        const time = DataInput.payload.header.channel_header.timestamp
                        var timestamp = Buffer.from(time).toString("utf8")
                        console.log(timestamp)

                        // ==================== Block =======================
                        const BlockNum = block.header.number
                        var Block = Buffer.from(BlockNum).toString("utf8")
                        console.log(Block)

                        // ==================== Channel =======================
                        const channelID = DataInput.payload.header.channel_header.channel_id
                        var channel = Buffer.from(channelID).toString("utf8")
                        console.log(channel)

                        // ==================== ChainCode =======================
                        const chaincodeID = DataInput.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name
                        var chaincode = Buffer.from(chaincodeID).toString("utf8")
                        console.log(chaincode)

                        // ==================== From =======================
                        const Org = DataInput.payload.header.signature_header.creator.Mspid
                        var From = Buffer.from(Org).toString("utf8")
                        console.log(From)

                        // ==================== Data Hash =======================
                        const datahash = block.header.data_hash
                        var DataHash = Buffer.from(datahash).toString("utf8")
                        console.log(DataHash)

                        // ==================== Data =======================
                        const buffer = DataInput.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[1]
                        //console.log(buffer)
                        var Data = Buffer.from(buffer).toString("utf8")
                        //console.log(Data)   
                        var str = Data.split("|")
                        //console.log(str)

                        // ==================== Function Name ===============
                        const buffer2 = DataInput.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[0]
                        var Func = Buffer.from(buffer2).toString("utf8")
                        console.log(Func)
                        // ==========================JSON Planting===========================
                        if (Func == "createPrepare") {
                            var Preprare = {
                                prepare_planting_data: JSON.parse(str[1]),
                                prepare_planting_garden: JSON.parse(str[2]),
                                prepare_planting_process_data: JSON.parse(str[3]),
                                prepare_planting_resource_data: JSON.parse(str[4]),
                                prepare_planting_problem_data: JSON.parse(str[5])
                            }
                            console.log(Preprare)
                        } else
                            // ==========================JSON Planting===========================
                            if (Func == "createPlanting") {
                                var Planting = {
                                    planting_info_data: JSON.parse(str[1]),
                                }
                                console.log(Planting)
                            } else
                                // ==========================JSON Manage===========================
                                if (Func == "createManage") {
                                    var Manage = {
                                        manage_planting_data: JSON.parse(str[1]),
                                        manage_planting_process_data: JSON.parse(str[2]),
                                        manage_planting_resource_data: JSON.parse(str[3]),
                                        manage_planting_problem_data: JSON.parse(str[4])
                                    }
                                    console.log(Manage)
                                } else
                                    // ==========================JSON Harvest===========================
                                    if (Func == "createHarvest") {
                                        var Harvest = {
                                            harvesting_garden_data: JSON.parse(str[1]),
                                            harvest_product_data: JSON.parse(str[2]),
                                            harvest_info_data: JSON.parse(str[3]),
                                        }
                                        console.log(Harvest)
                                    } else
                                        // ==========================JSON Selling===========================
                                        if (Func == "createSelling") {
                                            var Selling = {
                                                data: JSON.parse(str[1])
                                            }
                                            console.log(Selling)
                                        } else
                                            // ==========================JSON Stock===========================
                                            if (Func == "createStock") {
                                                var Stock = {
                                                    name: JSON.parse(str[1]),
                                                    price: JSON.parse(str[2]),
                                                    quantity: JSON.parse(str[3]),
                                                    unit: JSON.parse(str[4]),
                                                    date_buy: JSON.parse(str[5]),
                                                    is_reuse: JSON.parse(str[6]),
                                                    image: JSON.parse(str[7]),
                                                    cert_image: JSON.parse(str[8]),
                                                    receipt_image: JSON.parse(str[9])
                                                }
                                                console.log(Stock)
                                            } else
                                                // ==========================JSON Predict===========================
                                                if (Func == "createPredict") {
                                                    var Predict = {
                                                        plan_product_id: JSON.parse(str[1]),
                                                        product_type_unit: JSON.parse(str[2]),
                                                        harvesting_date: JSON.parse(str[3]),
                                                        selling_date: JSON.parse(str[4]),
                                                        predict_quantity: JSON.parse(str[5]),
                                                        predict_yield_market: JSON.parse(str[6]),
                                                    }
                                                    console.log(Predict)
                                                }
                    })
                },
                (err) => {
                    ChannelEvent.unregisterBlockEvent(blockid);
                    console.log(util.format('Error %s! Transaction listener has been ' +
                        'deregistered for %s', err, ChannelEvent.getPeerAddr()));
                },
                //=================================       not finish yet      ==========================================
                { startBlock: 123 },
                // { startBlock:123 ,endBlock:128}
            );
            ChannelEvent.connect(true);



        });

    } catch (err) {
        console.error('Failed to invoke successfully :: ' + err);
    }
}