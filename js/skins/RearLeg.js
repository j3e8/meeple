var RearLeg = {};

RearLeg.armature = {
  class: 'RearLeg',
  id: 'rearleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.5
}

RearLeg.getPosition = function() {
  return Body.armature.rearLegPosition;
}
