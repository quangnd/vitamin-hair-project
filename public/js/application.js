angular.module('MyApp', ['ngRoute', 'satellizer', 'angular-loading-bar', 'ngMap'])
  .config(["$routeProvider", "$locationProvider", "$authProvider", function ($routeProvider, $locationProvider, $authProvider) {
    skipIfAuthenticated.$inject = ["$location", "$auth"];
    loginRequired.$inject = ["$location", "$auth"];
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/order', {
        templateUrl: 'partials/orders/order.html',
        controller: 'OrderCtrl'
      })
      .when('/try-product', {
        templateUrl: 'partials/orders/tryProduct.html',
        controller: 'TryProductCtrl'
      })
      .when('/map', {
        templateUrl: 'partials/maps.html',
        controller: 'MapCtrl'
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: '/auth/facebook',
      clientId: '527095360961951',
      redirectUri: 'https://vh-web.herokuapp.com/auth/facebook/callback'
    });
    $authProvider.google({
      url: '/auth/google',
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(["$rootScope", "$window", function ($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
      $rootScope.isHide = false;
      var originPath = current.$$route.originalPath;
      if (originPath === '/login'
        || originPath === '/forgot'
        || originPath === '/order'
        || originPath === '/signup'
        || originPath === '/try-product'
        || originPath === '/reset/:token') {
        $rootScope.isHide = true;
      }

      $rootScope.isOrderPage = false;
      if (originPath === '/order' || originPath === '/try-product') {
        $rootScope.isOrderPage = true;
      }
    });
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact ) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
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
    };
  }]);

angular.module('MyApp')
.controller('FooterCtrl', ["$scope", "CommonUI", function($scope, CommonUI) {

}]);

angular.module('MyApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
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
    };
  }]);

angular.module('MyApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", "$rootScope", function($scope, $location, $window, $auth, $rootScope) {
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
  }]);

