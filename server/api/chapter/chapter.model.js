'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema,
	relationship = require("mongoose-relationship");

// import Project from '../project/project.model';

var ChapterSchema = new Schema({
	title: String,
	body: String,
	words: Number,
	userID: String,
	project: {
		type: Schema.ObjectId,
		ref: 'Project',
		childPath: 'chapters'
	},
	inGarbage: {
		type: Boolean,
		default: false
	},
	sharedWith: [{
		type: String
	}]
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	},
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

ChapterSchema.plugin(relationship, { relationshipPathName: 'project' });
module.exports = mongoose.model('Chapter', ChapterSchema);
