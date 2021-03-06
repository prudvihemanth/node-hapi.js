
/*---------------------------------------------------------------------------------
   * @ file        : server.js
   * @ description : This is the main startup server file to init the application.
   * @ author      : Duddukuri Mahesh
   * @ date        : 
----------------------------------------------------------------------------------*/

// include external modules
const Hapi     = require('hapi');
const plugIns  = require('./plugIns');
const mongoose = require('mongoose');

// include internal modules
const configs = require('./Configs');
const env     = require('./env');
const app     = (env == "dev") ? configs.app.test   :  configs.app.dev;
const db      = (env == "dev") ? configs.app.test   :  configs.app.dev;
const server  = new Hapi.Server();
const routes  = require('./Routes');



// setting server configuration
server.connection({
    host: app.host,
    port: app.port
});

console.log("++++++++++++++++++++++ SERVER SETTINGS LOADED  ++++++++++++++++++++++\r\n" +JSON.stringify(app)  + "\n");


server.route(routes);

// init the index route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        return reply({
            name: app.name,
            endpoint: app.host,
            port: app.port

        }).code(201);
    }
});



// Start the server
server.register(plugIns,function (err)  {

    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start( function(err)  {
        if (err) {
            console.log("+++++++++++++++++++++++ Error starting server +++++++++++++++++++++");
            throw err;
        } else {
            console.log('+++++++++++++++++++++++ SERVER STARTED +++++++++++++++++++++++++++ \r\nServer running at:' + server.info.uri);
        }
    });
});


//Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/myApp', function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected', 'mongodb://127.0.0.1/myApp');
    }
});