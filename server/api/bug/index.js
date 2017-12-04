'use strict';

var express = require('express');
var controller = require('./bug.controller'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', multipartyMiddleware ,controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
