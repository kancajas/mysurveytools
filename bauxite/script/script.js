var myApp = angular.module('myApp', []);


// myApp.factory('JsonBinServer', function($resource){
//     var rootLink = "https://api.jsonbin.io/b/";
//     var masterLink = "5bdd1089baccb064c0c0e0cb";
//     var colId = "5bdd0f66716f9364f8d1278b";
//     var rowId = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
//     var data = {};
//     var req = {
//         method: "GET",
//         url: rootLink + masterLink + "/latest",
//         headers: {
//             "Content-Type": "application/json; charset=utf-8",
//             "secret-key": rowId
//         }
//     }
//     var queryString = rootLink + ":jobNo"+"/latest";
//     return $resource(queryString,{jobNo: "@jobNo"});

// });

myApp.factory('MasterLoader', function ($http) {
    var rootLink = "https://api.jsonbin.io/b/";
    var masterLink = "5bf954aa82eab4765e812b80";//"5bdd1089baccb064c0c0e0cb";
    //var colId = "5bdd0f66716f9364f8d1278b";
    var skey = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
    //var data = {};
    var req = {
        method: "GET",
        url: rootLink + masterLink + "/latest",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "secret-key": skey
        }
    }
    return {
        getData: function () {
            return $http(req);
        }
    };
});

myApp.factory('JobLoader', function ($http) {
    var rootLink = "https://api.jsonbin.io/b/";
    var masterLink = "5bdd1089baccb064c0c0e0cb";
    var colId = "5bdd0f66716f9364f8d1278b";
    var rowId = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
    var data = {};
   
    return {
        getData: function (job) {
            var jobNo = job;
            var req = {
                method: "GET",
                url: rootLink  + jobNo + "/latest",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "secret-key": rowId
                }
            }
            $http(req).then(function successCallback(response) {
        
                data = response;
            }, function errorCallback(response) {
                data = response.statusText;
            });
            return data;
        }
    };
});

myApp.controller('myCtrl', function ($scope, $window, $http, $log, MasterLoader, JobLoader) {
    $scope.key = null;
    $scope.record = {};
    $scope.masterArray = [];
    $scope.recordCol = [];
    $scope.jobLoaded = false;

    //initial load of masterlist
    MasterLoader.getData().then(function(response){
        $scope.masterArray = response.data;

        //TODO: populate jobno dropdown


        $log.info($scope.masterArray);      
    });

    $scope.loadJob = function(jobNo){
        $window.alert($scope.masterArray['J013763']);
        //$scope.record = JobLoader.getData(jobNo);
        //$log.info(JobLoader.getData(jobNo));
    }

    $scope.newJob = function () {

    };


    //$http.get("customers.php")
    //.then(function (response) {$scope.names = response.data.records;});
});






function handleAccordion(e, id) {
    e.stopPropagation();
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}





