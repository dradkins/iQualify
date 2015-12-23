(function (module) {

    var yearlyResultsController = function ($scope, result, toastr) {

        $scope.results = [];

        var onResults = function (data) {
            $scope.results = data;
        }

        var onResultsError = function (error) {
            console.log(error);
            toastr.error("unable to load results at this time");
        }

        var init = function () {
            result.getYearlyResultHistory().then(onResults, onResultsError);
        }
        init();
    }

    yearlyResultsController.$inject = ["$scope", "result", "toastr"];
    module.controller("yearlyResultsController", yearlyResultsController);

}(angular.module("iQualify.controllers")))