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

myApp.factory('JobLoader', function ($http) {
    var rootLink = "https://api.jsonbin.io/b/";
    var colId = "5bdd0f66716f9364f8d1278b";
    var skey = "$2a$10$7AroDmsNI57xWxJ1o.1fUeb0vWv.D7.ySLUXtDQPrEcVpQ3hfRgc6";
    //var jobNo = null;
    //var data = {};
   
    return {
        getData: function (jobno) {
            var req = {
                method: "GET",
                url: rootLink  + jobno + "/latest",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "secret-key": skey
                }
            }
            return $http(req);
        }
    };
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


// myApp.factory('JobLoader', function ($http) {
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

myApp.controller('myCtrl', function ($scope, $window, $http, $filter, $log, MasterLoader, JobLoader) {
    $scope.key = null;
    $scope.record = {};
    $scope.masterArray = [];
    $scope.recordCol = [];
    $scope.jobLoaded = false;
    $scope.hidder = new Array(20).fill(true);
    $scope.editMode = true;

    //initial load of masterlist
    MasterLoader.getData().then(function(response){
        $scope.masterArray = response.data;
       // $log.info($scope.masterArray);      
    });

    //load job on button press
    $scope.loadJob = function(jobNo){
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
        $log.info(obj);
        if (obj !== undefined){
            JobLoader.getData(obj.key).then(function(response){
                
                $scope.recordCol = response.data;     
                $scope.recordCol["Datetime"] = $scope.convertDate($scope.recordCol["Datetime"]);
                $log.info($scope.recordCol);           
                $scope.jobLoaded = true;
            });           
        }
    };

    $scope.newJob = function () {

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





