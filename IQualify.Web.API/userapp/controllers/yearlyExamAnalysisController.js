(function (module) {

    var yearlyExamAnalysisController = function ($scope, toastr, analysis) {

        $scope.showAnalysis = false
        $scope.lastResultData;
        $scope.lastExamPerformance;
        $scope.isPerformanceIncrease;
        $scope.performanceMargin;

        $scope.chartDataSource = {
            chart: {
                caption: "Result of last yearly exam",
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

        $scope.performanceGraphData = {
            chart: {
                caption: "Overall Performance Of Yearly Exams",
                subcaption: "Yearly Exams Performance",
                "xaxisname": "Yearly Exams",
                "yaxisname": "Performance",
                "theme": "fint"
            },
            categories: [],
            dataset: []
        }

        var createPerformanceGraph = function (scorePercentage, performance) {
            var categories = [];
            var dataSet = [];
            dataSet.push({
                seriesName: "Score Percentage",
                data: []
            });
            dataSet.push({
                seriesName: "Performance",
                renderas: "line",
                showvalues: "0",
                data: []
            });
            var i = 1;
            angular.forEach(scorePercentage, function (sp) {
                categories.push({
                    label: i.toString()
                });
                dataSet[0].data.push({
                    value: sp.toString()
                });
                i++;
            })
            angular.forEach(performance, function (p) {
                dataSet[1].data.push({
                    value: p.toString()
                });
            })
            $scope.performanceGraphData.categories.push({ category: categories });
            $scope.performanceGraphData.dataset = dataSet;
        }

        var onAnalysisData = function (data) {
            $scope.lastResultData = data.lastExamResult;
            $scope.chartDataSource.data[0].value = $scope.lastResultData.correctAnswers.toString();
            $scope.chartDataSource.data[1].value = $scope.lastResultData.totalQuestions.toString() - $scope.lastResultData.correctAnswers.toString();
            createPerformanceGraph(data.percentage, data.performance);

            $scope.lastExamPerformance = data.lastExamPerformance;
            $scope.isPerformanceIncrease = (data.lastPerformanceStatus > 0)
            $scope.performanceMargin = Math.abs(data.lastPerformanceStatus);

            $scope.showAnalysis = true;
        }

        var onError = function (error) {
            console.log(error);
            toastr.error("Unable to load analysis data at this time! Please try later");
        }

        var init = function () {
            analysis.getYearlyExamAnalysis(3).then(onAnalysisData, onError);
        }
        init();
    }

    yearlyExamAnalysisController.$inject = ["$scope", "toastr", "analysis"]

    module.controller("yearlyExamAnalysisController", yearlyExamAnalysisController);

}(angular.module("iQualify.controllers")))