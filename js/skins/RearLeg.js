var RearLeg = {};

RearLeg.armature = {
  class: 'RearLeg',
  id: 'rearleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 44, y: 0.1 },
  offset: { x: 12, y: 14.4 },
  rotation: Math.PI * 0.5
}

RearLeg.getPosition = function() {
  return Body.armature.rearLegPosition;
}
