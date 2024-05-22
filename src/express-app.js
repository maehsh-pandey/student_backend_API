const express = require('express');
const cors  = require('cors');
const session = require('express-session');
const { student,course } = require('./api');
const HandleErrors = require('./utils/error-handler');
const { SESSION_SECRET } = require('./config');


module.exports = async (app) => {

    app.use(express.json({ limit: '10mb'}));
    app.use(express.urlencoded({ extended: true, limit: '10mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    app.use(session({
        secret: SESSION_SECRET,
        // resave: false,
        // saveUninitialized: true,
        // cookie: { secure: true }
    }))

    //api
    student(app);
    course(app);
    // products(app);
    // shopping(app);

    // error handling
    app.use(HandleErrors);
    
}