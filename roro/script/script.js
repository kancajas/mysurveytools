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
        pullData: function () {
            return $http(req);
        },
        pushData: function (masterCol) {
            var jobLink = rootLink + masterLink;
            var req = {
                method: "PUT",
                data: angular.toJson(masterCol),
                url: jobLink,
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": skey
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

myApp.factory('JobHandler', function ($http, $window, $log) {
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
           // var jobLink = rootLink + jobKey;
          // console.log(angular.toJson(recordCol));
            var req = {
                method: "POST",
                data: angular.toJson(recordCol),
                url: rootLink,
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": sKey,
                    "name":recordCol["Jobno"]
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


myApp.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            // see where the cursor is before the update so that we can set it back
            var selection = element[0].selectionStart;
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
            // set back the cursor after rendering
            element[0].selectionStart = selection;
            element[0].selectionEnd = selection;
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
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
    $scope.error=null;
    $scope.key = "";
    $scope.record = {};
    $scope.masterArray = [];
    $scope.recordCol = {};
    $scope.jobLoaded = false;
    $scope.hidder = new Array(20).fill(true);
    $scope.editMode = true;
    $scope.loader = false;
    $scope.validJobNo = /^[J]{1}[0-9]{3,6}$/i;

    class Job {
        constructor(obj){
            this.Jobno = "";
            this.Datetime = "";
            this.Description = "";
            this.Surveyloc = "";
            this.Voynum = "";
            this.Vessel = "";
            this.Gallery = "";
            this.Record = "";
            this.Paraone = "";
            this.Paratwo = "";
            this.Records = [];
            for (var prop in obj){
                if (this.hasOwnProperty(prop)) 
                    {
                        this[prop] = obj[prop];
                    }
            } 

        }
    }

    class Record {
        constructor(obj){
            this.Booking = "";
            this.Unit = "";
            this.Condition = "";
            this.Length = "";
            this.Width = "";
            this.Height = "";
            this.Cubic = "";
            this.Weight = "";
            this.Exceptions = "";
            this.Comments = "";
            this.Completed = false;
            for (var prop in obj){
                if (this.hasOwnProperty(prop)) 
                    {
                        this[prop] = obj[prop];
                    }
            } 
        }
    }
   
    //initial load of masterlist
    (function(){
        $scope.loader = true;
        MasterLoader.pullData().then(function(response){
            $scope.masterArray = response.data;
           // $log.info($scope.masterArray);      
        }).finally(function(){
            $scope.loader = false;
        });
    })();

    //loadMasterList();

    //load job on button press
    $scope.loadJob = function(jobNo){
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0]; // note: if key is undefined houston we have a problem
        if (obj !== undefined){
            $log.info("Loading: "+ obj.jobno + " " + obj.key);
            $scope.loader = true;
            JobHandler.pullData(obj.key).then(function(response){ 
                $log.info(angular.toJson(response));
                if (response.data.success === false){
                    $window.alert("Opps: " + response.message);
                }else{
                    let job = new Job(angular.fromJson(response.data));
                    if (job instanceof Job){     
                        $scope.recordCol = job;
                        $scope.recordCol["Datetime"] = convertDate($scope.recordCol["Datetime"]);
                        $scope.jobLoaded = true;
                        $log.info("Success: " + $scope.recordCol["Jobno"]); 
                    }
                }
            }).finally(function(){
                $scope.loader = false;
            });                   
        }else{
            alertMe("That job only exist in your imagination!");
        }
    };

    $scope.saveJob = function(){
        var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
        if (obj !== undefined){
            $scope.loader = true;
            $log.info("Saving: "+ obj.jobno + " " + obj.key);
            JobHandler.pushData(obj.key,$scope.recordCol).then(function(response){ 
                if (response.data.success){
                    $log.info("Success: " + $scope.recordCol);
                    alertMe("Save successful! Job updated!");
                }else{
                    $window.alert("Opps: " + response.message); 
                }
            }).finally(function(){
                $scope.loader = false;
            });           
        }else{
            $scope.recordCol["Jobno"] = $scope.key;
            $scope.loader = true;
            JobHandler.createData($scope.recordCol).then(function(response){ 
                if (response.data.success){
                    let id = response.data.id;
                    $scope.masterArray.Records.push({"jobno": $scope.recordCol["Jobno"],"key":id});
                    MasterLoader.pushData($scope.masterArray).then(function(response){ 
                        if (response.data.success){
                            $log.info(response.data.data);
                            $scope.masterArray = angular.fromJson(response.data.data);
                            $log.info("Success: " + $scope.recordCol);
                            alertMe("Save successful! Job created!");
                        }else{
                            $window.alert("Opps in Masterlist: " + response.message); 
                            $log.info("Opps in Masterlist: " + response.message);
                        }
                    });           
                }else{
                    $window.alert("Opps in Records: " + response.message);
                    $log.info("Opps in Records: " + response.message);
                }
            }).finally(function(){
                $scope.loader = false;
            });              
        }
      
    };

    $scope.newJob = function () {
        //check validity of jobno
        //check if existing in masterArray
        //if existing, load instead
        if ($scope.validateJob($scope.key)){
            var obj = $filter('filter')($scope.masterArray.Records, {jobno: $scope.key}, true)[0];
            if (obj === undefined){
                $scope.recordCol = new Job({"Datetime":convertDate(getToday())});
                //$scope.recordCol.Records = [];
                $scope.addItem();
                $scope.jobLoaded = true;
                alertMe("New job opened! Save to commit to database!")
            }else{
                alertMe("Can't create what already exist!")
            }
        }else{
            alertMe("Job number is not valid!")
        }
    };

    $scope.closeJob = function () {
        $scope.recordCol = new Job({Datetime:convertDate(getToday())});
       // var today = new Date();
       // today.setSeconds(0,0);
       // $scope.recordCol["Datetime"] = today;
        $scope.key = "";
        $scope.jobLoaded = false;
        $scope.jobDetails.$setPristine();
        $scope.jobDetails.$setUntouched();
        
    };

    $scope.validateJob = function(possibleJobNo){
        let jobNo = possibleJobNo;
        let jobNoREGX = $scope.validJobNo;
        return jobNoREGX.test(jobNo);
        
    };

    $scope.addItem = function() {
        $scope.recordCol.Records.push(new Record());
        //$log.info($scope.recordCol);
    };

    $scope.deleteItem = function() {
        $scope.recordCol.Records.pop();
        $log.info($scope.recordCol);
    };

    function getToday(){
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

    function alertMe(msg){
        $scope.error = msg; 
        //TODO: use $timeout instead maybe?
        setTimeout(function() {
            $log.info("yes!");
            $scope.error = "";
            $scope.$apply();
        }, 3000);
    }
    

    function convertDate(dateString){
        var s = dateString;
        var b = s.split(/\D+/);
        return new Date(b[0], --b[1], b[2], b[3], b[4], b[5]||0, b[6]||0);
    }

    // $scope.convertDate = function(dateString){
    //     var s = dateString;
    //     var b = s.split(/\D+/);
    //     return new Date(b[0], --b[1], b[2], b[3], b[4], b[5]||0, b[6]||0);
    // };


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





