var FrontArm = {};

FrontArm.armature = {
  class: 'FrontArm',
  id: 'frontarm',
  imageUrl: 'arm.svg',
  handPosition: { x: 51.4, y: 0.4 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.6
}

FrontArm.getPosition = function() {
  return Body.armature.frontArmPosition;
}
