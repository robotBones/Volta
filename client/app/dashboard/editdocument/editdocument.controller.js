'use strict';

angular.module('writerboyApp')
    .controller('EditdocumentCtrl', function($scope, $rootScope, $uibModal, $http, $interval, $routeParams, ngToast) {

        $scope.toggleMenus = function(e) {
            if (e.keyCode === 27) {
                $('#content-container').removeClass('nav-toggled');
                $('#editorbottom').removeClass('bottom-toggled');
                $('.ql-editor').removeClass('editor-toggled');
                $('.save-message').removeClass('message-toggled');
                //$('#wrapper').removeClass('toggled');
            }
        }
        $rootScope.inEditor = true;
        $rootScope.showVerifyMessage = false;

        $scope.edit = function(value) {
            console.log('editing title');
            if (!value) {
                $scope.editTitle = false;
                if ($scope.title === '' || $scope.title === ' ') {
                    $scope.title = 'Untitled Document';
                }
            } else {
                $scope.editTitle = true;
            }
        };

        $scope.toggleMenu = function() {
            // console.log("hello");
            $('#wrapper').toggleClass('toggled');
        };

        $scope.$on('editorCreated', function(event, editor) {
            $http.get('/api/chapters/' + $routeParams.id)
                .then(function(response) {
                    $scope.document = response.data;
                    $scope.title = $scope.document.title;
                    $scope.body = $scope.document.body;
                    $scope.words = $scope.document.words;
                }, function(err) {
                    console.log(err);
                });


            // Focus on the editor ok!
            editor.focus();

            // Word count module. Needs some regression testing
            editor.on('text-change', function(delta, source) {
                var text = editor.getText();
                // text = text.trim();
                $scope.words = text.split(/\s+/).length - 1;
            });

            // Lets hide the sidebar
            $('#wrapper').toggleClass('toggled');
        });

        $scope.openDownloadModal = function() {
            $rootScope.downloadData = $scope.body;
            $rootScope.downloadTitle = $scope.title;
            console.log($rootScope.downloadData);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dashboard/modals/downloadModal/downloadModal.html',
                controller: 'downloadModalCtrl',
                size: 'sm',
                resolve: {
                    redirect: true
                }
            });
        };

        // Timeout function to save the document one by one.
        var updateinterval = $interval(function() {
            if ($routeParams.id !== null) {
                $scope.saveMessage = 'Saving...';
                $http.put('/api/chapters/' + $routeParams.id, {
                        _id: $routeParams.id,
                        title: $scope.title,
                        body: $scope.body,
                        words: $scope.words
                    })
                    .then(function(payload) {
                        $scope.saveMessage = 'Saved';
                        console.log('updated');
                    });
            }
        }, 2000);

        $scope.$on('$destroy', function() {
            $interval.cancel(updateinterval);
            $rootScope.inEditor = false;
        });

        $scope.openShareModal = function () {
        	$rootScope.downloadData = $scope.body;
            $rootScope.downloadTitle = $scope.title;
            console.log($rootScope.downloadData);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dashboard/modals/shareDoc/shareDoc.html',
                controller: 'shareDocCtrl',
                size: 'md',
                resolve: {
                    redirect: true,
                    chapterId: function () {
                    	return $routeParams.id;
                    }
                }
            });
        }

        // $scope.print = function() {
        //     // var printContents = document.getElementById(divName).innerHTML;
        //     var printContents = $('#ql-editor-1').html();
        //     var originalContents = document.body.innerHTML;

        //     document.body.innerHTML = printContents;

        //     window.print();

        //     document.body.innerHTML = originalContents;
        // };

    });
