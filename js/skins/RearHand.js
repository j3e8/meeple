var RearHand = {};

RearHand.armature = {
  class: 'RearHand',
  id: 'rearhand',
  imageUrl: 'hand.svg',
  offset: { x: 13.5, y: 13.6 }
}

RearHand.getPosition = function() {
  return RearArm.armature.handPosition;
}
