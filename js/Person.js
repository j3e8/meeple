var Person = {};

Person.getComposition = function() {
  return [
    { 'z': 10, 'class': 'RearArm' },
    { 'z': 20, 'class': 'RearLeg' },
    { 'z': 30, 'class': 'Body' },
    { 'z': 40, 'class': 'HairBehind' },
    { 'z': 50, 'class': 'Head' },
    { 'z': 60, 'class': 'Eyes' },
    { 'z': 70, 'class': 'Eyebrows' },
    { 'z': 80, 'class': 'Beard' },
    { 'z': 90, 'class': 'Nose' },
    { 'z': 100, 'class': 'Mouth' },
    { 'z': 110, 'class': 'Hair' },
    { 'z': 120, 'class': 'FrontLeg' },
    { 'z': 130, 'class': 'FrontArm' }
  ];
}

Person.create = function() {
  return {
    composition: Person.getComposition()
  }
}

Person.createBaseSkin = function() {
  var person = Person.create();

  var baseClasses = [ 'RearArm', 'RearLeg', 'Body', 'Head', 'FrontLeg', 'FrontArm' ];
  person.composition = person.composition.filter(function(c) {
    if (baseClasses.indexOf(c.class) != -1) {
      return true;
    }
    return false;
  });

  person.composition.forEach(function(c) {
    c.skin = Skin.createBaseSkin(window[c.class]);
  });

  return person;
}

Person.render = function(ctx, person, canvasSize, scale) {
  person.composition.forEach(function(c) {
    if (window[c.class] && window[c.class].armature && c.skin) {
      var center = {
        x: canvasSize.width / 2,
        y: canvasSize.height / 2
      };

      var pos = Object.assign({}, center);
      if (window[c.class].getPosition) {
        pos = window[c.class].getPosition(center, scale);
      }
      Person.renderComponentSkin(ctx, window[c.class], c.skin, pos, scale);
    }
  });
}

Person.calculateSkinPoint = function(skin, scale) {
  var pos = {
    x: 0,
    y: 0
  };
  if (skin.offset) {
    pos.x = -skin.offset.x * scale;
    pos.y = -skin.offset.y * scale;
  }
  return pos;
}

Person.renderComponentSkin = function(ctx, component, skin, position, scale) {
  var pt = Person.calculateSkinPoint(skin, scale);
  if (skin.size) {
    ctx.save();
    ctx.translate(position.x, position.y);
    if (skin.rotation) {
      ctx.rotate(skin.rotation);
    }
    var w = skin.size.width * scale;
    var h = skin.size.height * scale;
    ctx.drawImage(skin.image, pt.x, pt.y, w, h);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(-1, -1, 2, 2);

    ctx.restore();
  }
}

Person.addSkin = function(person, skin) {
  var comp = person.composition.find(function(c) {
    return c.class == skin.class;
  });
  comp.skin = skin;
}
