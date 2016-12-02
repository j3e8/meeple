var RearFoot = {};

RearFoot.armature = {
  class: 'RearFoot',
  id: 'rearfoot',
  imageUrl: 'foot.svg',
  offset: { x: 6.3, y: 32 }
}

RearFoot.getPosition = function() {
  return RearLeg.armature.footPosition;
}
