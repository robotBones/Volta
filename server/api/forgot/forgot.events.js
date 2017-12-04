/**
 * Forgot model events
 */

'use strict';

import {EventEmitter} from 'events';
var Forgot = require('./forgot.model');
var ForgotEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ForgotEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Forgot.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ForgotEvents.emit(event + ':' + doc._id, doc);
    ForgotEvents.emit(event, doc);
  }
}

export default ForgotEvents;
