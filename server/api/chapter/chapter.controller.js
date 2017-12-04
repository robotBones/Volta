/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/chapters              ->  index
 * POST    /api/chapters              ->  create
 * GET     /api/chapters/:id          ->  show
 * PUT     /api/chapters/:id          ->  update
 * DELETE  /api/chapters/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Chapter = require('./chapter.model');
var User = require('../user/user.model');

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        console.log(err);
        res.status(statusCode).send(err);
    };
}

function responseWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (_.isArray(entity)) {
            // console.log(entity);
            var index = 0;
            if (index !== entity.length) {
                // console.log('here line 30');
                _.forEach(entity, function(n) {
                    // console.log('line 32');
                    n.populate('project', function(err, e) {
                        console.log('34: ' + e);
                        entity[index] = e;
                    });
                    // console.log('incrementing');
                    index = index + 1;
                });
                res.status(statusCode).json(entity);
            }
        } else {
            // console.log('not here');
            entity.populate('project', function(err, e) {
                entity = e;
            });
            res.status(statusCode).json(entity);
        }
        // console.log('returning');

    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function saveUpdates(updates) {
    return function(entity) {
        var updated = _.merge(entity, updates);
        return updated.saveAsync()
            .spread(function(updated) {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.removeAsync()
                .then(function() {
                    res.status(204).end();
                });
        }
    };
}

// Gets a list of Chapters
exports.index = function(req, res) {

    // console.log(req.param('trash'));
    if (req.query.uid !== 'undefined') {
        console.log('we have the id');
        // Chapter.findAsync({userID : req.query.uid, inGarbage: !_.isUndefined(req.param('trash'))})
        //   .then(responseWithResult(res))
        //   .catch(handleError(res));
        Chapter.find({
                userID: req.query.uid,
                inGarbage: !_.isUndefined(req.param('trash'))
            })
            .populate('project')
            .exec(function(err, chapters) {
                if (err) {
                    res.status(401).json(err);
                } else {
                    console.log(chapters);

                    res.status(200).json(chapters);
                }
            });

    } else {
        console.log('we dont have the id');
        res.status(401).json([]);
    }
};

// Gets a single Chapter from the DB
exports.show = function(req, res) {
    console.log('called single chapter');
    if (!req.user) {
        res.status(403).send('Forbidden');
    } else {
        var userId = req.user._id;
        Chapter.findById(req.params.id)
            .populate('project')
            .exec(function(err, chapter) {
                if (err) {
                    res.status(401).json(err);
                } else {
                    console.log('User Id: ', userId);
                    console.log('Chapter: ', chapter);
                    if (chapter.userID == userId) {
                        res.status(200).json(chapter);
                    } else {
                        res.status(403).send('Forbidden');
                    }
                }
            });
    }
};




// Creates a new Chapter in the DB
exports.create = function(req, res) {
    Chapter.createAsync(req.body)
        .then(responseWithResult(res, 201))
        .catch(handleError(res));
};

// Updates an existing Chapter in the DB
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Chapter.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(responseWithResult(res))
        .catch(handleError(res));
};

// Deletes a Chapter from the DB
exports.destroy = function(req, res) {
    Chapter.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
};

exports.empty = function(req, res) {
    var ids = req.body;
    console.log(ids);
    for (var i = 0; i < ids.length; i++) {
        Chapter.find({
            _id: ids[i]
        }).remove(function(err, chapter) {
            console.log('removed');
        });
        if (i === ids.length - 1) {
            console.log('bye');
            res.status(204).send('Done');
        }
    }
}

exports.getShared = function(req, res) {
    var chapter = req.body.chapter;
    console.log('CHAPTER', chapter);
    var email = req.body.email;
    console.log('EMAIL', email);
    Chapter.findOneAsync({
            _id: chapter,
            sharedWith: email
        })
        .then(function (item) {
        	console.log(item);
        	if (item) {
        		User.findOneAsync({
        			_id: item.userID
        		})
        		.then(function (user) {
        			var writer = user.firstName + ' ' + user.lastName;
        			console.log(item);
        			res.status(201).send({chapter: item, writer: writer});
        		})
        	} else {
        		res.status(204).send('NOT_FOUND');
        	}
        })
}

exports.getCount = function(req, res) {
    var counts = [];
    if (req.body.username === 'admin' && req.body.password === 'creepypasta') {
        User.find()
            .then(function(users) {
                var loop = 0;
                users.forEach(function(e, i, a) {
                    console.log('GETTING CHAPTERS FOR: ', e._id);
                    Chapter.find({ userID: e._id })
                        .then(function(chapters) {
                            loop++;
                            var chapLoop = 0;
                            var wordCount = 0;
                            var data = {
                                id: e._id,
                                name: e.firstName + ' ' + e.lastName,
                                email: e.email,
                                chapterCount: chapters.length,
                                wordCount: ''
                            };
                            if (chapters.length > 0) {
                                chapters.forEach(function(cE, cI, cA) {
                                    console.log('GETTING WORD COUNT FOR CHAPTER', cE);
                                    wordCount = wordCount + cE.words;
                                    chapLoop++;
                                    if (chapLoop === cA.length) {
                                        data.wordCount = wordCount;
                                        counts.push(data);
                                        if (loop === a.length) {
                                            res.status(200).json(counts);
                                        }
                                    }
                                })
                            } else {
                                data.wordCount = 0;
                                counts.push(data);
                                if (loop === a.length) {
                                    res.status(200).json(counts);
                                }
                            }
                        });
                });
            });
    } else {
        res.status(403).send('UNAUTHORIZED');
    }
}
