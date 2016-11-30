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
      ani.getCanvas().addEventListener("mousedown", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseDown(pt);
      });
      ani.getCanvas().addEventListener("mousemove", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseMove(pt);
      });
      ani.getCanvas().addEventListener("mouseup", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseUp(pt);
      });

      var scale = 1;
      var basePerson = Person.createBaseSkin();
      var person = Person.create();

      function centerPerson() {
        person.position = {
          x: (ani.getWidth() / 2) / scale,
          y: (ani.getHeight() / 2) / scale
        };
      }

      function animate(elapsedTime) {
        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        var xscale = canvasSize.width / viewSize.width;
        var yscale = canvasSize.height / viewSize.height;
        scale = Math.min(xscale, yscale);
        centerPerson();

        return true;
      }

      function render(htmlCanvas) {
        var ctx = htmlCanvas.getContext("2d");

        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        Person.render(ctx, basePerson, canvasSize, scale);
        Person.render(ctx, person, canvasSize, scale);
      }

      $scope.$on("importSvg", function($event, data) {
        var reader = new FileReader();
        reader.onload = function () {
          $scope.createSkin(data.skinClass, reader.result);
        };
        reader.readAsDataURL(data.file);
      });

      $scope.createSkin = function(skinClass, data) {
        if (window[skinClass]) {
          var newSkin = Skin.importSvg(window[skinClass], data);
          Person.addSkin(person, newSkin);
        }
      }

      function mouseDown(pt) {
        for (var i=person.composition.length - 1; i >=0; i--) {
          var scaledPt = MathUtil.scalePoint(pt, 1 / scale);
          if (person.composition[i].skin && Skin.hitTest(person, person.composition[i].skin, scaledPt)) {
            MouseState.draggedSkin = person.composition[i].skin;
            break;
          }
        }
        MouseState.lastDownPoint = Object.assign({}, pt);
        MouseState.lastMovePoint = Object.assign({}, pt);
      }

      function mouseMove(pt) {
        if (MouseState.draggedSkin) {
          var delta = MathUtil.subtractPoints(pt, MouseState.lastMovePoint);
          var scaledDelta = MathUtil.scalePoint(delta, 1 / scale);
          Skin.move(MouseState.draggedSkin, scaledDelta);
        }
        MouseState.lastMovePoint = Object.assign({}, pt);
      }

      function mouseUp(pt) {
        MouseState.draggedSkin = null;
      }
    }
  };
});
