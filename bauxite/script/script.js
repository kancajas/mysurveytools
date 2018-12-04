var myApp = angular.module('myApp', ['ngAnimate']);


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
    var masterLink = "5bf9e8b7484e637664004b60";//"5bdd1089baccb064c0c0e0cb";
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

myApp.factory('JobHandler', function ($http, $window,$log) {
    var rootLink = "https://api.jsonbin.io/b/";
    var colId = "5bdd0f66716f9364f8d1278b";
    var sKey = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
    //var jobNo = null;
    //var data = {};
   
    return {
        pullData: function (jobKey) {
            var req = {
                method: "GET",
                url: rootLink + jobKey + "/latest",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "secret-key": sKey
                }
            }
            return $http(req).then(successCallback, errorCallback);
        },
        pushData: function (jobKey,recordCol) {
            var jobLink = rootLink + jobKey;
            var req = {
                method: "PUT",
                data: angular.toJson(recordCol),
                url: jobLink,
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": sKey
                }
            }
            return $http(req).then(successCallback, errorCallback);
        },
        createData: function (recordCol) {
            var jobLink = rootLink + jobKey;
            var req = {
                method: "PUT",
                data: angular.toJson(recordCol),
                url: jobLink,
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": sKey
                }
            }
            return $http(req).then(successCallback, errorCallback);
        }


    };

    function successCallback(response) {
        return response;
    }

    function errorCallback(response) {
        $window.alert("Something went wrong! It's FUBAR..");
        return response;
    }

 

});




myApp.directive('contenteditable', ['$sce', function($sce) {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model
  
        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
        };
  
        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$evalAsync(read);
        });
        read(); // initialize
  
        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if ( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  }]);


// myApp.factory('JobHandler', function ($http) {
//     var rootLink = "https://api.jsonbin.io/b/";
//     var masterLink = "5bdd1089baccb064c0c0e0cb";
//     var colId = "5bdd0f66716f9364f8d1278b";
//     var rowId = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
//     var data = {};
   
//     return {
//         getData: function (job) {
//             var jobNo = job;
//             var req = {
//                 method: "GET",
//                 url: rootLink  + jobNo + "/latest",
//                 headers: {
//                     "Content-Type": "application/json; charset=utf-8",
//                     "secret-key": rowId
//                 }
//             }
//             $http(req).then(function successCallback(response) {
        
//                 data = response;
//             }, function errorCallback(response) {
//                 data = response.statusText;
//             });
//             return data;
//         }
//     };
// });

myApp.controller('myCtrl', function ($scope, $window, $http, $filter, $log, MasterLoader, JobHandler) {
    $scope.key = null;
    $scope.record = {};
    $scope.masterArray = [];
    $scope.recordCol = [];
    $scope.jobLoaded = false;
    $scope.hidder = new Array(20).fill(true);
    $scope.editMode = true;

    $scope.jobItem = function() {
        this.Booking = "SHIT";
        this.Records = [{Booking:"ERERER"}];
        
     };
     
    //initial load of masterlist
    MasterLoader.getData().then(function(response){
        $scope.masterArray = response.data;
       // $log.info($scope.masterArray);      
    });

    //load job on button press
    $scope.loadJob = function(jobNo){
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
        $log.info("Loading: "+ obj.jobno + " " + obj.key);
        if (obj !== undefined){
            JobHandler.pullData(obj.key).then(function(response){ 
                if (response.data.success === false){
                    $window.alert("Opps: " + response.message);
                }else{
                    $scope.recordCol = response.data;     
                    $scope.recordCol["Datetime"] = $scope.convertDate($scope.recordCol["Datetime"]);
                    $scope.jobLoaded = true;
                    $log.info("Success: " + $scope.recordCol); 
                }
            });           
        }
    };

    $scope.saveJob = function(){
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
        $log.info("Saving: "+ obj.jobno + " " + obj.key);
        if (obj !== undefined){
            JobHandler.pushData(obj.key,$scope.recordCol).then(function(response){ 
                if (!response.data.success){
                    $window.alert("Opps: " + response.message);
                }else{
                    $log.info("Success: " + $scope.recordCol); 
                }
            });           
        }
    };

    $scope.newJob = function () {
        //check validity of jobno
        //check if existing in masterArray
        //if existing, load instead
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
        if (obj === undefined){
            $scope.recordCol.Records = [];
            $scope.addItem();
            $scope.jobLoaded = true;
        }
    };

    $scope.closeJob = function () {
        $scope.recordCol = angular.copy({},$scope.master);
        var today = new Date();
        today.setSeconds(0,0);
        $scope.recordCol["Datetime"] = today;
        $scope.key = null;
        $scope.jobLoaded = false;
    };

    $scope.addItem = function() {

        // $scope.recordCol = {
        //     "Description": "J013763",
        //     "Paratwo": "",
        //     "Paraone": "Archived Files",
        //     "Record": 18,
        //     "Gallery": "",
        //     "Vessel": "PHOENIX LEADER",
        //     "Voynum": "13",
        //     "Surveyloc": "Berth 12, North Quay, Fremantle",
        //     "Datetime": "2018-11-03T12:05:00.000Z",
        //     "Jobno": "J013763",
        //     "Records": [
        //       {
        //         "Completed": false,
        //         "Comments": "Test This Test Test Test!!! Yep! Yep!",
        //         "Exceptions": "Nil",
        //         "Weight": "33.910",
        //         "Cubic": "154.72",
        //         "Height": "3.9",
        //         "Width": "3.42",
        //         "Length": "11.6",
        //         "Condition": "Used",
        //         "Unit": "Tracked excavator cat 336D (to be re-measured on board)",
        //         "Booking": "E002103430 (1) x"
        //       }
        //     ]
        //   };


      
        $scope.recordCol.Records.push({});
        $log.info($scope.recordCol);
    }


    $scope.getToday = function () {
        var d = new Date();
        var hr;
        var min;
        var today = d.toISOString().substr(0, 10);
        if (d.getHours() < 10) {
            hr = "0" + d.getHours();
        } else {
            hr = d.getHours();
        }
        if (d.getMinutes() < 10) {
            min = "0" + d.getMinutes();
        } else {
            min = d.getMinutes();
        }
        return today + "T" + hr + ":" + min;
    };
    


    $scope.convertDate = function(dateString){
        var s = dateString;
        var b = s.split(/\D+/);
        return new Date(b[0], --b[1], b[2], b[3], b[4], b[5]||0, b[6]||0);
    };


    $scope.handleHide = function (index) {     
        $scope.hidder[index] = !$scope.hidder[index];
    }

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





