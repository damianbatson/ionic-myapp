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

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('login', {
    url: "/login",
    // views: {
      // 'menuContent': {
        templateUrl: "templates/login.html",
        controller: 'LoginController'
      // }
    // }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileController'
      }
    }
  })
    .state('app.todo', {
      url: "/todo",
      views: {
        'menuContent': {
          templateUrl: "templates/todo.html",
          controller: 'TodoController'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

exampleapp.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal

});

exampleapp.controller("LoginController", function($scope, $firebaseAuth, $location, $ionicPopup, $state) {
 
    $scope.login = function(username, password) {
      fb = new Firebase('https://prototype-firebase.firebaseio.com/');
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go('app.profile');
            $location.path("/todo");
        }).catch(function(error) {
            console.error("Login Failed!", error);
            // $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: error
            });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 // };
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
            console.error("Registration Failed ", error);
                        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: error
            });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
        });
    }
 
});

exampleapp.controller('ProfileController', function($scope, $firebase, $firebaseAuth, $ionicPopup, $location){

$scope.profileList = function() {
  fb = new Firebase('https://prototype-firebase.firebaseio.com/');
  fbAuth = fb.getAuth();
    // $firebaseAuth.$getAuth();
    if(fbAuth) {
      // fb = new Firebase('https://prototype-firebase.firebaseio.com/');
        // var fbAuth = $firebaseAuth(fb);
        var sync = $firebase(fb.child("users/" + fbAuth.uid));
        var syncObject = sync.$asObject(["users", fbAuth.uid]);
        syncObject .$bindTo($scope, "data");

        // var sync = $firebase(fb.child("messages/" + fbAuth.uid));
        // var messagesArray = sync.$asArray(["users", fbAuth.uid]);
        // $scope.messages = messagesArray;
    }
}
});

exampleapp.controller('TodoController', function($scope, $firebase, $firebaseAuth, $ionicModal, $location) {
 
$scope.workoutList = function() {
  fb = new Firebase('https://prototype-firebase.firebaseio.com/');
  fbAuth = fb.getAuth();
    // $firebaseAuth.$getAuth();
    if(fbAuth) {
      // fb = new Firebase('https://prototype-firebase.firebaseio.com/');
        // var fbAuth = $firebaseAuth(fb);
        // var sync = $firebase(fb.child("users/" + fbAuth.uid));
        // var syncObject = sync.$asObject(["users", fbAuth.uid]);
        // syncObject .$bindTo($scope, "data");

        var sync = $firebase(fb.child("messages/" + fbAuth.uid));
        var messagesArray = sync.$asArray(["users", fbAuth.uid]);
        $scope.messages = messagesArray;
    }
}

$ionicModal.fromTemplateUrl('templates/search.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function (modal) {
  $scope.modal = modal;
});

// function to open the modal
$scope.openModal = function () {
  $scope.modal.show();
};

// function to close the modal
$scope.closeModal = function () {
  $scope.modal.hide();
};

//Cleanup the modal when we're done with it!
$scope.$on('$destroy', function () {
  $scope.modal.remove();
});
 
$scope.create = function(exer, exer01) {
    // $ionicPopup.show({
    //   templateUrl: 'templates/search.html',
    //   // title: 'Enter Wi-Fi Password',
    //   scope: $scope,
    //   title: 'Enter a new TODO item',
    //   // inputType: 'text',
    //   // inputType2: 'exer01'
    //   buttons: [
    //           { text: 'Cancel', onTap: function(e) { return true; } },
    //           {
    //             text: '<b>Save</b>',
    //             type: 'button-positive',
    //             onTap: function(e) {
    //               return $scope.messages.exer;
    //               return $scope.messages.exer01;
    //             }
    //           },
    //         ]
        
    // })
    // .then(function(exer, exer01) {

        $scope.messages.$add({exer:exer, exer01:exer01});

        // data.newItem = '';
        exer = '';
        exer01 = '';
        $scope.closeModal();
        // if(result !== "") {
        //     if($scope.data.hasOwnProperty("messages/"+fbAuth.uid) !== true) { 
        //         $scope.data.messages = [];
        //     }
        //     $scope.data.messages.push({text: result, exer01: result});
        // } else {
        //     console.log("Action not completed");
        // }
    // });
}

$scope.logout = function(){
    // var sync = $firebase(fb.child("messages/" + fbAuth.uid));
    // var data = sync.$asObject(["messages", fbAuth.uid]);
    // $scope.data.$destroy();
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$unauth();
    $location.path("/login");
    // });
}

 
});