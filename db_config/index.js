const mongoose = require('mongoose');
const dbName='market_place'

module.exports = {
    db_connect:(function () {
        // mongoose.connect("mongodb+srv://adiwedi1:Ie8zL11LVb7KqnN3@marketplace.6xgbdy3.mongodb.net/")
        mongoose.connect("mongodb+srv://adiwedi1:Ie8zL11LVb7KqnN3@marketplace.6xgbdy3.mongodb.net/market_place?retryWrites=true&w=majority&appName=marketplace")
        // mongoose.connect("mongodb+srv://diwediashish:1234@cluster0.rmrzj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            .then(() => console.log("database connected successfully"))
            .catch((e) => console.log(e))
    })
}