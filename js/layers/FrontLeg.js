var FrontLeg = {};

FrontLeg.armature = {
  class: 'FrontLeg',
  id: 'frontleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 44, y: 0.1 },
  offset: { x: 12, y: 14.4 },
  rotation: Math.PI * 0.52
}

FrontLeg.getPosition = function() {
  return LowerBody.armature.frontLegPosition;
}
