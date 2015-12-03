(function (module) {

    var result = function ($http) {

        var getTopicalExamResult = function (id) {
            return $http.get("/api/TopicalExam/getTopicalExamResult", { params: { id: id } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getTopicalExamResult: getTopicalExamResult,
        };

    };

    result.$inject = ["$http"];
    module.factory("result", result);

}(angular.module("iQualify.services")))