var FrontLeg = {};

FrontLeg.armature = {
  class: 'FrontLeg',
  id: 'frontleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.52
}

FrontLeg.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.frontLegPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}
