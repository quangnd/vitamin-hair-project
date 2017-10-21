angular.module('MyApp')
.factory('CommonUI', function($location) {
  return {
    isLoginPage: function() {
      return $location.path() === '/login';
    }
  };
});
