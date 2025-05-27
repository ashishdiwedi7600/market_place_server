const User = require("../models/User");

exports.insertRecord = async (records) => {
    const { name,phone, email, password,accountStatus,role } = records

    return new Promise(async(resolve, reject) => {
        const newuser = User({ name,phone, email, password,accountStatus,role });
         await User.insertMany([newuser])
            .then(r => {
                
                resolve({ status: 200, msg: 'added successfully' })
                
            })
            .catch(e => { reject(e)})
    })
}
exports.findRecordById = async (id) => {

    return new Promise(async(resolve, reject) => {
        await User.findById(id)
            .then(r => {
                resolve(r)                
            })
            .catch(e => { reject(e)})
    })
}
