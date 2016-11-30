var Head = {};

Head.armature = {
  class: 'Head',
  id: 'head',
  imageUrl: 'head.svg',
  offset: { x: 76, y: 67 }
}

Head.getPosition = function(startPt, scale) {
  var scaledHeadPosition = MathUtil.scalePoint(Body.armature.headPosition, scale);
  return MathUtil.addPoints(startPt, scaledHeadPosition);
}
