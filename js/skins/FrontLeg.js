var FrontLeg = {};

FrontLeg.armature = {
  class: 'FrontLeg',
  id: 'frontleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.52
}

FrontLeg.getPosition = function() {
  return Body.armature.frontLegPosition;
}
