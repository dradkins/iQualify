(function (module) {

    var topicalResultsController = function ($scope, result, toastr) {

        $scope.results = [];

        var onResults = function (data) {
            $scope.results = data;
        }

        var onResultsError = function (error) {
            console.log(error);
            toastr.error("unable to load results at this time");
        }

        var init = function () {
            result.getTopicalResultHistory().then(onResults, onResultsError);
        }

        init();
    }

    topicalResultsController.$inject = ["$scope", "result", "toastr"];
    module.controller("topicalResultsController", topicalResultsController);

}(angular.module("iQualify.controllers")))