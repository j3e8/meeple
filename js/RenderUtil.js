app.service("RenderUtil", ["Layer", "MathUtil", function(Layer, MathUtil) {
  var RenderUtil = {};

  RenderUtil.transformContextForComponent = function(ctx, person, component, scale) {
    if (component.relativeTo) {
      var masterComponent = person.composition.find(function(c) {
        return c.class == component.relativeTo;
      });
      if (masterComponent) {
        RenderUtil.transformContextForComponent(ctx, person, masterComponent, scale);
      }
    }

    var pos = { x: 0, y: 0 };
    if (Layer.layers[component.class].getPosition) {
      var tmp = Layer.layers[component.class].getPosition();
      pos = MathUtil.scalePoint(tmp, scale);
    }

    if (pos.x || pos.y) {
      // console.log('translate', pos.x, pos.y);
      ctx.translate(pos.x, pos.y);
    }

    if (component.layer && component.layer.rotation) {
      // console.log('rotate', component.layer.rotation);
      ctx.rotate(component.layer.rotation);
    }
  }

  return RenderUtil;
}]);
