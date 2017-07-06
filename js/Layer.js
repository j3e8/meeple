app.service("Layer", ["SVGUtil", "MathUtil", "Beard", "Body", "Eyebrows", "Eyes", "FrontArm", "FrontFoot", "FrontHand", "FrontLeg", "Hair", "HairBehind", "Head", "LowerBody", "Mouth", "Nose", "RearArm", "RearFoot", "RearHand", "RearLeg",
function(SVGUtil, MathUtil, Beard, Body, Eyebrows, Eyes, FrontArm, FrontFoot, FrontHand, FrontLeg, Hair, HairBehind, Head, LowerBody, Mouth, Nose, RearArm, RearFoot, RearHand, RearLeg) {
  var Layer = {};

  Layer.layers = {
    'Beard': Beard,
    'Body': Body,
    'Eyebrows': Eyebrows,
    'Eyes': Eyes,
    'FrontArm': FrontArm,
    'FrontFoot': FrontFoot,
    'FrontHand': FrontHand,
    'FrontLeg': FrontLeg,
    'Hair': Hair,
    'HairBehind': HairBehind,
    'Head': Head,
    'LowerBody': LowerBody,
    'Mouth': Mouth,
    'Nose': Nose,
    'RearArm': RearArm,
    'RearFoot': RearFoot,
    'RearHand': RearHand,
    'RearLeg': RearLeg
  }

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
    var bounds = Layer.getBoundingBox(layer, person);
    if (bounds && MathUtil.isPointInsideBox(pt, bounds)) {
      return true;
    }
    return false;
  }

  Layer.getBoundingBox = function(layer, person) {
    var component = getComponentForLayer(layer, person);
    var pos = getPositionRelativeToPerson(component, person);
    pos = MathUtil.addPoints(person.position, pos);
    return {
      x: pos.x - layer.offset.x,
      y: pos.y - layer.offset.y,
      width: layer.size.width,
      height: layer.size.height
    }
  }

  Layer.move = function(layer, vector) {
    var rotatedVector = layer.rotation ? MathUtil.rotateVector(vector, -layer.rotation) : vector;
    layer.offset = MathUtil.subtractPoints(layer.offset, rotatedVector);
  }

  function getPositionRelativeToPerson(component, person) {
    var armature = Layer.layers[component.class];
    var pos = { x: 0, y: 0 };
    if (armature.getPosition) {
      pos = armature.getPosition();
    }
    if (component.relativeTo) {
      var parent = getParentComponent(component, person);
      var parentPos = getPositionRelativeToPerson(parent, person);
      pos = MathUtil.addPoints(parentPos, pos);
    }
    return pos;
  }

  function getComponentForLayer(layer, person) {
    var component = person.composition.find(function(c) {
      return c.class == layer.class;
    });
    return component;
  }

  function getParentComponent(component, person) {
    var component = person.composition.find(function(c) {
      return c.class == component.relativeTo;
    });
    return component;
  }
  return Layer;
}]);
