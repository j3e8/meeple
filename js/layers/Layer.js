var Layer = {};

Layer.createLayer = function(layerClass) {
  var offset = { x: 0, y: 0 };
  var rotation = 0;
  var layer = {
    'class': layerClass.armature.class,
    'image': null,
    'offset': layerClass.armature && layerClass.armature.offset ? layerClass.armature.offset : offset,
    'rotation': layerClass.armature && layerClass.armature.rotation ? layerClass.armature.rotation : rotation
  };
  return layer;
}

Layer.importSvg = function(layerClass, base64) {
  var layer = Layer.createLayer(layerClass);
  layer.image = new Image();
  layer.image.src = base64;

  var pos = base64.indexOf('base64,');
  var svgText = atob(base64.substring(pos + 7));
  var div = document.createElement("div");
  div.innerHTML = svgText;
  var svgElement = div.getElementsByTagName('svg')[0];
  layer.size = SVGUtil.getSize(svgElement);
  if (!layerClass.armature || !layerClass.armature.offset || !(layerClass.armature.offset.x && !layerClass.armature.offset.y)) {
    layer.offset = { x: layer.size.width / 2, y: layer.size.height / 2 };
  }
  return layer;
}

Layer.createBaseLayer = function(layerClass) {
  var imageUrl = layerClass.armature.imageUrl;
  var svgImage = new Image();
  svgImage.src = SVG_URL + '/' + imageUrl;

  var layer = Layer.createLayer(layerClass);
  layer.image = svgImage;

  SVGUtil.loadSvg(SVG_URL + '/' + imageUrl, function(svgElement) {
    layer.size = SVGUtil.getSize(svgElement);
  });

  return layer;
}

Layer.hitTest = function(person, layer, pt) {
  var bounds = Layer.getBoundingBox(layer, person.position);
  if (bounds && MathUtil.isPointInsideBox(pt, bounds)) {
    return true;
  }
  return false;
}

Layer.getBoundingBox = function(layer, personPosition) {
  if (window[layer.class] && window[layer.class].getPosition) {
    var relativePos = window[layer.class].getPosition();
    var pos = MathUtil.addPoints(personPosition, relativePos);
    return {
      x: pos.x - layer.offset.x,
      y: pos.y - layer.offset.y,
      width: layer.size.width,
      height: layer.size.height
    }
  }
  return null;
}

Layer.move = function(layer, vector) {
  layer.offset = MathUtil.subtractPoints(layer.offset, vector);
}
