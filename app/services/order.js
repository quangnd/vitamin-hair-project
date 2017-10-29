angular.module('MyApp')
.factory('Order', function($http) {
  return {
    createOrder: function(data) {
      return $http.post('/api/order', data);
    }
  };
});
