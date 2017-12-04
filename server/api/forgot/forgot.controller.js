/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/forgot              ->  index
 * POST    /api/forgot              ->  create
 * GET     /api/forgot/:id          ->  show
 * PUT     /api/forgot/:id          ->  update
 * DELETE  /api/forgot/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Forgot = require('./forgot.model');
var User = require('../user/user.model');
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill('Mq2U_aX9xL4bLAsZq2MKDQ');
var chance = require('chance').Chance();

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function (err) {
		res.status(statusCode).send(err);
	};
}

function validationError(res, statusCode) {
	statusCode = statusCode || 422;
	return function (err) {
		res.status(statusCode).json(err);
	}
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
			.spread(updated => {
				return updated;
			});
	};
}

function removeEntity(res) {
	return function (entity) {
		if (entity) {
			return entity.removeAsync()
				.then(() => {
					res.status(204).end();
				});
		}
	};
}

// Gets a list of Forgots
export function index(req, res) {
	Forgot.findAsync()
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Gets a single Forgot from the DB
export function show(req, res) {
	Forgot.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Creates a new Forgot in the DB
export function create(req, res) {
	var to = req.body.email;
	var message = {
		'text': 'Password reset request',
		'subject': 'Volta Password Reset',
		'from_email': 'tech@writerboy.com',
		'from_name': 'Volta Support',
		'headers': {
			'Reply-To': 'ahmadnauroz@gmail.com'
		}
	};
	User.findOne({
			'email': to
		})
		.then(function (user) {
			if (user) {
				console.log(user);
				var temp = chance.string({
					length: 8,
					pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
				});
				var expires = new Date();
				expires.setTime(expires.getTime() + (1 * 60 * 60 * 1000));
				console.log('Expiry: ' + expires);
				message.to = [{
					'email': to,
					'name': user.firstName + ' ' + user.lastName,
					'type': 'to'
				}];
				message.html = '<h3>Volta</h3><p> Forget your password? Eehh. Don\'t let it ruin your day. Sometimes things must be forgotten. Click the link below to create a new password. Then one day you can forget that one too! And you\'ll get to read another one of these stupid messages. HA!!</p>' +
					'<p><a href="http://app.voltawriter.com/reset-password/' + user._id + '">http://app.voltawriter.com/reset-password/' + user._id + '</a></p>' +
					'<p>Use ' + temp + ' as your temporary password</p>' +
					'<p>P.S. This message will self-destruct in 1 hour.</p>' +
					'<h4><a href="http://voltawriter.com/">Team Volta</a></h4>'
				client.messages.send({
					'message': message,
					'async': false,
					ip_pool: 'Main Pool'
				}, function (result) {
					console.log(result);
					user.tempPass = temp;
					user.tempPassExpires = expires;
					return user.saveAsync()
						.then(function () {
							res.status(200).send(result);
						});
				}, function (error) {
					console.log('Error: ' + error.name + ' - ' + error.message);
					res.status(304).send(error);
				});
			} else {
				res.status(203).send('Not found');
			}
		});
}

export function reset(req, res) {
	var data = req.body;
	console.log('temp password: ' + data.temp);
	User.findOne({
			_id: req.params.id,
			'tempPass': data.temp
		})
		.then(function (user) {
			console.log(user);
			if (!user) {
				res.status(203).send('Not found');
			} else {
				var now = new Date();
				console.log(user.tempPassExpires);
				console.log(now);
				if (user.tempPassExpires > now) {
					console.log('key is valid');
					user.password = data.newPass;
					user.saveAsync()
						.then(function () {
							res.status(200).end();
						})
						.catch(validationError(res));
				} else {
					console.log('key expired');
					res.status(204).send('key expired');
				}
			}
		});
}

// Updates an existing Forgot in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Forgot.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Deletes a Forgot from the DB
export function destroy(req, res) {
	Forgot.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}