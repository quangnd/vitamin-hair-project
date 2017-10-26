angular.module('MyApp')
  .controller('HeaderCtrl', function($scope, $location, $window, $auth, $rootScope) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      delete $rootScope.currentUser;
      $location.path('/');
    };
  });
