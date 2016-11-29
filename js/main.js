var app = angular.module("mainApp", []);

var SVG_URL = 'http://localhost:8080/svg';

app.controller("mainController", function($scope, $http) {

});

app.directive("artboard", function() {
  return {
    restrict: 'A',
    scope: {},
    template: '',
    link: function($scope, $element, $attrs) {

      var viewSize = {
        width: 500,
        height: 500
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

    }
  };
});
