/**
 * Chapter model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Chapter = require('./chapter.model');
var ChapterEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ChapterEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Chapter.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ChapterEvents.emit(event + ':' + doc._id, doc);
    ChapterEvents.emit(event, doc);
  }
}

module.exports = ChapterEvents;
