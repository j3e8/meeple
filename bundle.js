var app = angular.module("mainApp", []);

var SVG_URL = 'http://localhost:8080/svg';

function Animation(htmlContainer, animationCallback, renderCallback, viewSize) {
  var htmlCanvas = null;
  var aspectRatio = viewSize.width / viewSize.height;

  htmlCanvas = document.createElement("canvas");
  htmlCanvas.style.marginLeft = "auto";
  htmlCanvas.style.marginRight = "auto";
  htmlContainer.style.textAlign = "center";
  htmlContainer.appendChild(htmlCanvas);
  fillParent();
  _requestAnimationFrame();

  window.addEventListener("resize", function() {
    fillParent();
  });

  this.getCanvas = function() {
    return htmlCanvas;
  }

  this.getWidth = function() {
    return htmlCanvas.width;
  }

  this.getHeight = function() {
    return htmlCanvas.height;
  }

  function fillParent() {
    var parentRatio = htmlContainer.offsetWidth / htmlContainer.offsetHeight;

    if (aspectRatio && aspectRatio >= parentRatio) {
      htmlCanvas.width = htmlContainer.offsetWidth;
      htmlCanvas.height = htmlContainer.offsetWidth / aspectRatio;
    }
    else if (aspectRatio && aspectRatio < parentRatio) {
      htmlCanvas.height = htmlContainer.offsetHeight;
      htmlCanvas.width = htmlContainer.offsetHeight * aspectRatio;
    }
    else {
      htmlCanvas.width = htmlContainer.offsetWidth;
      htmlCanvas.height = htmlContainer.offsetHeight;
    }
  }

  function _requestAnimationFrame() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animateFrame);
    }
    else if (window.webkitRequestAnimationFrame) {
      window.webkitRequestAnimationFrame(animateFrame);
    }
    else if (window.mozRequestAnimationFrame) {
      window.mozRequestAnimationFrame(animateFrame);
    }
    else if (window.msRequestAnimationFrame) {
      window.msRequestAnimationFrame(animateFrame);
    }
  }

  var lastFrame = new Date().getTime();
  function animateFrame() {
    var thisFrame = new Date().getTime();
    var elapsedTime = thisFrame - lastFrame;

    var needsRender = false;
    if (animationCallback) {
      needsRender = animationCallback(elapsedTime);
    }

    if (needsRender && renderCallback) {
      renderCallback(htmlCanvas);
    }

    lastFrame = thisFrame;
    _requestAnimationFrame();
  }
}

var MathUtil = {};

MathUtil.addPoints = function(a, b) {
  return {
    x: Number(a.x) + Number(b.x),
    y: Number(a.y) + Number(b.y)
  }
}

MathUtil.scalePoint = function(pt, scale) {
  return {
    x: pt.x * scale,
    y: pt.y * scale
  }
}

MathUtil.subtractPoints = function(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

MathUtil.isPointInsideBox = function(pt, box) {
  if (pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height) {
    return true;
  }
  return false;
}

var MouseState = {
  draggedSkin: null,
  lastDownPoint: {
    x: 0,
    y: 0
  },
  lastMovePoint: {
    x: 0,
    y: 0
  }
};

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

Person.addSkin = function(person, skin) {
  var comp = person.composition.find(function(c) {
    return c.class == skin.class;
  });
  comp.skin = skin;
}

var SVGUtil = {};

SVGUtil.loadSvg = function(url, callback) {
  var xhr = new XMLHttpRequest;
  xhr.open('get', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var tmpsvg = xhr.responseXML.documentElement;
      var svgElement = document.importNode(tmpsvg, true);
      if (callback) {
        callback(svgElement);
      }
    }
  }
  xhr.send();
}

SVGUtil.getSize = function(svgElement) {
  var svgSize = {
    width: parseFloat(svgElement.getAttribute('width')) || parseFloat(svgElement.getAttribute('viewBox').split(' ')[2]),
    height: parseFloat(svgElement.getAttribute('height')) || parseFloat(svgElement.getAttribute('viewBox').split(' ')[3])
  };
  return svgSize;
}

