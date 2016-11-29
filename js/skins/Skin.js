var Skin = {};

Skin.importSvg = function(skinClass) {
  var imageUrl = skinClass.armature.imageUrl;
  var svgImage = new Image();
  svgImage.src = SVG_URL + '/' + imageUrl;

  var skin = {
    'image': svgImage,
    'offset': skinClass.armature.offset,
    'rotation': skinClass.armature.rotation
  };

  SVGUtil.loadSvg(SVG_URL + '/' + imageUrl, function(svgElement) {
    skin.size = SVGUtil.getSize(svgElement);
    console.log(skin);
  });

  return skin;
}

Skin.createBaseSkin = function(skinClass) {
  var skin = Skin.importSvg(skinClass);
  return skin;
}
