app.service("MathUtil", function() {
  var MathUtil = {};

  MathUtil.addPoints = function(a, b) {
    return {
      x: Number(a.x) + Number(b.x),
      y: Number(a.y) + Number(b.y)
    }
  }

  MathUtil.scalePoint = function(pt, scale) {
    return {
      x: pt.x * scale,
      y: pt.y * scale
    }
  }

  MathUtil.subtractPoints = function(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    }
  }

  MathUtil.isPointInsideBox = function(pt, box) {
    if (pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height) {
      return true;
    }
    return false;
  }

  MathUtil.rotateVector = function(vector, rotation) {
    var r = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    var t = vector.x != 0 ? Math.atan(vector.y / vector.x) : (vector.y >= 0 ? 0.5 * Math.PI : 1.5 * Math.PI);
    if (vector.x < 0) {
      t += Math.PI;
    }
    t += rotation;

    var x = r * Math.cos(t);
    var y = r * Math.sin(t);

    return {
      'x': x,
      'y': y
    }
  }

  return MathUtil;
});
