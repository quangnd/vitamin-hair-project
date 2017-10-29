angular.module('MyApp')
  .controller('OrderCtrl', function ($scope, $rootScope, $location, $window, $auth, Order, Account) {
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
  });
