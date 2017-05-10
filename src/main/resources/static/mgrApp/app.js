/**
 * Created by Marcin on 02.12.2016.
 */
var phonesApp = angular.module('mgrApp', ['ngRoute',
    'ngResource',
    'ui.bootstrap',
    'rzModule',
    'ngStorage',
    'angularUtils.directives.dirPagination',
    'chart.js',
    '720kb.tooltips'
]);


phonesApp.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainController'
        })
        .when('/about', {
            templateUrl: 'views/main/about.html',
            controller: 'AboutController'
        })
        .when('/test', {
            templateUrl: 'views/second/test.html',
            controller: 'SecondController'
        })
        .otherwise({redirectTo: '/'});
});

