app.service("SVGUtil", function() {
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

  return SVGUtil;
});
