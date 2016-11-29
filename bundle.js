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

var Person = {};

Person.composition = [
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

Person.create = function() {
  return {
    composition: Person.composition
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

Person.calculateComponentPoint = function(component, scale) {
  var pos = {
    x: 0,
    y: 0
  };
  if (component.armature.offset) {
    pos.x = -component.armature.offset.x * scale;
    pos.y = -component.armature.offset.y * scale;
  }
  return pos;
}

Person.renderComponentSkin = function(ctx, component, skin, position, scale) {
  var pt = Person.calculateComponentPoint(component, scale);
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
    width: parseFloat(svgElement.getAttribute('width')) || svgElement.getAttribute('viewBox').split(' ')[2],
    height: parseFloat(svgElement.getAttribute('height')) || svgElement.getAttribute('viewBox').split(' ')[3]
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
      var basePerson = Person.createBaseSkin();

      function animate(elapsedTime) {
        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };
        return true;
      }

      function render(htmlCanvas) {
        var ctx = htmlCanvas.getContext("2d");

        var canvasSize = {
          width: ani.getWidth(),
          height: ani.getHeight()
        };

        var xscale = canvasSize.width / viewSize.width;
        var yscale = canvasSize.height / viewSize.height;
        var scale = Math.min(xscale, yscale);

        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        Person.render(ctx, basePerson, canvasSize, scale);
      }

      $scope.$on("importSvg", function($event, data) {
        var reader = new FileReader();
        reader.onload = function () {
          $scope.createSkin(data.skinClass, reader.result);
        };
        reader.readAsDataURL(data.file);
      });

      $scope.createSkin = function(skinClass, data) {
        console.log(skinClass, data);
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

var Body = {};

Body.armature = {
  id: 'body',
  headPosition: { x: -4, y: -102 },
  frontArmPosition: { x: -30.4, y: -28.8},
  rearArmPosition: { x: 23.7, y: -32},
  frontLegPosition: { x: -22.9, y: 42.2},
  rearLegPosition: { x: 20.9, y: 41.7},
  imageUrl: 'body.svg',
  offset: { x: 40, y: 50 }
}

Body.getPosition = function(startPt, scale) {
  return startPt;
}

var Eyebrows = {};

var Eyes = {};

var FrontArm = {};

FrontArm.armature = {
  id: 'frontarm',
  imageUrl: 'arm.svg',
  handPosition: { x: 51.2, y: -0.1 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.6
}

FrontArm.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.frontArmPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}

var FrontLeg = {};

FrontLeg.armature = {
  id: 'frontleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.52
}

FrontLeg.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.frontLegPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}

var Hair = {};

var HairBehind = {};

var Head = {};

Head.armature = {
  id: 'head',
  imageUrl: 'head.svg',
  offset: { x: 76, y: 67 }
}

Head.getPosition = function(startPt, scale) {
  var scaledHeadPosition = MathUtil.scalePoint(Body.armature.headPosition, scale);
  return MathUtil.addPoints(startPt, scaledHeadPosition);
}

var Mouth = {};

var Nose = {};

var RearArm = {};

RearArm.armature = {
  id: 'reararm',
  imageUrl: 'arm.svg',
  handPosition: { x: 51.2, y: -0.1 },
  offset: { x: 14.7, y: 15.1 },
  rotation: Math.PI * 0.32
}

RearArm.getPosition = function(startPt, scale) {
  var scaledRearArmPosition = MathUtil.scalePoint(Body.armature.rearArmPosition, scale);
  return MathUtil.addPoints(startPt, scaledRearArmPosition);
}

var RearLeg = {};

RearLeg.armature = {
  id: 'rearleg',
  imageUrl: 'leg.svg',
  footPosition: { x: 45.7, y: 0 },
  offset: { x: 12.1, y: 32.2 },
  rotation: Math.PI * 0.5
}

RearLeg.getPosition = function(startPt, scale) {
  var scaledPosition = MathUtil.scalePoint(Body.armature.rearLegPosition, scale);
  return MathUtil.addPoints(startPt, scaledPosition);
}

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
  });

  return skin;
}

Skin.createBaseSkin = function(skinClass) {
  var skin = Skin.importSvg(skinClass);
  return skin;
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
      $scope.skinClasses = Person.composition.slice(0).sort(function(a, b) {
        if (a.z == b.z) {
          return 0;
        }
        return a.z > b.z ? -1 : 1;
      })
    }
  }
});
