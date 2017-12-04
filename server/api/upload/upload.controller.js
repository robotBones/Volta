/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/uploads              ->  index
 * POST    /api/uploads              ->  create
 * GET     /api/uploads/:id          ->  show
 * PUT     /api/uploads/:id          ->  update
 * DELETE  /api/uploads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Upload = require('./upload.model');
var mammoth = require("mammoth");
var stringify = require('stringify');
var Chapter = require('../chapter/chapter.model');
var Project = require('../project/project.model');

stringify.registerWithRequire({
	extensions: ['.txt', '.html'],
	minify: false,
	minifier: {
		extensions: ['.html'],
		options: {
			// html-minifier options 
		}
	}
});

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

// Gets a list of Uploads
export function index(req, res) {
	Upload.findAsync()
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Gets a single Upload from the DB
export function show(req, res) {
	Upload.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Creates a new Upload in the DB
export function create(req, res) {
	var file = req.files.file;

	if (file.type === 'text/plain') {
		var text = require(file.path);
		var paragraphs = text.split(/\n+/g);
		var rendered = '';
		for (var i = 0; i < paragraphs.length; i++) {
			rendered = rendered + paragraphs[i] + '<br/><br/>';
			if (i === paragraphs.length - 1) {
				req.body.body = rendered;
				req.body.words = rendered.split(/\s+/).length - 1;
				Chapter.createAsync(req.body)
					.then(function (item) {
						res.status(200).send(item);
					})
					.catch(handleError(res));
			}
		}

	} else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
		mammoth.convertToHtml({
				path: file.path
			}, { ignoreEmptyParagraphs: false })
			.then(function (result) {
				var text = result.value; // The raw text
				var paragraphs = text.split(/<\/p><p>+/g);
				var rendered = text;
				console.log(text);
				/*for (var i = 0; i < paragraphs.length; i++) {
					paragraphs[i].replace('</p>', '');
					rendered = rendered + paragraphs[i] + '<br/><br/>';
					if (i === paragraphs.length - 1) {
						console.log(rendered);
					}
				}*/
				req.body.body = rendered;
				req.body.words = rendered.split(/\s+/).length - 1;
				Chapter.createAsync(req.body)
					.then(function (item) {
						res.status(200).send(item);
					})
					.catch(handleError(res));
			})
			.done();

	}


	/*Upload.createAsync(file)
	    .then(responseWithResult(res, 201))
	    .catch(handleError(res));*/

	/*var client = s3.createClient({
	    maxAsyncS3: 20, // this is the default
	    s3RetryCount: 3, // this is the default
	    s3RetryDelay: 1000, // this is the default
	    multipartUploadThreshold: 20971520, // this is the default (20 MB)
	    multipartUploadSize: 15728640, // this is the default (15 MB)
	    s3Options: {
	        accessKeyId: "AKIAIIL4E2QKXYTQDYKQ",
	        secretAccessKey: "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",
	        region: "eu-west-1"
	    }
	});

	// console.log(client);

	var params = {
	    localFile: file.path,
	    s3Params: {
	        Bucket: "Volta",
	        Key: file.name,
	    },
	};

	console.log('we gonna upload: ' + file.name);
	var uploader = client.uploadFile(params);
	uploader.on('error', function (err) {
	    console.error("unable to upload:", err.stack);
	});
	uploader.on('progress', function () {
	    console.log("progress", uploader.progressMd5Amount,
	        uploader.progressAmount, uploader.progressTotal);
	});
	uploader.on('end', function (resp) {
	    console.log("done uploading");
	    console.log(resp);
	    var video = req.body;
	    video.filePath = file.name;
	    Video.createAsync(video)
	        .then(responseWithResult(res, 201))
	        .catch(handleError(res));
	});*/
}

// Updates an existing Upload in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Upload.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.catch(handleError(res));
}

// Deletes a Upload from the DB
export function destroy(req, res) {
	Upload.findByIdAsync(req.params.id)
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}
