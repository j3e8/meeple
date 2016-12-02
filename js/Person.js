var Person = {};

Person.getComposition = function() {
  return [
    { 'z': 8, 'class': 'RearHand', 'probability': 1, 'baseSkin': true, 'relativeTo': 'RearArm' },
    { 'z': 10, 'class': 'RearArm', 'probability': 1, 'baseSkin': true, 'relativeTo': 'Body' },
    { 'z': 20, 'class': 'RearLeg', 'probability': 1, 'baseSkin': true, 'relativeTo': 'Body' },
    { 'z': 12, 'class': 'RearFoot', 'probability': 1, 'baseSkin': true, 'relativeTo': 'RearLeg' },
    { 'z': 30, 'class': 'Body', 'probability': 1, 'baseSkin': true },
    { 'z': 40, 'class': 'HairBehind', 'probability': 0, 'relativeTo': 'Head' },
    { 'z': 50, 'class': 'Head', 'probability': 1, 'baseSkin': true, 'relativeTo': 'Body' },
    { 'z': 60, 'class': 'Eyes', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 70, 'class': 'Eyebrows', 'probability': 0.7, 'relativeTo': 'Head' },
    { 'z': 80, 'class': 'Beard', 'probability': 0.1, 'relativeTo': 'Head' },
    { 'z': 90, 'class': 'Nose', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 100, 'class': 'Mouth', 'probability': 1, 'relativeTo': 'Head' },
    { 'z': 110, 'class': 'Hair', 'probability': 0.9, 'relativeTo': 'Head' },
    { 'z': 120, 'class': 'FrontLeg', 'probability': 1, 'baseSkin': true, 'relativeTo': 'Body' },
    { 'z': 122, 'class': 'FrontFoot', 'probability': 1, 'baseSkin': true, 'relativeTo': 'FrontLeg' },
    { 'z': 128, 'class': 'FrontHand', 'probability': 1, 'baseSkin': true, 'relativeTo': 'FrontArm' },
    { 'z': 130, 'class': 'FrontArm', 'probability': 1, 'baseSkin': true, 'relativeTo': 'Body' }
  ];
}

Person.create = function() {
  return {
    composition: Person.getComposition()
  }
}

Person.createBaseSkin = function() {
  var person = Person.create();

  person.composition = person.composition.filter(function(c) {
    return c.baseSkin;
  });

  person.composition.forEach(function(c) {
    c.skin = Skin.createBaseSkin(window[c.class]);
  });

  return person;
}

Person.addSkin = function(person, skin) {
  var comp = person.composition.find(function(c) {
    return c.class == skin.class;
  });
  comp.skin = skin;
}

Person.render = function(ctx, person, canvasSize, scale) {
  ctx.save();
  ctx.translate(person.position.x * scale, person.position.y * scale);

  person.composition.forEach(function(c) {
    if (window[c.class] && window[c.class].armature && c.skin && c.skin.size) {
      // console.log(c.class);
      ctx.save();
      RenderUtil.transformContextForComponent(ctx, person, c, scale);

      var w = c.skin.size.width * scale;
      var h = c.skin.size.height * scale;
      var x = -c.skin.offset.x * scale;
      var y = -c.skin.offset.y * scale;
      ctx.drawImage(c.skin.image, x, y, w, h);
      // console.log('render');

      ctx.fillStyle = "#ccc";
      ctx.fillRect(-1, -1, 2, 2);

      ctx.restore();
    }
  });

  ctx.restore();
}

/*
Person.render = function(ctx, person, canvasSize, scale) {
  var center = {
    x: canvasSize.width / 2,
    y: canvasSize.height / 2
  };
  person.composition.forEach(function(c) {
    if (window[c.class] && window[c.class].armature && c.skin) {
      var pos = Object.assign({}, center);
      if (window[c.class].getPosition) {
        var tmp = window[c.class].getPosition();
        var scaledPosition = MathUtil.scalePoint(tmp, scale);
        pos = MathUtil.addPoints(center, scaledPosition);
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
*/
