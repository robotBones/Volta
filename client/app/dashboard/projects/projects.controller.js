'use strict';

angular.module('writerboyApp')
    .controller('ProjectsCtrl', function($scope, Auth, socket, $http, $uibModal, $timeout, $location) {
        $scope.projects = [];

        $scope.newProject = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'newProjectModal.html',
                controller: 'NewProjectModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    redirect: true
                }
            });
        };
        $scope.firstName = Auth.getCurrentUser().firstName;
        $scope.delete = function(idx) {
            //mark all of the chapters as inGarbage and delete them from here and this project too
            var toDelete = $scope.projects[idx];
            $scope.deleting = true;
            console.log(toDelete);
            $http.delete('/api/projects/' + toDelete._id).then(function(response) {
                // var index = $scope.projects.indexOf(project);
                // console.log('line 24');
                //one by one update all chapters of this project
                // console.log(idx);
                console.log(response);
                $scope.projects.splice(idx, 1);
                $timeout(function() {
                    $scope.deleting = false;
                }, 300);
            });
            // angular.forEach(toDelete.chapters, function(chapter) {
            //   $http.put('/api/chapters/' + chapter, {inGarbage: true}).then(function (response) {
            //     console.log('28 : ' + response)
            //   });
            // });
        };

        $scope.edittingTitle = false;
        $scope.edit = {
            title: ''
        };


        $http.get('/api/projects?uid=' + Auth.getCurrentUser()._id + '&trash=false').success(function(projects) {
            // console.log('this is working');
            // console.log(projects);
            $scope.projects = projects;
            socket.syncUpdates('project', $scope.projects);
        });


        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('project');
        });

        /*$scope.editTitle = function(id) {
            console.log('starting edit');
            $scope.edit = id;
            console.log($scope.edit);
            $timeout(function() {
                $('#inlineTitleEdit').focus();
                $('#inlineTitleEdit').select();
            }, 200);
        };

        $scope.updateTitle = function(p) {
            $scope.edit = false;
            $http.put('/api/projects/' + p._id, {
                title: p.title
            }).then(function(response) {
                console.log(response);
            })
        };*/
        $scope.editProjectTitle = function(project) {
            $scope.edittingTitle = project._id;
            $scope.edit.title = project.title;
        };
        $scope.updateProjectTitle = function(project) {
            if (project.title !== $scope.edit.title) {
                project.title = $scope.edit.title;
                $http.put('/api/projects/' + project._id, {
                    title: project.title
                }).then(function(response) {
                    console.log(response);
                })
            }
            $scope.edit.title = '';
            $scope.edittingTitle = false;
        };
        $scope.goToTheProject = function(id) {
            if (!$scope.deleting && !$scope.edittingTitle) {
                // $state.go('dashboard.project', { id: id });
                $location.path('/dashboard/projects/' + id);
            }
        };
    });
