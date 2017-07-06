app.service("Body", function() {
  var Body = {};

  Body.armature = {
    class: 'Body',
    id: 'body',
    headPosition: { x: -4, y: -100 },
    frontArmPosition: { x: -30.4, y: -28.8},
    rearArmPosition: { x: 23.7, y: -32},
    lowerBodyPosition: { x: 0, y: 32.6 },
    imageUrl: 'body.svg',
    offset: { x: 40, y: 50 }
  }

  Body.getPosition = function() {
    return {
      x: 0,
      y: 0
    };
  }

  return Body;
});
