/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bugs              ->  index
 * POST    /api/bugs              ->  create
 * GET     /api/bugs/:id          ->  show
 * PUT     /api/bugs/:id          ->  update
 * DELETE  /api/bugs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Bug = require('./bug.model');


var needle = require('needle');

var API_KEY = "A75RLn4LA6adQhHYLLUd";
var FD_ENDPOINT = "writerboy.freshdesk.com";

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

// Gets a list of Bugs
export function index(req, res) {
  Bug.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Bug from the DB
export function show(req, res) {
  Bug.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bug in the DB
export function create(req, res) {


  // console.log(req.files.file);

  var fdUrl = "https://" + API_KEY + ":X@" + FD_ENDPOINT + "/helpdesk/tickets.json";

  var data = {
    'helpdesk_ticket[email]': req.body.email,
    'helpdesk_ticket[subject]': req.body.summary,
    'helpdesk_ticket[description]': req.body.description,
    'helpdesk_ticket[attachments][][resource]': req.files.file
  };

  console.log("sending this to freshdesk: " + data)

  needle.post(fdUrl, data, {multipart: true}, function(err, resp, body){
    if (err) {
      res.status(400).json(err);
    }
    else {
      res.status(201).json(body);
    }
  });
}

// Updates an existing Bug in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Bug.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bug from the DB
export function destroy(req, res) {
  Bug.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
