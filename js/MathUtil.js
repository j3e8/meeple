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