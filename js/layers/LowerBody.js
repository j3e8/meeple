var LowerBody = {};

LowerBody.armature = {
  class: 'LowerBody',
  id: 'lowerbody',
  imageUrl: 'lowerbody.svg',
  frontLegPosition: { x: -22.9, y: 9.6},
  rearLegPosition: { x: 20.9, y: 9.1},
  offset: { x: 39.2, y: 19.6 }
}

LowerBody.getPosition = function() {
  return Body.armature.lowerBodyPosition;
}
