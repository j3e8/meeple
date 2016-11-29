var Body = {};

Body.armature = {
  headPosition: { x: -4, y: -102 },
  frontArmPosition: { x: -30.4, y: -28.8},
  rearArmPosition: { x: 23.7, y: -32},
  frontLegPosition: { x: -22.9, y: 42.2},
  rearLegPosition: { x: 20.9, y: 41.7},
  imageUrl: 'body.svg',
  offset: { x: 40, y: 50 }
}

Body.getPosition = function(startPt, scale) {
  return startPt;
}
