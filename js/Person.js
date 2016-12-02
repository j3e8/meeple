var Person = {};

Person.getComposition = function() {
  return [
    { 'z': 8, 'class': 'RearHand', 'probability': 1, 'baseLayer': true, 'relativeTo': 'RearArm' },
    { 'z': 10, 'class': 'RearArm', 'probability': 1, 'baseLayer': true, 'relativeTo': 'Body' },
    { 'z': 20, 'class': 'RearLeg', 'probability': 1, 'baseLayer': true, 'relativeTo': 'Body' },
    { 'z': 12, 'class': 'RearFoot', 'probability': 1, 'baseLayer': true, 'relativeTo': 'RearLeg' },
    { 'z': 30, 'class': 'Body', 'probability': 1, 'baseLayer': true },
    { 'z': 40, 'class': 'HairBehind', 'probability': 0, 'relativeTo': 'Head' },
    { 'z': 50, 'class': 'Head', 'probability': 1, 'baseLayer': true, 'relativeTo': 'Body' },
    { 'z': 60, 'class': 'Eyes', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 70, 'class': 'Eyebrows', 'probability': 0.7, 'relativeTo': 'Head' },
    { 'z': 80, 'class': 'Beard', 'probability': 0.1, 'relativeTo': 'Head' },
    { 'z': 90, 'class': 'Nose', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 100, 'class': 'Mouth', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 110, 'class': 'Hair', 'probability': 0.9, 'relativeTo': 'Head' },
    { 'z': 120, 'class': 'FrontLeg', 'probability': 1, 'baseLayer': true, 'relativeTo': 'Body' },
    { 'z': 122, 'class': 'FrontFoot', 'probability': 1, 'baseLayer': true, 'relativeTo': 'FrontLeg' },
    { 'z': 128, 'class': 'FrontHand', 'probability': 1, 'baseLayer': true, 'relativeTo': 'FrontArm' },
    { 'z': 130, 'class': 'FrontArm', 'probability': 1, 'baseLayer': true, 'relativeTo': 'Body' }
  ];
}

Person.create = function() {
  return {
    composition: Person.getComposition()
  }
}

Person.createBaseLayer = function() {
  var person = Person.create();

  person.composition = person.composition.filter(function(c) {
    return c.baseLayer;
  });

  person.composition.forEach(function(c) {
    c.layer = Layer.createBaseLayer(window[c.class]);
  });

  return person;
}

Person.addLayer = function(person, layer) {
  var comp = person.composition.find(function(c) {
    return c.class == layer.class;
  });
  comp.layer = layer;
}

Person.render = function(ctx, person, canvasSize, scale) {
  ctx.save();
  ctx.translate(person.position.x * scale, person.position.y * scale);

  person.composition.forEach(function(c) {
    if (window[c.class] && window[c.class].armature && c.layer && c.layer.size) {
      ctx.save();
      RenderUtil.transformContextForComponent(ctx, person, c, scale);

      var w = c.layer.size.width * scale;
      var h = c.layer.size.height * scale;
      var x = -c.layer.offset.x * scale;
      var y = -c.layer.offset.y * scale;
      ctx.drawImage(c.layer.image, x, y, w, h);
      // console.log('render');

      ctx.fillStyle = "#ccc";
      ctx.fillRect(-1, -1, 2, 2);

      ctx.restore();
    }
  });

  ctx.restore();
}
