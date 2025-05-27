const mongoose = require('mongoose');

module.exports = {
    db_connect:(function () {
        mongoose.connect(process.env.MONGODBURI)
            .then(() => console.log("database connected successfully"))
            .catch((e) => console.log(e))
    })
}