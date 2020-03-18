const FabricCAServices = require('fabric-ca-client')
const { InMemoryWallet, FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs')
const path = require('path');
const util = require("util")
const logger = require('../Util/logger.js');

const mongoose = require('../Util/mongoose.js');
const adduser = require('../models/user')
const addadmin = require('../models/admin')

const CONFIG_CHANNEL_NAME = "origin"
const CONFIG_CHAINCODE_NAME = "sampran"

// read package.json<Scripts> 
const ORG = process.env.ORG
const CA = process.env.CA
const CONNECTTION = process.env.CONNECTTION
const ROLE = process.env.ROLE || "developer"

// read file
const ccpPath = path.resolve(__dirname, `config/${CONNECTTION}`); //
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


const walletPath = path.join(process.cwd(), `./blockchain/keyStore/wallet${ORG}`);
const wallet = new FileSystemWallet(walletPath);
class service {

    async Init() {
        var functionName = "[Blockchain.Init]"
        return new Promise(async function (resolve, reject) {

            try {
                const caInfo = ccp.certificateAuthorities[CA];
                const ca = new FabricCAServices(caInfo.url);

                const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
                const identity = X509WalletMixin.createIdentity(`${ORG}MSP`, enrollment.certificate, enrollment.key.toBytes());
                if (ROLE == "production") {
                    // Check to see if we've already enrolled the admin in mongoDB.
                    const adminExists = await new mongoose().compare({ enrollmentID: 'admin' }, "admin")
                    if (adminExists) {
                        var admin = {
                            enrollmentID: 'admin',
                            identity: identity
                        }
                        const add = new addadmin(admin)
                        await add.save()
                        logger.info('Successfully enrolled admin user "admin" and insert it into mongoDB');
                    }
                    logger.debug(`adminExists : ${adminExists}`);

                } else {
                    // Check to see if we've already enrolled the admin in Local.
                    const adminExists = await wallet.exists('admin');

                    if (!adminExists) {
                        await wallet.import('admin', identity);
                        logger.info('Successfully enrolled admin user "admin" and imported it into the wallet');
                    }
                    logger.debug(`adminExists : ${!adminExists}`);
                }

                logger.info(`${functionName}:Blockchain Network is Ready`);
                resolve(`${functionName}:Blockchain Network is Ready`);
            } catch (error) {
                let messageError = {
                    statusCode: 500,
                    message: `${functionName} Failed to enroll admin user "admin" [Error] ${error}`
                }
                // logger.error(messageError.message)
                reject(messageError)  
                return;
            }
        })
    }
    async registerUser(user, OrgDepartment) {
        var functionName = "[Blockchain.registerUser]"
        var result = ""
        return new Promise(async function (resolve, reject) {
            // Create a new gateway for connecting to our peer node.
            let gateway = new Gateway();
            try {
                if (ROLE == "production") {
                    // Check to see if we've already enrolled the user.
                    var userExists = await new mongoose().compare({ userName: user }, 'user')

                    if (!userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} [Error] An identity for the user ${user} already exists in the MongoDB`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }

                    // Check to see if we've already enrolled the admin user.
                    var adminExists = await new mongoose().compare({ enrollmentID: "admin" }, "admin")

                    if (adminExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the enrollAdmin application before retrying' [Error] 'An identity for the admin user "admin" does not exist in the MongoDB'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    const AdminMongoDB = await new mongoose().get({ enrollmentID: 'admin' }, 'admin');

                    const walletInMongoDB = new InMemoryWallet();
                    await walletInMongoDB.import('admin', AdminMongoDB[0].identity);
                    await gateway.connect(ccp, { wallet: walletInMongoDB, identity: 'admin', discovery: { enabled: false } });

                    // Get the CA client object from the gateway for interacting with the CA.
                    const ca = gateway.getClient().getCertificateAuthority();
                    const adminIdentity = gateway.getCurrentIdentity();

                    // Register the user, enroll the user, and import the new identity into the MongoDB.
                    const secret = await ca.register({ affiliation: OrgDepartment, enrollmentID: user, role: 'client' }, adminIdentity);
                    const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
                    const userIdentity = X509WalletMixin.createIdentity(`${ORG}MSP`, enrollment.certificate, enrollment.key.toBytes());
                    var userAsJson = {
                        userName: user,
                        userIdentity: userIdentity
                    }
                    const add = new adduser(userAsJson)
                    // add user in mongoDB
                    await add.save()
                    result = `Successfully registered blockchain user ${user} and insert it into mongoDB`
                    // add user in Local
                    await wallet.import(user, userIdentity);

                } else { //ลงเครื่อง
                    // Create a new file system based wallet for managing identities.
                    logger.debug(`Wallet path: ${walletPath}`);

                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(user);
                    if (userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} [Error] An identity for the user ${user} already exists in the wallet`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }

                    // Check to see if we've already enrolled the admin user.
                    const adminExists = await wallet.exists('admin');
                    if (!adminExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the enrollAdmin application before retrying' [Error] 'An identity for the admin user "admin" does not exist in the wallet'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }


                    await gateway.connect(ccp, { wallet: wallet, identity: 'admin', discovery: { enabled: false } });
                    // Get the CA client object from the gateway for interacting with the CA.
                    const ca = gateway.getClient().getCertificateAuthority();
                    const adminIdentity = gateway.getCurrentIdentity();
                    // Register the user, enroll the user, and import the new identity into the wallet.
                    const secret = await ca.register({ affiliation: OrgDepartment, enrollmentID: user, role: 'client' }, adminIdentity);
                    const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
                    const userIdentity = X509WalletMixin.createIdentity(`${ORG}MSP`, enrollment.certificate, enrollment.key.toBytes());
                    // add user in Local
                    await wallet.import(user, userIdentity);
                    result = `Successfully registered blockchain user ${user} and imported it into the wallet`

                }
                // Disconnect from the gateway.
                await gateway.disconnect();

                logger.info(`${result}`);
                resolve(`${result}`);
            } catch (error) {
                let messageError = {
                    statusCode: 500,
                    message: `${functionName} Failed to register blockchain_user : ${user} [Error] ${error}`
                }
                // logger.error(messageError.message)
                reject(messageError)  
                return;
            }
        })
    }

    // functionName :createusers
    // args :{ford,0000,1111,hash}
    async invoke(user, Chaincodefunc, args) {
        return new Promise(async function (resolve, reject) {
            // Create a new gateway for connecting to our peer node.
            var functionName = "[Blockchain.invoke]"
            let gateway = new Gateway();
            try {
                if (ROLE == "production") {
                    // Check to see if we've already enrolled the user.
                    var userExists = await new mongoose().compare({ userName: user }, 'user')
                    if (userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser application before retrying' [Error] 'An identity for the user ${user} does not exist in the MongoDB'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }

                    var walletInMongoDB = await new InMemoryWallet();
                    const UserMongoDB = await new mongoose().get({ userName: user }, 'user');
                    await walletInMongoDB.import(user, UserMongoDB[0].userIdentity);
                    // var walletInMongoDB = await new InMemoryWallet(UserMongoDB[0].identity);

                    await gateway.connect(ccp, { wallet: walletInMongoDB, identity: user, discovery: { enabled: false, asLocalhost: true } });


                } else {
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(user);
                    if (!userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser.js application before retrying' [Error] 'An identity for the user ${user} does not exist in the wallet'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    await gateway.connect(ccp, { wallet: wallet, identity: user, discovery: { enabled: false, asLocalhost: true } });

                }

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);

                // Get the contract from the network.
                const contract = await network.getContract(CONFIG_CHAINCODE_NAME);
                // Submit the specified transaction.
                const argsString = args.map((arg) => util.format('%s', arg)).join('|');

                logger.debug(`argsString : ${argsString}`)

                var result =  await contract.submitTransaction(Chaincodefunc, argsString);
                logger.info(`Request for ${Chaincodefunc} : Transaction has been submitted`);

                // Disconnect from the gateway.
                await gateway.disconnect();
                if(result == null){
                    resolve(`Transaction has been submitted`);
                }else {
                    resolve(result)
                }
            } catch (error) {
                let messageError = {
                    statusCode: 500,
                    message: `${functionName} Chaincode failed to submit transaction [Error] ${error}`
                }
                // logger.error(messageError.message)
                reject(messageError)  
                return;
            }
        })
    }

    async query(user, valkey) {
        var functionName = "[Blockchain.query]"

        // Create a new gateway for connecting to our peer node.
        return new Promise(async function (resolve, reject) {

            let gateway = new Gateway();
            try {

                if (ROLE == "production") {

                    // Check to see if we've already enrolled the user.
                    var userExists = await new mongoose().compare({ userName: user }, 'user')
                    if (userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser.js application before retrying' [Error] 'An identity for the user ${user} does not exist in the MongoDB'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    var UserMongoDB = await new mongoose().get({ userName: user }, 'user');

                    const walletInMongoDB = new InMemoryWallet();
                    await walletInMongoDB.import(user, UserMongoDB[0].userIdentity);

                    await gateway.connect(ccp, { wallet: walletInMongoDB, identity: user, discovery: { enabled: true, asLocalhost: true } });

                } else {
                    // Check to see if we've already enrolled the user.
                    var userExists = await wallet.exists(user);
                    if (!userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser.js application before retrying' [Error] 'An identity for the user ${user} does not exist in the wallet'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    // var User = await new mongoose().get({ userName: user }, 'user');

                    await gateway.connect(ccp, { wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

                }

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
                // Get the contract from the network.
                const contract = network.getContract(CONFIG_CHAINCODE_NAME);
                // Evaluate the specified transaction.
                const result = await contract.evaluateTransaction('query', valkey);
                logger.info(`Transaction has been evaluated, result is: ${result}`);

                // Disconnect from the gateway.
                await gateway.disconnect();

                resolve(result.toString())
            } catch (error) {
                let messageError = {
                    statusCode: 500,
                    message: `${functionName} Chaincode failed to evaluate a transaction [Error] ${error}`
                }
                // logger.error(messageError.message)
                reject(messageError)  
                return;
            }
        })
    }
    async queryHistory(user, stateKey) {
        var functionName = "[Blockchain.queryHistory]"

        return new Promise(async function (resolve, reject) {
            // Create a new gateway for connecting to our peer node.
            let gateway = new Gateway();
            try {

                if (ROLE == "production") {

                    // Check to see if we've already enrolled the user.
                    var userExists = await new mongoose().compare({ userName: user }, 'user')
                    if (userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser.js application before retrying' [Error] 'An identity for the user ${user} does not exist in the MongoDB'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    var UserMongoDB = await new mongoose().get({ userName: user }, 'user');

                    const walletInMongoDB = new InMemoryWallet();
                    await walletInMongoDB.import(user, UserMongoDB[0].userIdentity);

                    await gateway.connect(ccp, { wallet: walletInMongoDB, identity: user, discovery: { enabled: true, asLocalhost: true } });

                } else {
                    // Check to see if we've already enrolled the user.
                    var userExists = await wallet.exists(user);
                    if (!userExists) {
                        let messageError = {
                            statusCode: 500,
                            message: `${functionName} 'Run the registerUser.js application before retrying' [Error] 'An identity for the user ${user} does not exist in the wallet'`
                        }
                        // logger.error(messageError.message)
                        reject(messageError)  
                        return;
                    }
                    // var User = await new mongoose().get({ userName: user }, 'user');

                    await gateway.connect(ccp, { wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });
                }
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
                // Get the contract from the network.
                const contract = network.getContract(CONFIG_CHAINCODE_NAME);
                // Evaluate the specified transaction.
                const result = await contract.evaluateTransaction('queryHistory', stateKey);
                logger.info(`Transaction has been evaluated, result is: ${result}`);

                // Disconnect from the gateway.
                await gateway.disconnect();
                resolve(result.toString())
            } catch (error) {
                let messageError = {
                    statusCode: 500,
                    message: `${functionName} Chaincode failed to evaluate history for transaction [Error] ${error}`
                }
                // logger.error(messageError.message)
                reject(messageError)  
                return;
            }
        })
    }
}
module.exports = service