'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema,
	relationship = require("mongoose-relationship");

var GarbageSchema = new Schema({
	title: String,
	isProject: Boolean,
	body: String,
	words: Number,
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		childPath: 'trash'
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

GarbageSchema.plugin(relationship, {
	relationshipPathName: 'user'
});
module.exports = mongoose.model('Garbage', GarbageSchema);
