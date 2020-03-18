
 class  mongoose {

//get data
    async get(key, collectionName){
        const Collection = require('../models/'+collectionName)
        var result = await Collection.find(key)
        if(!result[0]){
            var error = {
                error : "error : key not found key : ",
                key : key,
                collectionName : collectionName
            }
            return error
        }
        return result
    }
    
//compare data(ture/flase)
    async compare(key,collectionName){
        const Collection = require('../models/'+collectionName)
        var result = await Collection.find(key)
        console.log(`find value in DB result : ${result}`)
        if(!result[0]){ return true } // nil
        else { return false }      // value
    }

//delete data 
    async delete(key,collectionName){
        const Collection = require('../models/'+collectionName)
        var result = await Collection.find(key)
        if(!result[0]){
            var error = {
                            error : "error : key not found key : ",
                            key : key,
                            collectionName : collectionName
                        }
            return error
        }else{ 
            var result = await Collection.remove(key)  
 
            return result
        }       
    }
//update
    async update(key,collectionName,value){
        const Collection = require('../models/'+collectionName)
        var result = await Collection.find(key)
        if(!result[0]){
            var error = {
                            error : "error : key not found key : ",
                            key : key,
                            collectionName : collectionName
                        }
            return error
        }
        var resultup = await Collection.update(key,{$set:value})
        return resultup   
    }

    async  insert(key,collectionName, data) {
        const Collection = require('../models/'+collectionName)
        var result = await Collection.find(key)
        if(!result[0]){
            var error = {
                            error : "error : key not found key : ",
                            key : key,
                            collectionName : collectionName
                        }
            return error
        }
        var resultup = await Collection.insertOne({
            key: key,
            val: data
        });
        return resultup  

        }
 }
module.exports = mongoose