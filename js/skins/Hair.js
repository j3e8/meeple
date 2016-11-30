var Hair = {};

Hair.armature = {
  class: 'Hair',
  id: 'hair'
}

Hair.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.headPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}
