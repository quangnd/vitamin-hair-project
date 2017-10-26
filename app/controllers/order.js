angular.module('MyApp')
.controller('OrderCtrl', function($scope, $rootScope, $location, $window, $auth) {
  $scope.user = $rootScope.currentUser;
});
