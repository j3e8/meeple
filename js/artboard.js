app.directive("artboard", function() {
  return {
    restrict: 'A',
    scope: {},
    template: '',
    link: function($scope, $element, $attrs) {

      var viewSize = {
        width: 450,
        height: 450
      };

      var ani = new Animation(document.getElementById('artboard'), animate, render, viewSize);
      var basePerson = Person.createBaseSkin();

      function animate(elapsedTime) {
        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };
        return true;
      }

      function render(htmlCanvas) {
        var ctx = htmlCanvas.getContext("2d");

        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        var xscale = canvasSize.width / viewSize.width;
        var yscale = canvasSize.height / viewSize.height;
        var scale = Math.min(xscale, yscale);

        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        Person.render(ctx, basePerson, canvasSize, scale);
      }

      $scope.$on("importSvg", function($event, data) {
        var reader = new FileReader();
        reader.onload = function () {
          $scope.createSkin(data.skinClass, reader.result);
        };
        reader.readAsDataURL(data.file);
      });

      $scope.createSkin = function(skinClass, data) {
        console.log(skinClass, data);
      }
    }
  };
});
