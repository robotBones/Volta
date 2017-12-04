/**
 * Project model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Project = require('./project.model');
var ProjectEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProjectEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Project.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProjectEvents.emit(event + ':' + doc._id, doc);
    ProjectEvents.emit(event, doc);
  }
}

module.exports = ProjectEvents;
