const User = require("../models/User");
const { insertMany, findById, exists, updateOne } = require("./mongoServices");

const insertRecord = async (records) => {
    return new Promise(async(resolve, reject) => {
         await insertMany(User,records)
            .then(r => {                
                resolve({ status: 200, msg: 'added successfully' })               
            })
            .catch(e => { console.log("erorrrrrrrr",e), reject(e)})
    })
}

const findRecordById = async (id) => {

    return new Promise(async(resolve, reject) => {
        await findById(User,id)
            .then(r => {
                resolve(r)                
            })
            .catch(e => { reject(e)})
    })
}
const recordEsist = async (value) => {

    return new Promise(async(resolve, reject) => {
        await exists(User,value)
            .then(r => {
                resolve(r)                
            })
            .catch(e => { reject(e)})
    })
}
const updateRecordByFilter = async (filter,update) => {

    return new Promise(async(resolve, reject) => {
        await updateOne(User,filter,update)
            .then(r => {
                resolve(r)                
            })
            .catch(e => { reject(e)})
    })
}

module.exports={
    insertRecord,
    findRecordById,
    recordEsist,
    updateRecordByFilter
}