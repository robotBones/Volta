/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/garbage              ->  index
 * POST    /api/garbage              ->  create
 * GET     /api/garbage/:id          ->  show
 * PUT     /api/garbage/:id          ->  update
 * DELETE  /api/garbage/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Garbage = require('./garbage.model');
var Project = require('../project/project.model'),
	Chapter = require('../chapter/chapter.model');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function (err) {
		res.status(statusCode).send(err);
	};
}

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function (entity) {
		if (entity) {
			res.status(statusCode).json(entity);
		}
	};
}

function handleEntityNotFound(res) {
	return function (entity) {
		if (!entity) {
			res.status(404).end();
			return null;
		}
		return entity;
	};
}

function saveUpdates(updates) {
	return function (entity) {
		var updated = _.merge(entity, updates);
		return updated.saveAsync()
			.spread(function (updated) {
				return updated;
			});
	};
}

function removeEntity(res) {
	return function (entity) {
		if (entity) {
			return entity.removeAsync()
				.then(function () {
					res.status(204).end();
				});
		}
	};
}

// Gets a list of Garbages
exports.index = function (req, res) {
	if (!req.query.uid || req.query.uid === '') {
		Garbage.find({
				user: req.query.uid
			})
			.exec(function (err, items) {
				if (err) {
					res.status(401).json(err);
				} else {
					console.log(items);
					res.status(200).json(items);
				}
			});

	}
	/*else {
		console.log('we dont have the id');
		res.status(401).json([]);
	}*/
	/*Garbage.findAsync({
			user: req.query.uid
		})
		.then(responseWithResult(res))
		.catch(handleError(res));*/
};

// Gets a single Garbage from the DB
exports.show = function (req, res) {
	Garbage.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.catch(handleError(res));
};

// Creates a new Garbage in the DB
exports.create = function (req, res) {
	Garbage.createAsync(req.body)
		.then(responseWithResult(res, 201))
		.catch(handleError(res));
};

// Updates an existing Garbage in the DB
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Garbage.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.catch(handleError(res));
};

// Deletes a Garbage from the DB
exports.destroy = function (req, res) {
	Garbage.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
};