app.directive("artboard", function() {
  return {
    restrict: 'A',
    scope: {},
    template: '',
    link: function($scope, $element, $attrs) {

      var viewSize = {
        width: 450,
        height: 450
      };

      var ani = new Animation(document.getElementById('artboard'), animate, render, viewSize);
      ani.getCanvas().addEventListener("mousedown", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseDown(pt);
      });
      ani.getCanvas().addEventListener("mousemove", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseMove(pt);
      });
      ani.getCanvas().addEventListener("mouseup", function(event) {
        var rect = ani.getCanvas().getBoundingClientRect();
        var pt = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        mouseUp(pt);
      });

      var scale = 1;
      var basePerson = Person.createBaseSkin();
      var person = Person.create();

      function centerPerson() {
        person.position = {
          x: (ani.getWidth() / 2) / scale,
          y: (ani.getHeight() / 2) / scale
        };
      }

      function animate(elapsedTime) {
        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        var xscale = canvasSize.width / viewSize.width;
        var yscale = canvasSize.height / viewSize.height;
        scale = Math.min(xscale, yscale);
        centerPerson();

        return true;
      }

      function render(htmlCanvas) {
        var ctx = htmlCanvas.getContext("2d");

        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        Person.render(ctx, basePerson, canvasSize, scale);
        Person.render(ctx, person, canvasSize, scale);
      }

      $scope.$on("importSvg", function($event, data) {
        var reader = new FileReader();
        reader.onload = function () {
          $scope.createSkin(data.skinClass, reader.result);
        };
        reader.readAsDataURL(data.file);
      });

      $scope.createSkin = function(skinClass, data) {
        if (window[skinClass]) {
          var newSkin = Skin.importSvg(window[skinClass], data);
          Person.addSkin(person, newSkin);
        }
      }

      function mouseDown(pt) {
        for (var i=0; i < person.composition.length; i++) {
          var scaledPt = MathUtil.scalePoint(pt, 1 / scale);
          if (person.composition[i].skin && Skin.hitTest(person, person.composition[i].skin, scaledPt)) {
            MouseState.draggedSkin = person.composition[i].skin;
            break;
          }
        }
        MouseState.lastDownPoint = Object.assign({}, pt);
        MouseState.lastMovePoint = Object.assign({}, pt);
      }

      function mouseMove(pt) {
        if (MouseState.draggedSkin) {
          var delta = MathUtil.subtractPoints(pt, MouseState.lastMovePoint);
          var scaledDelta = MathUtil.scalePoint(delta, 1 / scale);
          Skin.move(MouseState.draggedSkin, scaledDelta);
        }
        MouseState.lastMovePoint = Object.assign({}, pt);
      }

      function mouseUp(pt) {
        MouseState.draggedSkin = null;
      }
    }
  };
});

app.controller("mainController", function($scope, $http) {
  $scope.selectedArmature = 'body';
  $scope.armatures = [
    { id: 'body', name: 'Body' },
    { id: 'head', name: 'Head' },
    { id: 'frontarm', name: 'Front arm' },
    { id: 'frontleg', name: 'Front leg' },
    { id: 'reararm', name: 'Rear arm' },
    { id: 'rearleg', name: 'Rear leg' }
  ];
  $scope.zIndex = 110;
  $scope.svgBase64 = '';
  $scope.themes = [
    { id: 'beach', name: 'Beach'},
    { id: 'christmas', name: 'Christmas'},
    { id: 'city', name: 'City'},
    { id: 'farm', name: 'Farm'},
    { id: 'generic', name: 'Generic'},
    { id: 'halloween', name: 'Halloween'},
    { id: 'mall', name: 'Mall'},
    { id: 'sky', name: 'Sky'},
    { id: 'suburb', name: 'Suburb'}
  ];
  $scope.selectedThemes = [];
  $scope.skinClassDialogIsDisplayed = undefined;

  $scope.dragOver = function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.dragEnter = function(event) {
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.dragLeave = function(event) {
    event.dataTransfer.dropEffect = 'copy';
  }

  $scope.importSvg = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.skinClass = null;
    $scope.skinClassDialogIsDisplayed = true;
    $scope.importedFile = event.dataTransfer.files[0];
    $scope.$apply();
  }

  $scope.addSvgToView = function(skinClass) {
    $scope.skinClassDialogIsDisplayed = false;
    $scope.$broadcast("importSvg", {
      'skinClass': skinClass,
      'file': $scope.importedFile
    });
  }
});

