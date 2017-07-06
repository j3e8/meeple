app.service("RearArm", ["Body", function(Body) {
  var RearArm = {};

  RearArm.armature = {
    class: 'RearArm',
    id: 'reararm',
    imageUrl: 'arm.svg',
    handPosition: { x: 51.2, y: -0.1 },
    offset: { x: 14.7, y: 15.1 },
    rotation: Math.PI * 0.32
  }

  RearArm.getPosition = function() {
    return Body.armature.rearArmPosition;
  }

  return RearArm;
}]);
