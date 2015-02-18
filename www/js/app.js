// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var exampleapp = angular.module('starter', ['ionic', 'firebase']);
var fb = null;

exampleapp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    fb = new Firebase('https://prototype-firebase.firebaseio.com/');
  });
});

exampleapp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('todo', {
        url: '/todo',
        templateUrl: 'templates/todo.html',
        controller: 'TodoController'
    });
    $urlRouterProvider.otherwise('/login');
});

exampleapp.controller("LoginController", function($scope, $firebaseAuth, $location) {
 
    $scope.login = function(username, password) {
      fb = new Firebase('https://prototype-firebase.firebaseio.com/');
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.log("Login Failed!", error);
        });
    }
 
    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser(username, password).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $location.path("/todo");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }
 
});

exampleapp.controller('TodoController', function($scope, $firebase, $firebaseAuth, $ionicPopup) {
 
$scope.list = function() {
  fb = new Firebase('https://prototype-firebase.firebaseio.com/');
  fbAuth = fb.getAuth();
    // $firebaseAuth.$getAuth();
    if(fbAuth) {
      // fb = new Firebase('https://prototype-firebase.firebaseio.com/');
        // var fbAuth = $firebaseAuth(fb);
        var sync = $firebase(fb.child("messages/" + fbAuth.uid));
        var syncObject  = sync.$asObject();
        syncObject .$bindTo($scope, "data");

        // var sync = $firebase(fb.child("messages/" + fbAuth.uid));
        // var messagesArray = sync.$asArray();
        // $scope.messages = messagesArray;
    }
}
 
$scope.create = function() {
    $ionicPopup.prompt({
        title: 'Enter a new TODO item',
        inputType: 'text',
        inputType2: 'exer01'
    })
    .then(function(result) {
        if(result !== "") {
            if($scope.data.hasOwnProperty("messages/"+fbAuth.uid) !== true) { 
                $scope.data.messages = [];
            }
            $scope.data.messages.push({text: result, exer01: result});
        } else {
            console.log("Action not completed");
        }
    });
}

 
});