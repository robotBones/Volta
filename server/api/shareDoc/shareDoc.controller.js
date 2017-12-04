/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shareDoc              ->  index
 * POST    /api/shareDoc              ->  create
 * GET     /api/shareDoc/:id          ->  show
 * PUT     /api/shareDoc/:id          ->  update
 * DELETE  /api/shareDoc/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var ShareDoc = require('./shareDoc.model');
var Chapter = require('../chapter/chapter.model');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill('Mq2U_aX9xL4bLAsZq2MKDQ');

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

function responseWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function saveUpdates(updates) {
    return function(entity) {
        var updated = _.merge(entity, updates);
        return updated.saveAsync()
            .spread(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.removeAsync()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

export function index(req, res) {

}

// Gets a list of ShareDocs
export function sendLink(req, res) {
    var emails = req.body.emails.split(',');
    var name = req.body.name;
    var chapter = req.body.chapter;
    console.log(chapter);
    var message = {
        'text': 'Document shared.',
        'subject': 'Volta Document Share',
        'from_email': 'tech@writerboy.com',
        'from_name': 'Volta Support',
        'headers': {
            'Reply-To': 'ahmadnauroz@gmail.com'
        }
    };
    for (var i = 0; i < emails.length; i++) {
    	var to = emails[i];
    	console.log('sending share link to ', to);
	    message.to = [{
	        'email': to,
	        'type': 'to'
	    }];
	    message.html = '<h3>Volta</h3><p>Hi!</p><p>' + name + ' has shared a file with you. Go to the link below to view it.</p>' +
	        '<p><a href="http://writerboy-staging.herokuapp.com/share/' + to + '/' + chapter + '">http://writerboy-staging.herokuapp.com/share/' + to + '/' + chapter + '</a></p>' +
	        '<h4><a href="http://voltawriter.com/">Team Volta</a></h4>'
	    client.messages.send({
	        'message': message,
	        'async': false,
	        ip_pool: 'Main Pool'
	    }, function(result) {
	        console.log(result);
	        Chapter.findOneAsync({_id: chapter})
	        	.then(function (item) {
	        		item.sharedWith.push(to);
	        		console.log('ADDED SHARE EMAIL TO CHAPTER: ', item.sharedWith);
	        		item.saveAsync();
	        	})
	        res.status(201).send('Sent');
	    }, function(error) {
	        console.log('Error: ' + error.name + ' - ' + error.message);
	        res.status(304).send(error);
	    });
    }
    // ShareDoc.findAsync()
    //     .then(responseWithResult(res))
    //     .catch(handleError(res));
}

// Gets a single ShareDoc from the DB
export function show(req, res) {
    ShareDoc.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(responseWithResult(res))
        .catch(handleError(res));
}

// Creates a new ShareDoc in the DB
export function create(req, res) {
    ShareDoc.createAsync(req.body)
        .then(responseWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing ShareDoc in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    ShareDoc.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(responseWithResult(res))
        .catch(handleError(res));
}

// Deletes a ShareDoc from the DB
export function destroy(req, res) {
    ShareDoc.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
