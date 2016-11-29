app.controller("mainController", function($scope, $http) {
  $scope.selectedArmature = 'body';
  $scope.armatures = [
    { id: 'body', name: 'Body' },
    { id: 'head', name: 'Head' },
    { id: 'frontarm', name: 'Front arm' },
    { id: 'frontleg', name: 'Front leg' },
    { id: 'reararm', name: 'Rear arm' },
    { id: 'rearleg', name: 'Rear leg' }
  ];
  $scope.zIndex = 110;
  $scope.svgBase64 = '';
  $scope.themes = [
    { id: 'beach', name: 'Beach'},
    { id: 'christmas', name: 'Christmas'},
    { id: 'city', name: 'City'},
    { id: 'farm', name: 'Farm'},
    { id: 'generic', name: 'Generic'},
    { id: 'halloween', name: 'Halloween'},
    { id: 'mall', name: 'Mall'},
    { id: 'sky', name: 'Sky'},
    { id: 'suburb', name: 'Suburb'}
  ];
  $scope.selectedThemes = [];
  $scope.skinClassDialogIsDisplayed = undefined;

  $scope.dragOver = function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.dragEnter = function(event) {
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.dragLeave = function(event) {
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.importSvg = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.skinClass = null;
    $scope.skinClassDialogIsDisplayed = true;
    $scope.importedFile = event.dataTransfer.files[0];
    $scope.$apply();
  }

  $scope.addSvgToView = function(skinClass) {
    $scope.skinClassDialogIsDisplayed = false;
    $scope.$broadcast("importSvg", {
      'skinClass': skinClass,
      'file': $scope.importedFile
    });
  }
});
