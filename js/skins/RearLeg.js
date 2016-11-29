var RearLeg = {};

RearLeg.armature = {
  id: 'rearleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.5
}

RearLeg.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.rearLegPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}
