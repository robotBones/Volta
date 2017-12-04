'use strict';
(function () {

	function MainController($scope, $http, socket, $location) {
		var self = this;
		this.awesomeThings = [];
		console.log('Hello from MainController');


		$scope.myInterval = 5000;
		$scope.noWrapSlides = false;
		var slides = $scope.slides = [];
		$scope.addSlide = function () {
			var newWidth = 600 + slides.length + 1;
			slides.push({
				image: 'placekitten.com/' + newWidth + '/300',
				text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' + ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
			});
		};
		for (var i = 0; i < 4; i++) {
			$scope.addSlide();
		}

		$http.get('/api/things').then(function (response) {
			self.awesomeThings = response.data;
			socket.syncUpdates('thing', self.awesomeThings);
		});

		this.addThing = function () {
			if (self.newThing === '') {
				return;
			}
			$http.post('/api/things', {
				name: self.newThing
			});
			self.newThing = '';
		};

		this.deleteThing = function (thing) {
			$http.delete('/api/things/' + thing._id);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('thing');
		});

		$scope.go = function (path) {
			$location.path(path);
		};
	}

	angular.module('writerboyApp')
		.controller('MainController', MainController);

})();