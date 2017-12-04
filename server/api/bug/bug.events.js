/**
 * Bug model events
 */

'use strict';

import {EventEmitter} from 'events';
var Bug = require('./bug.model');
var BugEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BugEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Bug.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BugEvents.emit(event + ':' + doc._id, doc);
    BugEvents.emit(event, doc);
  }
}

export default BugEvents;
