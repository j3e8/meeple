var FrontHand = {};

FrontHand.armature = {
  class: 'FrontHand',
  id: 'fronthand',
  imageUrl: 'hand.svg',
  offset: { x: 13.5, y: 13.6 }
}

FrontHand.getPosition = function() {
  return FrontArm.armature.handPosition;
}
