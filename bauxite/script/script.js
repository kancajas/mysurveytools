var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', function($scope, $http, $log) {
    $log.info("test");
    //$http.get("customers.php")
    //.then(function (response) {$scope.names = response.data.records;});
});






function handleAccordion(e,id) {
	e.stopPropagation();
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}





