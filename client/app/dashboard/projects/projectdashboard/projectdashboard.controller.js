'use strict';

angular.module('writerboyApp')
    .controller('ProjectdashboardCtrl', function($scope, NgTableParams, $routeParams, $http, $location, $uibModal, $mdDialog, Auth, Upload, $timeout, lodash) {
        $scope.edit = false;
        $scope.matchedChapters = 'result';
        $scope.opened = false;
        $scope.gotMatch = true;
        $scope.edittingTitle = false;
        $scope.toggleSearch = function() {
            $scope.opened = !$scope.opened;
            if (!$scope.opened) {
                $scope.gotMatch = true;
                $scope.searching = false;
                $scope.query = '';
            }
        };
        $scope.editTitle = function() {
            $('.dropdown').removeClass('open');
            $('.dropdown-toggle').attr('aria-expanded', 'false');
            $scope.edittingTitle = true;
            $timeout(function() {
                $('#inlineProjectTitleEdit').focus();
                $('#inlineProjectTitleEdit').select();
            }, 200);
        };
        $scope.updateTitle = function() {
            $scope.edittingTitle = false;
            $http.put('/api/projects/' + $scope.project._id, {
                title: $scope.project.title
            }).then(function(response) {
                console.log(response);
            })
        };
        $scope.edittingChapterTitle = false;
        $scope.editChapter = {
            title: ''
        };
        $scope.updateChapterTitle = function(chapter) {
            if (chapter.title !== $scope.editChapter.title) {
                chapter.title = $scope.editChapter.title;
                $http.put('/api/chapters/' + chapter._id, {
                    title: chapter.title
                }).then(function(response) {
                    $scope.editChapter = false;
                    console.log(response);
                });
            }
            $scope.editChapter.title = '';
            $scope.edittingChapterTitle = false;
        };
        $scope.editChapterTitle = function(chapter) {
            $scope.edittingChapterTitle = chapter._id;
            $scope.editChapter.title = chapter.title;
        };
        $scope.goToChapter = function(id) {
            console.log('go to chapter?');
            $location.path('/dashboard/edit/' + id);
        };
        $scope.open = function(index, chapterid, title) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dashboard/modals/moveChapterModal.html',
                controller: 'MoveChapterModalCtrl',
                size: 'sm',
                resolve: {
                    chapter: function() {
                        var chapterTObj = {
                            idx: index,
                            id: chapterid,
                            title: title
                        };
                        return chapterTObj;
                    }
                }
            });

            modalInstance.result.then(function(actionwithIndex) {
                if (actionwithIndex.action === 'del') {
                    $scope.chapters.splice(actionwithIndex.index, 1);
                    $scope.tableParams.reload();
                } else if (actionwithIndex.action === 'mv') {
                    $http.get('/api/chapters/' + actionwithIndex.id).then(function(response) {
                        console.log('will update: ' + response.data.project.title);
                        if (response.data.project._id !== $routeParams.id) {
                            $scope.chapters.splice(actionwithIndex.index, 1);
                            console.log($scope.chapters);
                            $scope.tableParams.reload();
                        } else {
                            $scope.chapters[actionwithIndex.index] = response.data;
                            $scope.tableParams.reload();
                        }
                    });
                }
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.$watch('query', function(changed) {
            if (changed) {
                if (changed.length > 0 && changed !== 'div') {
                    $scope.searching = true;
                } else {
                    $scope.searching = false;
                }
                var matchedChapters = [];
                for (var i = 0; i < $scope.chapters.length; i++) {
                    var text = $scope.chapters[i].body.toLowerCase();
                    var title = $scope.chapters[i].title.toLowerCase();
                    var token = changed.toLowerCase();
                    text = $(text).text();
                    if (text.indexOf(token) > -1 || title.indexOf(token) > -1) {
                        $scope.gotMatch = true;
                        var at = text.indexOf(token);
                        var replaced = text.replace(token, '<b>' + token + '</b>');
                        $scope.chapters[i].result = replaced.substring(at - 50, at + 50);
                        matchedChapters.push($scope.chapters[i]);
                    }
                    if (i === $scope.chapters.length - 1) {
                        console.log(matchedChapters);
                        if (matchedChapters.length > 0) {
                            $scope.searchTableParams = new NgTableParams({
                                count: 1000
                            }, {
                                data: matchedChapters,
                                counts: []
                            });
                        } else {
                            $scope.gotMatch = false;
                        }
                    }
                }
            }
        });
        $http.get('/api/projects/' + $routeParams.id)
            .then(function(response) {
                $scope.project = response.data;
                $scope.chapters = [];
                console.log($scope.project.chapters);
                if ($scope.project.chapters.length > 0) {
                    $scope.noChapters = false;
                    for (var i = 0; i < $scope.project.chapters.length; i++) {
                        var chapter = $scope.project.chapters[i];
                        if (!chapter.inGarbage) {
                            console.log('got a good one');
                            $scope.chapters.push(chapter);
                        }
                        if ($scope.project.chapters.length === i + 1) {
                            if ($scope.chapters.length === 0) {
                                $scope.noChapters = true;
                            } else {
                                $scope.noChapters = false;
                            }
                            $scope.chapters = lodash.orderBy($scope.chapters, ['updated_at'], ['desc']);
                            $scope.tableParams = new NgTableParams({
                                count: 100
                            }, {
                                data: $scope.chapters,
                                counts: []
                            });
                            setTimeout(function() {
                                $('tbody td').attr('title', '');
                            }, 200);
                        }
                    }
                } else {
                    $scope.noChapters = true;
                }
                $scope.newChapter = function() {
                    console.log($scope.project);
                    $http.post('/api/chapters', {
                            title: 'Untitled Document',
                            body: '',
                            words: 0,
                            userID: Auth.getCurrentUser()._id,
                            project: $scope.project._id
                        })
                        .then(function successCallback(response) {
                            console.log(response);
                            $location.path('/dashboard/edit/' + response.data._id);
                        });
                };
                $scope.uploadFile = function(file, errFile) {
                    console.log('logging doc');
                    var doc = {
                        title: (file.name).replace('.docx', '').replace('.txt', ''),
                        body: '',
                        words: 0,
                        userID: Auth.getCurrentUser()._id,
                        file: file,
                        project: $scope.project._id
                    }
                    console.log(doc);
                    if (file !== null) {
                        Upload.upload({
                            url: '/api/uploads',
                            data: doc
                        }).then(function(response) {
                            // sweetAlert('Done!', 'Video Uploaded.', 'success');
                            console.log(response.data);
                            $location.path('/dashboard/edit/' + response.data._id);
                            //$rootScope.docData = resp.data;
                            //$uibModalInstance.dismiss();
                            console.log('Uploaded');
                        }, function(resp) {
                            console.log('Error status: ' + resp.status);
                        }, function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });
                    }
                };
            });

        $scope.editChapter = function(chapterId) {
            $location.path('/dashboard/edit/' + chapterId);
        };

        $scope.editName = function(chapterId) {
            console.log('Edit name');
        };

        // dropdown options
        $http.get('/api/projects?uid=' + Auth.getCurrentUser()._id + '&trash=false')
            .success(function(projects) {
                console.log(projects);
                $scope.projects = projects;
            });
        $scope.chapterNewProject = function(chapterId) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dashboard/modals/newProject/newProjectModal.html',
                controller: 'NewProjectModalInstanceCtrl',
                size: 'md',
                resolve: {
                    chapterId: function() {
                        return chapterId;
                    },
                    redirect: false
                }
            });
            modalInstance.result.then(function(resp) {
                if (resp === chapterId) {
                    $http.get('/api/chapters/' + chapterId).then(function(response) {
                        console.log('will update: ' + response.data.project.title);
                        $http.get('/api/projects?uid=' + Auth.getCurrentUser()._id + '&trash=false')
                            .success(function(projects) {
                                console.log(projects);
                                $scope.projects = projects;
                            });
                        for (var i = 0; i < $scope.chapters.length; i++) {
                            if ($scope.chapters[i]._id === chapterId) {
                                console.log('found');
                                if ($scope.chapters.length === 1) {
                                    $scope.chapters = [];
                                    $scope.tableParams.reload();
                                    $scope.noChapters = true;
                                } else {
                                    $scope.chapters.splice(i, 1);
                                    $scope.tableParams.reload();
                                    $scope.noChapters = false;
                                }
                                break;
                            }
                        }
                    });
                }
            }, function() {

                console.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.addToProject = function(chapterId, projectid, index) {
            // add project to existing chapter
            console.log(projectid);
            $http.put('/api/chapters/' + chapterId, {
                project: projectid
            }).then(function(response) {
                console.log(response);
                if (projectid !== $scope.project._id) {
                    $http.get('/api/chapters/' + chapterId).then(function(response) {
                        console.log('will update: ' + response.data.project.title);
                        for (var i = 0; i < $scope.chapters.length; i++) {
                            if ($scope.chapters[i]._id === chapterId) {
                                console.log('found');
                                if ($scope.chapters.length === 1) {
                                    $scope.chapters = [];
                                    $scope.tableParams.reload();
                                    $scope.noChapters = true;
                                } else {
                                    $scope.chapters.splice(i, 1);
                                    $scope.tableParams.reload();
                                    $scope.noChapters = false;
                                }
                                break;
                            }
                        }
                    });

                }
            });
        };
        $scope.deleteChapter = function(chapterId) {
            $http.put('/api/chapters/' + chapterId, {
                inGarbage: true
            });
            for (var i = 0; i < $scope.chapters.length; i++) {
                if ($scope.chapters[i]._id === chapterId) {
                    console.log('found');
                    if ($scope.chapters.length === 1) {
                        $scope.chapters = [];
                        $scope.tableParams.reload();
                        $scope.noChapters = true;
                    } else {
                        $scope.chapters.splice(i, 1);
                        $scope.tableParams.reload();
                    }
                    console.log($scope.chapters.length);
                    break;
                }
            }
        };

        $scope.deleteProject = function() {
            $http.put('/api/projects/' + $scope.project._id, {
                inGarbage: true
            }).then(function(response) {
                console.log(response);
                $location.path('/dashboard/projects');
            });
        };

    });
