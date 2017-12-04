/**
 * ShareDoc model events
 */

'use strict';

import {EventEmitter} from 'events';
var ShareDoc = require('./shareDoc.model');
var ShareDocEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ShareDocEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ShareDoc.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ShareDocEvents.emit(event + ':' + doc._id, doc);
    ShareDocEvents.emit(event, doc);
  }
}

export default ShareDocEvents;
