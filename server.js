const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/authRoutes');
const { db_connect } = require('./db_config');
require('dotenv').config();

const app = express()
const version ='v1';

(() => {
    configur_db();
    configur_cors();
    configur_parser();
    configur_routes();
    // Error Handeling
    error404();
    globalErrorHandler();
})()


function configur_cors() {
    app.use(cors())
}


function configur_db(){
    db_connect();
}

function configur_parser() {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
}



function configur_routes() {
    app.use(`/api/marketplace/${version}`, routes)
}





function error404() {
    app.use((req, res) => {
        res.status(404).send({
            status: 404,
            msg: 'NOT FOUND'
        })
    })
}

function globalErrorHandler() {

    app.use((err, req, res, next) => {
        res.status(500).send({
            msg: err.message || 'Somthing went wrong. Please try again later',
            status: 500
        })
    })

}


module.exports = app