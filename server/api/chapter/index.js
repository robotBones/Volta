'use strict';

var express = require('express');
var controller = require('./chapter.controller');
import auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.post('/count', controller.getCount);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/getShared', controller.getShared);
router.post('/empty/', controller.empty);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
