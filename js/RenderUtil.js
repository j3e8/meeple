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
  if (window[component.class].getPosition) {
    var tmp = window[component.class].getPosition();
    pos = MathUtil.scalePoint(tmp, scale);
  }

  if (pos.x || pos.y) {
    // console.log('translate', pos.x, pos.y);
    ctx.translate(pos.x, pos.y);
  }

  if (component.skin.rotation) {
    // console.log('rotate', component.skin.rotation);
    ctx.rotate(component.skin.rotation);
  }
}
