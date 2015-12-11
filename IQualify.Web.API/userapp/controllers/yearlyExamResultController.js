'use strict';

(function (module) {

    /***** Topical Exam Selection Controller *****/
    var yearlyExamResultController = function ($scope, $stateParams, toastr, result) {

        $scope.resultData;
        $scope.showResult = false;

        $scope.chartDataSource = {
            chart: {
                caption: "Result of current yearly exam",
                startingangle: "120",
                showlabels: "1",
                showlegend: "1",
                enablemultislicing: "0",
                slicingdistance: "15",
                showpercentvalues: "1",
                showpercentintooltip: "0",
                plottooltext: "$label : $datavalue",
                theme: "fint"
            },
            data: [
                {
                    label: "Correct Answers",
                    value: "0"
                },
                {
                    label: "Wrong Aswers",
                    value: "0"
                },
            ]
        }

        var onResult = function (data) {
            $scope.resultData = data;

            $scope.chartDataSource.data[0].value = data.correctAnswers.toString();
            $scope.chartDataSource.data[1].value = data.totalQuestions.toString() - data.correctAnswers.toString();
            $scope.showResult = true;
        }

        var onResultError = function (error) {
            console.log(error);
            toastr.error("Unable to load result at this time.")
        }

        var init = function () {
            var resultId = $stateParams.resultId;
            result.getYearlyExamResult(resultId).then(onResult, onResultError);
        }

        init();

    }

    yearlyExamResultController.$inject = ["$scope", "$stateParams", "toastr", "result"];
    module.controller("yearlyExamResultController", yearlyExamResultController);

}(angular.module("iQualify.controllers")));