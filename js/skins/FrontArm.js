var FrontArm = {};

FrontArm.armature = {
  class: 'FrontArm',
  id: 'frontarm',
  imageUrl: 'arm.svg',
  handPosition: { x: 51.2, y: -0.1 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.6
}

FrontArm.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.frontArmPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}
