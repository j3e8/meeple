var Head = {};

Head.armature = {
  class: 'Head',
  id: 'head',
  imageUrl: 'head.svg',
  offset: { x: 76, y: 67 }
}

Head.getPosition = function() {
  return Body.armature.headPosition;
}
