var RearArm = {};

RearArm.armature = {
  imageUrl: 'arm.svg',
  handPosition: { x: 51.2, y: -0.1 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.32
}

RearArm.getPosition = function(startPt, scale) {
  var scaledRearArmPosition = MathUtil.scalePoint(Body.armature.rearArmPosition, scale);
  return MathUtil.addPoints(startPt, scaledRearArmPosition);
}
