angular.module('MyApp', ['ngRoute', 'satellizer', 'angular-loading-bar'])
  .config(function ($routeProvider, $locationProvider, $authProvider) {
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
        controller: 'OrderCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/try-product', {
        templateUrl: 'partials/orders/tryProduct.html',
        controller: 'TryProductCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
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
  })
  .run(function ($rootScope, $window) {
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
  });