angular.module('MyApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);

angular.module('MyApp')
.controller('MapCtrl', ["$scope", "NgMap", function($scope, NgMap) {
  $scope.googleMapsUrl = 'http://maps.google.com/maps/api/js?key=AIzaSyARWC-K1F2vMynM-x6LjIDm-wsa4jwoPi0';
  //hanoi: [21.0278, 105.8342]
  NgMap.getMap().then(function(map) {
    // console.log(map.getCenter());
    // console.log('markers', map.markers);
    // console.log('shapes', map.shapes);
  });
}]);

angular.module('MyApp')
  .controller('OrderCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Order", "Account", function ($scope, $rootScope, $location, $window, $auth, Order, Account) {
    $scope.user = $rootScope.currentUser;
    $scope.newUser = {};
    $scope.newUser.gender = 'male';
    $scope.inProcessing = false;
    $scope.cities = [
      { name: "Ha Noi", id: 1 },
      { name: "TP HCM", id: 2 },
      { name: "Other", id: 999 }
    ];
    var districtList = [
      { city: "Ha Noi", name: "Hai Ba Trung", id: 1 },
      { city: "Ha Noi", name: "Ba Dinh", id: 2 },
      { city: "Ha Noi", name: "Hoan Kiem", id: 3 },
      { city: "TP HCM", name: "Quan 1", id: 4 },
      { city: "TP HCM", name: "Quan 2", id: 5 },
      { city: "TP HCM", name: "Quan 5", id: 6 },
      { city: "Other", name: "Other District", id: 7 }
    ];
    $scope.districts = angular.copy(districtList);

    $scope.selectedCity = $scope.cities[0];
    $scope.selectedDistrict = $scope.districts.filter(function (district) {
      return district.city === $scope.selectedCity.name
    })[0];

    $scope.getDistricts = function (selectedCity) {
      $scope.districts = districtList.filter(function (district) {
        return district.city === selectedCity.name
      });
      $scope.selectedDistrict = $scope.districts[0];
    }

    $scope.createOrder = function () {
      $scope.inProcessing = true;
      if ($scope.user) {
        var data = {
          user_id: $scope.user.id,
          address: {
            district: $scope.selectedDistrict.name,
            city: $scope.selectedCity.name,
            address: $scope.orderAddress,
            note: $scope.orderNote
          },
          product_list: [
            {
              product_id: 1,
              quality: 1
            }
          ]
        }
        Order.createOrder(data)
          .then(function (response) {
            $scope.messages = {
              success: [response.data]
            };
            $scope.inProcessing = false;
          })
          .catch(function (response) {
            $scope.messages = {
              error: Array.isArray(response.data) ? response.data : [response.data]
            };
            $scope.inProcessing = false;
          });
      } else {
        //Register new user and order
        $auth.signup($scope.newUser)
          .then(function (response) {
            $auth.setToken(response);
            $rootScope.currentUser = response.data.user;
            $window.localStorage.user = JSON.stringify(response.data.user);

            var data = {
              user_id: $rootScope.currentUser.id,
              address: {
                district: $scope.selectedDistrict.name,
                city: $scope.selectedCity.name,
                address: $scope.orderAddress,
                note: $scope.orderNote
              },
              product_list: [
                {
                  product_id: 1,
                  quality: 1
                }
              ]
            }
            Order.createOrder(data)
              .then(function (response) {
                $scope.messages = {
                  success: [response.data]
                };
                $scope.inProcessing = false;
              })
              .catch(function (response) {
                $scope.messages = {
                  error: Array.isArray(response.data) ? response.data : [response.data]
                };
                $scope.inProcessing = false;
              });
          })
          .catch(function (response) {
            $scope.messages = {
              error: Array.isArray(response.data) ? response.data : [response.data]
            };
            $scope.inProcessing = false;
          });
      }
    }

    $scope.checkUserIdentity = function (emailOrPhone) {
      if (emailOrPhone === 'phone' && $scope.newUser.phone_number !== undefined && $scope.newUser.phone_number.length >= 10) {
        getUserIdentify('phone');
      } else {
        getUserIdentify('email');
      }
    }

    function getUserIdentify(emailOrPhone) {
      var userData = emailOrPhone === 'phone' ? $scope.newUser.phone_number : $scope.newUser.email
      Account.checkUserIdentify({ username: userData })
        .then(function (response) {
          if (response.data.isFound) {
            switch (emailOrPhone) {
              case 'email':
                $scope.emailExisted = true;
                break;
              case 'phone':
                $scope.phoneExisted = true;
                break;
            }
          } else {
            $scope.emailExisted = false;
            $scope.phoneExisted = false;
          }
        })
    }
  }]);

angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
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
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ["$scope", "Account", "$routeParams", function($scope, Account, $routeParams) {
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
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);

angular.module('MyApp')
.controller('TryProductCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
  $scope.login = function() {
    $auth.login($scope.user)
      .then(function(response) {
        $rootScope.currentUser = response.data.user;
        $window.localStorage.user = JSON.stringify(response.data.user);
        $location.path('/order');
      })
      .catch(function(response) {
        $scope.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
  };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function(response) {
        $rootScope.currentUser = response.data.user;
        $window.localStorage.user = JSON.stringify(response.data.user);
        $location.path('/order');
      })
      .catch(function(response) {
        if (response.error) {
          $scope.messages = {
            error: [{ msg: response.error }]
          };
        } else if (response.data) {
          $scope.messages = {
            error: [response.data]
          };
        }
      });
  };
}]);

angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      },
      checkUserIdentify: function(data) {
        return $http.post('/checkUserIdentify', data);
      }
    };
  }]);

angular.module('MyApp')
.factory('CommonUI', ["$location", function($location) {
  return {
    isLoginPage: function() {
      return $location.path() === '/login';
    }
  };
}]);

angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
angular.module('MyApp')
.factory('Order', ["$http", function($http) {
  return {
    createOrder: function(data) {
      return $http.post('/api/order', data);
    }
  };
}]);
