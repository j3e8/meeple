var FrontFoot = {};

FrontFoot.armature = {
  class: 'FrontFoot',
  id: 'frontfoot',
  imageUrl: 'foot.svg',
  offset: { x: 6.3, y: 32 }
}

FrontFoot.getPosition = function() {
  return FrontLeg.armature.footPosition;
}
