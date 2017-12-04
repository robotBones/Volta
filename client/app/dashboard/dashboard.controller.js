// 'use strict';

angular.module('writerboyApp')
    .controller('DashboardCtrl', function($location, $scope, Auth, socket, $http, NgTableParams, $uibModal, $mdDialog, $timeout, $filter, lodash, $rootScope) {
        console.log('Hello from DashboardCtrl');
        this.chapters = [];
        $scope.chapters = [];
        $scope.edit = false;
        $scope.matchedChapters = 'result';
        $scope.opened = false;
        $scope.gotMatch = true;
        $scope.toggleSearch = function() {
            $scope.opened = !$scope.opened;
            if (!$scope.opened) {
                $scope.gotMatch = true;
                $scope.searching = false;
                $scope.query = '';
            }
        };

        $scope.firstName = Auth.getCurrentUser().firstName;
        if (Auth.getCurrentUser().verified === 'true') {
            console.log('Account is verified');
            $rootScope.showVerifyMessage = false;
        } else {
            console.log('Account is not verified');
            $rootScope.showVerifyMessage = true;
        }

        /*$scope.editOrGo = function (id) {
        	$timeout(function () {
        		console.log('Edit or go?');
        		if (!$scope.edit) {
        			$location.path('/dashboard/edit/' + id)
        		}
        	}, 100);
        };*/

        $scope.edittingTitle = false;
        $scope.edit = {
            title: ''
        };
        $scope.updateTitle = function(chapter) {
            if (chapter.title !== $scope.edit.title) {
                chapter.title = $scope.edit.title;
                $http.put('/api/chapters/' + chapter._id, {
                    title: chapter.title
                }).then(function(response) {
                    $scope.edit = false;
                    console.log(response);
                });
            }
            $scope.edit.title = '';
            $scope.edittingTitle = false;
        };
        $scope.editTitle = function(chapter) {
            $scope.edittingTitle = chapter._id;
            $scope.edit.title = chapter.title;
        };
        $scope.goToChapter = function(id) {
            console.log('go to chapter?');
            $location.path('/dashboard/edit/' + id);
        };

        /*$scope.editTitle = function (id) {
        	console.log('starting edit');
        	$scope.edit = id;
        	console.log($scope.edit);
        	$timeout(function () {
        		$('#inlineTitleEdit').focus();
        		$('#inlineTitleEdit').select();
        	}, 200);
        };

        $scope.updateTitle = function (c) {
        	$http.put('/api/chapters/' + c._id, {
        		title: c.title
        	}).then(function (response) {
        		$scope.edit = false;
        		console.log(response);
        	});
        };*/
        /*$scope.updateOnEnter = function (event, c) {
        	var code = event.which || event.keyCode;
        	if (code === 13) {
        		event.preventDefault();
        		console.log('Prevent default');
        		$http.put('/api/chapters/' + c._id, {
        			title: c.title
        		}).then(function (response) {
        			$scope.edit = false;
        			console.log(response);
        		});
        	}
        };*/
        /* Search Function */
        $scope.$watch('query', function(changed) {
            if (changed) {
                $scope.searching = true;
                var matchedChapters = [];
                for (var i = 0; i < $scope.chapters.length; i++) {
                    if ($scope.chapters[i].body) {
                        // console.log($scope.chapters[i].body);
                        console.log($scope.chapters[i].title);
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
        $scope.data = [];

        $http.get('/api/chapters?uid=' + Auth.getCurrentUser()._id).then(function(response) {
            $scope.chapters = response.data;
            socket.syncUpdates('chapter', $scope.chapters);
            if ($scope.chapters.length === 0) {
                $scope.noChapters = true;
            } else {
                $scope.noChapters = false;
                $scope.chapters = lodash.orderBy($scope.chapters, ['updated_at'], ['desc']);
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: $scope.chapters.length
                }, {
                    counts: [],
                    data: $scope.chapters
                        /*total: 1,
                        getData: function ($defer, params) {
                        	$scope.data = params.sorting() ? $filter('orderBy')($scope.chapters, params.orderBy()) : $scope.chapters;
                        	$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        	$scope.data = $scope.data.slice(0, 12);
                        	$defer.resolve($scope.data);
                        }*/
                });
                setTimeout(function() {
                    $('tbody td').attr('title', '');
                }, 200);
            }
        });
        $scope.getMoreData = function() {
            $scope.loadingData = true;
            $scope.noMoreChapters = false;
            $timeout(function() {
                if ($scope.data.length >= $scope.chapters.length) {
                    $scope.noMoreChapters = true;
                } else {
                    $scope.noMoreChapters = false;
                }
                $scope.data = $scope.chapters.slice(0, $scope.data.length + 12);
                $scope.loadingData = false;
            }, 600);
        }

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
                                $scope.chapters[i] = response.data;
                                $scope.tableParams.reload();
                                break;
                            }
                        }
                    });
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.addToProject = function(chapterId, projectid, index) {
            // add project to existing chapter
            console.log(projectid);
            $http.put('/api/chapters/' + chapterId, {
                project: projectid
            }).then(function(response) {
                console.log(response);
                $http.get('/api/chapters/' + chapterId).then(function(response) {
                    console.log('will update: ' + response.data.project.title);
                    for (var i = 0; i < $scope.chapters.length; i++) {
                        if ($scope.chapters[i]._id === chapterId) {
                            console.log('found');
                            $scope.chapters[i] = response.data;
                            $scope.tableParams.reload();
                            break;
                        }
                    }
                });
            });
        };
        $scope.deleteChapter = function(chapterId) {
            $http.put('/api/chapters/' + chapterId, {
                inGarbage: true
            });
            for (var i = 0; i < $scope.chapters.length; i++) {
                if ($scope.chapters[i]._id === chapterId) {
                    console.log('found');
                    $scope.chapters.splice(i, 1);
                    console.log($scope.chapters);
                    if ($scope.chapters.length > 0) {
                        $scope.noChapters = false;
                        $scope.tableParams.reload();
                    } else {
                        $scope.noChapters = true;
                    }
                    break;
                }
            }
        };
    });