var Beard = {};

Beard.armature = {
  class: 'Beard',
  id: 'beard'
}

var Body = {};

Body.armature = {
  class: 'Body',
  id: 'body',
  headPosition: { x: -4, y: -102 },
  frontArmPosition: { x: -30.4, y: -28.8},
  rearArmPosition: { x: 23.7, y: -32},
  frontLegPosition: { x: -22.9, y: 42.2},
  rearLegPosition: { x: 20.9, y: 41.7},
  imageUrl: 'body.svg',
  offset: { x: 40, y: 50 }
}

Body.getPosition = function() {
  return {
    x: 0,
    y: 0
  };
}

var Eyebrows = {};

Eyebrows.armature = {
  class: 'Eyebrows',
  id: 'eyebrows'
}

var Eyes = {};

Eyes.armature = {
  class: 'Eyes',
  id: 'eyes'
}

var FrontArm = {};

FrontArm.armature = {
  class: 'FrontArm',
  id: 'frontarm',
  imageUrl: 'arm.svg',
  handPosition: { x: 51.2, y: -0.1 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.6
}

FrontArm.getPosition = function() {
  return Body.armature.frontArmPosition;
}

var FrontLeg = {};

FrontLeg.armature = {
  class: 'FrontLeg',
  id: 'frontleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.52
}

FrontLeg.getPosition = function() {
  return Body.armature.frontLegPosition;
}

var Hair = {};

Hair.armature = {
  class: 'Hair',
  id: 'hair'
}

Hair.getPosition = function() {
  return Body.armature.headPosition;
}

var HairBehind = {};

HairBehind.armature = {
  class: 'HairBehind',
  id: 'hairbehind'
}

var Head = {};

Head.armature = {
  class: 'Head',
  id: 'head',
  imageUrl: 'head.svg',
  offset: { x: 76, y: 67 }
}

Head.getPosition = function() {
  return Body.armature.headPosition;
}

var Mouth = {};

Mouth.armature = {
  class: 'Mouth',
  id: 'mouth'
}

var Nose = {};

Nose.armature = {
  class: 'Nose',
  id: 'nose'
}

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

var RearLeg = {};

RearLeg.armature = {
  class: 'RearLeg',
  id: 'rearleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.5
}

RearLeg.getPosition = function() {
  return Body.armature.rearLegPosition;
}

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

Skin.hitTest = function(person, skin, pt) {
  var bounds = Skin.getBoundingBox(skin, person.position);
  if (bounds && MathUtil.isPointInsideBox(pt, bounds)) {
    return true;
  }
  return false;
}

Skin.getBoundingBox = function(skin, personPosition) {
  if (window[skin.class] && window[skin.class].getPosition) {
    var relativePos = window[skin.class].getPosition();
    var pos = MathUtil.addPoints(personPosition, relativePos);
    return {
      x: pos.x - skin.offset.x,
      y: pos.y - skin.offset.y,
      width: skin.size.width,
      height: skin.size.height
    }
  }
  return null;
}

Skin.move = function(skin, vector) {
  skin.offset = MathUtil.subtractPoints(skin.offset, vector);
}

app.directive("skinClassDialog", function() {
  return {
    restrict: 'E',
    scope: {
      onChoose: '='
    },
    templateUrl: 'js/directives/skin-class-dialog/skin-class-dialog.html',
    link: function($scope, $element, $attrs) {
      $scope.skinClass = 'Body';
      $scope.skinClasses = Person.getComposition().slice(0).sort(function(a, b) {
        if (a.z == b.z) {
          return 0;
        }
        return a.z > b.z ? -1 : 1;
      })
    }
  }
});
