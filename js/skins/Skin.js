var Skin = {};

Skin.createSkin = function(skinClass) {
  var offset = { x: 0, y: 0 };
  var rotation = 0;
  var skin = {
    'class': skinClass.armature.class,
    'image': null,
    'offset': skinClass.armature && skinClass.armature.offset ? skinClass.armature.offset : offset,
    'rotation': skinClass.armature && skinClass.armature.rotation ? skinClass.armature.rotation : rotation
  };
  return skin;
}

Skin.importSvg = function(skinClass, base64) {
  var skin = Skin.createSkin(skinClass);
  skin.image = new Image();
  skin.image.src = base64;

  var pos = base64.indexOf('base64,');
  var svgText = atob(base64.substring(pos + 7));
  var div = document.createElement("div");
  div.innerHTML = svgText;
  var svgElement = div.getElementsByTagName('svg')[0];
  skin.size = SVGUtil.getSize(svgElement);
  if (!skinClass.armature || !skinClass.armature.offset || !(skinClass.armature.offset.x && !skinClass.armature.offset.y)) {
    skin.offset = { x: skin.size.width / 2, y: skin.size.height / 2 };
  }
  return skin;
}

Skin.createBaseSkin = function(skinClass) {
  var imageUrl = skinClass.armature.imageUrl;
  var svgImage = new Image();
  svgImage.src = SVG_URL + '/' + imageUrl;

  var skin = Skin.createSkin(skinClass);
  skin.image = svgImage;

  SVGUtil.loadSvg(SVG_URL + '/' + imageUrl, function(svgElement) {
    skin.size = SVGUtil.getSize(svgElement);
  });

  return skin;
}

Skin.hitTest = function(skin, pt) {
  return true;
}

Skin.move = function(skin, vector) {
  skin.offset = MathUtil.subtractPoints(skin.offset, vector);
}
