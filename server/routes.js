/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

module.exports = function (app) {

  // Insert routes below
  app.use('/api/shareDoc', require('./api/shareDoc'));
  app.use('/api/forgot', require('./api/forgot'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/bugs', require('./api/bug'));
  app.use('/api/garbage', require('./api/garbage'));
  app.use('/api/chapters', require('./api/chapter'));
  app.use('/api/projects', require('./api/project'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
