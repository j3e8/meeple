app.directive("layerClassDialog", ["Person", function(Person) {
  return {
    restrict: 'E',
    scope: {
      onChoose: '='
    },
    templateUrl: 'js/directives/layer-class-dialog/layer-class-dialog.html',
    link: function($scope, $element, $attrs) {
      $scope.layerClass = 'Body';
      $scope.layerClasses = Person.getComposition().slice(0).sort(function(a, b) {
        if (a.z == b.z) {
          return 0;
        }
        return a.z > b.z ? -1 : 1;
      })
    }
  }
}]);
