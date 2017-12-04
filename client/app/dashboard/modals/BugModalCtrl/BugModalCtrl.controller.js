'use strict';

angular.module('writerboyApp')
  .controller('BugModalCtrl', function ($scope, Auth, $http, $uibModalInstance, Upload) {
    $scope.bug = {
      email: Auth.getCurrentUser().email
    };

    $scope.openTicket = function () {


      console.log($scope.bug);

          Upload.upload({
      url: 'api/bugs',
      method: 'POST',
      data: $scope.bug, // Any data needed to be submitted along with the files
      file: $scope.file
    }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $uibModalInstance.close();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            $uibModalInstance.close();
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

      // $http.post('/api/bugs', { bug: $scope.bug, upload: $scope.file } ).then(function(response) {
      //   console.log(response);
      // });

    //   $http({
    //     method: 'POST',
    //     url: '/api/bugs',
    //     data: {
    //         bug: $scope.bug,
    //         upload: $scope.file
    //     },
    //     transformRequest: function (data, headersGetter) {
    //         var formData = new FormData();
    //         angular.forEach(data, function (value, key) {
    //             formData.append(key, value);
    //             console.log(key + ' ' + value);
    //         });
    //
    //         // var headers = headersGetter();
    //         // delete headers['Content-Type'];
    //
    //         return formData;
    //     }
    // })
    // .success(function (data) {
    //   console.log('done');
    //   $uibModalInstance.close();
    // })
    // .error(function (data, status) {
    //   console.log(data);
    //   // $uibModalInstance.close();
    // });
    };

    $scope.close = function () {
      $uibModalInstance.close();
    }

  });
