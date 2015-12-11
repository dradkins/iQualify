(function (module) {

    var result = function ($http) {

        var getTopicalExamResult = function (id) {
            return $http.get("/api/TopicalExam/getTopicalExamResult", { params: { id: id } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        var getYearlyExamResult = function (id) {
            return $http.get("/api/YearlyExam/getYearlyExamResult", { params: { id: id } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getTopicalExamResult: getTopicalExamResult,
            getYearlyExamResult: getYearlyExamResult
        };

    };

    result.$inject = ["$http"];
    module.factory("result", result);

}(angular.module("iQualify.services")))