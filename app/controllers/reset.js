angular.module('MyApp')
  .controller('ResetCtrl', function($scope, Account, $routeParams) {
    $scope.resetPassword = function() {
      $scope.user.token = $routeParams.token;
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  });
