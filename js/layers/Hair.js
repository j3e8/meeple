app.service("Hair", ["Body", function(Body) {
  var Hair = {};

  Hair.armature = {
    class: 'Hair',
    id: 'hair'
  }

  return Hair;
}]);
