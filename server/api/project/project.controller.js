/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  update
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var Garbage = require('../garbage/garbage.model'),
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
		if (!_.isArray(entity)) {
			entity.populate('chapters', function (err, project) {
				res.status(statusCode).json(project);
			});
		} else {
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

// Gets a list of Projects
exports.index = function (req, res) {
	if (req.query.uid !== 'undefined') {
		var trash = req.param('trash');
		console.log(trash);
		Project.findAsync({
				userID: req.query.uid,
				inGarbage: trash
			})
			.then(responseWithResult(res))
			.catch(handleError(res));

	} else {
		res.status(401).json([]);
	}
};

// Gets a single Project from the DB
exports.show = function (req, res) {
	Project.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.catch(handleError(res));
};

// Creates a new Project in the DB
exports.create = function (req, res) {
	Project.createAsync(req.body)
		.then(responseWithResult(res, 201))
		.catch(handleError(res));
};

// Updates an existing Project in the DB
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Project.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.catch(handleError(res));
};

// Deletes a Project from the DB
exports.destroy = function (req, res) {

	Project.findById(req.params.id)
		.exec(function (err, project) {
			_.forEach(project.chapters, function (c) {

				Chapter.findById(c)
					.exec(function (err, chapter) {
						console.log('chapter: ' + chapter)
						var chapterGarbage = new Garbage({
							title: chapter.title,
							isProject: false,
							user: chapter.userID,
							words: chapter.words,
							body: chapter.body
						});
						//lets not put any load on this
						chapter.removeAsync();

						chapterGarbage.saveAsync();
					});
			});

			// Before deleting lets put this in garbage
			var garbage = new Garbage({
				title: project.title,
				isProject: true,
				user: project.userID,
			});

			garbage.saveAsync();
			project.removeAsync()
				.then(function () {
					res.status(204).end();
				});
		});




	// Project.findByIdAsync(req.params.id)
	//   .then(handleEntityNotFound(res))
	//   .then(removeEntity(res))
	//   .catch(handleError(res));
};


exports.addchapter = function (req, res) {
	Project.findById(req.params.id)
		.exec(function (err, project) {
			project.chapters.push(req.body._id);
			project.save(function (err, p) {
				res.status(201).json(p);
			});
		});
};
