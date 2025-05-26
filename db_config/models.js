const User = require("../models/User");
const database = require("../models/User")                                

exports.insertRecord = async (records) => {
    console.log("hhhhhhh",records);
    const { name,phone, email, password,accountStatus } = records

    return new Promise(async(resolve, reject) => {
        const newuser = User({ name,phone, email, password,accountStatus });
         await User.insertMany([newuser])
            .then(r => {
                
                resolve({ status: 200, msg: 'added successfully' })
                
            })
            .catch(e => { reject(e)})
    })
}
