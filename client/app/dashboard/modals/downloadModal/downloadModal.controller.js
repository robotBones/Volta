'use strict';

angular.module('writerboyApp')
	.controller('downloadModalCtrl', function ($scope, $rootScope, $uibModalInstance, $timeout, $http) {
		$scope.file = {
			'name': 'newFile',
			file: ''
		}
		console.log('Hello from downloadModalCtrl');
		// console.log($rootScope.downloadData);
		var content = $rootScope.downloadData;
		content = content.replace(/<div>/g, '');
		content = content.replace(/<br>/g, '\n');
		content = content.replace(/<\/div>/g, '\n');
		var blob = new Blob([content], {
			type: 'text/plain'
		});
		$scope.txtUrl = (window.URL || window.webkitURL).createObjectURL(blob);
		$scope.txtFileName = $rootScope.downloadTitle + '.txt';

		var pdfContent = $rootScope.downloadData;
		pdfContent = pdfContent.replace(/<br>/g, '');
		pdfContent = pdfContent.replace(/<div>/g, '<p>');
		pdfContent = pdfContent.replace(/<\/div>/g, '</p>');
		console.log(pdfContent);
		var margins = {
			top: 80,
			bottom: 60,
			left: 40,
			width: 522
		};
		var pdf = new jsPDF('p', 'pt', 'letter');
		$scope.downloadPdf = function () {
			pdf.fromHTML(pdfContent, margins.left, margins.top, {
				'width': margins.width
			}, function (dispose) {
				pdf.save($rootScope.downloadTitle + '.pdf');
				$uibModalInstance.dismiss('cancel');
			}, margins);
		};
		var docxContent = '<!DOCTYPE html><html><head><title></title></head><body>' + pdfContent + '</body></html>';
		var converted = htmlDocx.asBlob(docxContent);
		$scope.docxUrl = URL.createObjectURL(converted);
		$scope.docxFileName = $rootScope.downloadTitle + '.docx';

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});