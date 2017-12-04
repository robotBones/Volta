'use strict';

import User from './user.model';
import passport from 'passport';
import _ from 'lodash';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var mandrill = require('mandrill-api/mandrill');
var client = new mandrill.Mandrill('Mq2U_aX9xL4bLAsZq2MKDQ');
var chance = require('chance').Chance();

function validationError(res, statusCode) {
	statusCode = statusCode || 422;
	return function (err) {
		res.status(statusCode).json(err);
	}
}

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function (err) {
		res.status(statusCode).send(err);
	};
}

function respondWith(res, statusCode) {
	statusCode = statusCode || 200;
	return function () {
		res.status(statusCode).end();
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

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function (entity) {
		if (entity) {
			res.status(statusCode).json(entity);
		}
	};
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
	User.findAsync({}, '-salt -hashedPassword')
		.then(function (users) {
			res.status(200).json(users);
		})
		.catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
	var newUser = new User(req.body);
	newUser.provider = 'local';
	newUser.role = 'user';
	var token = chance.string({
		length: 8,
		pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	});
	console.log('TOKEN', token);
	newUser.verifyToken = token;
	newUser.saveAsync()
		.spread(function (user) {
			var to = user.email;
			var message = {
				'text': 'Welcome to Volta',
				'subject': 'Welcome to Volta',
				'from_email': 'tech@writerboy.com',
				'from_name': 'Volta Support',
				'headers': {
					'Reply-To': 'ahmadnauroz@gmail.com'
				}
			};
			message.to = [{
				'email': to,
				'name': user.firstName + ' ' + user.lastName,
				'type': 'to'
			}];
			message.html = '<h3>Volta</h3><p>Hello ' + user.firstName + ',</p>' +
				'<p>Thank you for signing up for Volta! Please click the link below to complete your activation.</p>' +
				'<p><a href="http://app.voltawriter.com/dashboard/verify/' + user.email + '/' + user.verifyToken +
				'">http://app.voltawriter.com/dashboard/verify/' + user.email + '/' + user.verifyToken + '</a></p>' +
				'<p>If you have any questions or feedback, please drop us a line: support@voltawriter.com</p>' +
				'<h4><a href="http://voltawriter.com/">Team Volta</a></h4>'
			client.messages.send({
				'message': message,
				'async': false,
				ip_pool: 'Main Pool'
			}, function (result) {
				console.log('MANDRILL: ', result);
			}, function (error) {
				console.log('MANDRILL: ', 'Error: ' + error.name + ' - ' + error.message);
			});
			var token = jwt.sign({
				_id: user._id
			}, config.secrets.session, {
				expiresInMinutes: 60 * 5
			});

			res.json({
				token: token
			});
		})
		.catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
	var userId = req.params.id;

	User.findByIdAsync(userId)
		.then(function (user) {
			if (!user) {
				return res.status(404).end();
			}
			res.json(user.profile);
		})
		.catch(function (err) {
			return next(err);
		});
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
	User.findByIdAndRemoveAsync(req.params.id)
		.then(function () {
			res.status(204).end();
		})
		.catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	User.findByIdAsync(userId)
		.then(function (user) {
			if (user.authenticate(oldPass)) {
				user.password = newPass;
				return user.saveAsync()
					.then(function () {
						res.status(204).end();
					})
					.catch(validationError(res));
			} else {
				return res.status(403).end();
			}
		});
};

/**
 * Update User profile
 */
exports.changeProfile = function (req, res, next) {
	var userId = req.body._id
		//  if (req.body._id) {
		//    delete req.body._id;
		//  }
	User.findByIdAsync(userId)
		.then(saveUpdates(req.body))
		.then(responseWithResult(res));

};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
	var userId = req.user._id;

	User.findOneAsync({
			_id: userId
		}, '-salt -hashedPassword')
		.then(function (user) { // don't ever give out the password or salt
			if (!user) {
				return res.status(401).end();
			}
			console.log(user);
			res.json(user);
		})
		.catch(function (err) {
			return next(err);
		});
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
	res.redirect('/');
};

exports.verify = function (req, res) {
	var email = req.body.email;
	var token = req.body.token;
	User.findOne({
			email: email,
			verifyToken: token
		})
		.then(function (user) {
			if (user) {
				user.verified = true;
				user.saveAsync().then(function () {
					res.status(203).send('Verified');
				});
			} else {
				console.log('Failed verfiication');
				res.status(204).send('Not verified');
			}
		});
};

exports.resendToken = function (req, res) {
	var email = req.params.email;
	var token = chance.string({
		length: 8,
		pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	});
	console.log('TOKEN', token);

	User.findOne({
			email: email
		})
		.then(function (user) {
			if (user) {
				user.verifyToken = token;
				var to = user.email;
				var message = {
					'text': 'Volta Account Verification',
					'subject': 'Volta Account Verification',
					'from_email': 'tech@writerboy.com',
					'from_name': 'Volta Support',
					'headers': {
						'Reply-To': 'ahmadnauroz@gmail.com'
					}
				};
				message.to = [{
					'email': to,
					'name': user.firstName + ' ' + user.lastName,
					'type': 'to'
				}];
				message.html = '<h3>Volta</h3><p>Hello ' + user.firstName + ',</p>' +
					'<p>Thank you for signing up for Volta! Please click the link below to complete your activation.</p>' +
					'<p><a href="http://app.voltawriter.com/dashboard/verify/' + user.email + '/' + user.verifyToken +
					'">http://app.voltawriter.com/dashboard/verify/' + user.email + '/' + user.verifyToken + '</a></p>' +
					'<p>If you have any questions or feedback, please drop us a line: support@voltawriter.com</p>' +
					'<h4><a href="http://voltawriter.com/">Team Volta</a></h4>'
				client.messages.send({
					'message': message,
					'async': false,
					ip_pool: 'Main Pool'
				}, function (result) {
					console.log('MANDRILL: ', result);

					user.saveAsync().then(function () {
						res.status(203).send('Sent verification link');
					})
				}, function (error) {
					res.status(204).send(error);
					console.log('MANDRILL: ', 'Error: ' + error.name + ' - ' + error.message);
				});
			} else {
				res.status(204).send('NOT_FOUND');
			}
		});
};

exports.getByEmail = function (req, res) {
	User.findOneAsync({
		email: req.params.email
	})
	.then(function (user) {
		if (user && user !== null) {
			console.log('found');
			res.status(201).send('FOUND');
		} else {
			console.log('not found');
			res.status(201).send('NOT_FOUND');
		}
	});
};