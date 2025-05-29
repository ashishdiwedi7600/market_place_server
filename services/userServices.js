const User = require("../models/User");
const { insertMany, findById } = require("./mongoServices");

const insertRecord = async (records) => {
    return new Promise(async(resolve, reject) => {
         await insertMany(User,records)
            .then(r => {                
                resolve({ status: 200, msg: 'added successfully' })               
            })
            .catch(e => { reject(e)})
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

module.exports={
    insertRecord,
    findRecordById
}