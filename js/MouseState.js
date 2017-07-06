app.service("MouseState", function() {
  var MouseState = {
    draggedLayer: null,
    lastDownPoint: {
      x: 0,
      y: 0
    },
    lastMovePoint: {
      x: 0,
      y: 0
    }
  };

  return MouseState;
});
