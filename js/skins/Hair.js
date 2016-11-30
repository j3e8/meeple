var Hair = {};

Hair.armature = {
  class: 'Hair',
  id: 'hair'
}

Hair.getPosition = function() {
  return Body.armature.headPosition;
}
