app.directive("skinClassDialog", function() {
  return {
    restrict: 'E',
    scope: {
      onChoose: '='
    },
    templateUrl: 'js/directives/skin-class-dialog/skin-class-dialog.html',
    link: function($scope, $element, $attrs) {
      $scope.skinClass = 'Body';
      $scope.skinClasses = Person.getComposition().slice(0).sort(function(a, b) {
        if (a.z == b.z) {
          return 0;
        }
        return a.z > b.z ? -1 : 1;
      })
    }
  }
});
