'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema,
	relationship = require("mongoose-relationship");

var ProjectSchema = new Schema({
	title: String,
	subheading: String,
	author: String,
	userID: String,
	chapters: [{
		type: Schema.ObjectId,
		ref: 'Chapter'
	}],
	inGarbage: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Project', ProjectSchema);
