angular.module('MyApp')
.controller('MapCtrl', function($scope, NgMap) {
  $scope.googleMapsUrl = 'http://maps.google.com/maps/api/js?key=AIzaSyARWC-K1F2vMynM-x6LjIDm-wsa4jwoPi0';
  //hanoi: [21.0278, 105.8342]
  NgMap.getMap().then(function(map) {
    // console.log(map.getCenter());
    // console.log('markers', map.markers);
    // console.log('shapes', map.shapes);
  });
});
