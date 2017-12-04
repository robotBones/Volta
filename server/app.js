/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import config from './config/environment';
import http from 'http';
import raven from 'raven';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }



// global onError method
function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
}

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
    serveClient: config.env !== 'production',
    path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);

// routes defined here
require('./routes')(app);

// Raven Request handler config
app.use(raven.middleware.express.requestHandler('https://ac17cc21f0764aa7a719362b9cd470eb:44523a203b6a4b26b65e10acb0aaea2b@app.getsentry.com/71925'));


// Raven Error Handler
app.use(raven.middleware.express.errorHandler('https://ac17cc21f0764aa7a719362b9cd470eb:44523a203b6a4b26b65e10acb0aaea2b@app.getsentry.com/71925'));


// Optional fallthrough error handler
app.use(onError);









// Start server
function startServer() {
    server.listen(config.port, config.ip, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
