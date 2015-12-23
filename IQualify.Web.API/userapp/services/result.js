(function (module) {

    var result = function ($http) {

        var getTopicalExamResult = function (id) {
            return $http.get("/api/result/getTopicalExamResult", { params: { id: id } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        var getYearlyExamResult = function (id) {
            return $http.get("/api/result/getYearlyExamResult", { params: { id: id } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        var getYearlyResultHistory = function () {
            return $http.get("/api/result/getYearlyExamResultHistory")
                        .then(function (response) {
                            return response.data;
                        });
        }

        var getTopicalResultHistory = function () {
            return $http.get("/api/result/getTopicalExamResultHistory")
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getTopicalExamResult: getTopicalExamResult,
            getYearlyExamResult: getYearlyExamResult,
            getYearlyResultHistory: getYearlyResultHistory,
            getTopicalResultHistory: getTopicalResultHistory
        };

    };

    result.$inject = ["$http"];
    module.factory("result", result);

}(angular.module("iQualify.services")))