'use strict';
var mainLogin = angular.module('login', ['ngFacebook']);

mainLogin.config(['$facebookProvider', function ($facebookProvider) {
    $facebookProvider.setAppId('758110410904505').setPermissions(['email', 'user_friends']);
}]);

mainLogin.run(['$rootScope', '$window', function ($rootScope, $window) {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    $rootScope.$on('fb.load', function () {
        $window.dispatchEvent(new Event('fb.load'));
    });
}]);

mainLogin.controller('mainLogin', ['$scope', '$facebook', function ($scope, $facebook) {

    $scope.loginTxt = "LOGIN";
    $scope.facebookTxt = "Facebook";
    $scope.twitterTxt = "Twitter";
    $scope.googlePlusTxt = "Google Plus";

    $scope.$on('fb.auth.authResponseChange', function () {
        $scope.status = $facebook.isConnected();
        if ($scope.status) {
            $facebook.api('/me').then(function (user) {
                $scope.user = user;
                console.log("login " + $scope.user);
            });
        }
    });

    $scope.login = function () {
        if ($scope.status) {
            $facebook.logout();
        } else {
            $facebook.login();
        }
    };

    $scope.getFriends = function () {
        if (!$scope.status) return;
        $facebook.cachedApi('/me/friends').then(function (friends) {
            $scope.friends = friends.data;
        });
    };
}]);