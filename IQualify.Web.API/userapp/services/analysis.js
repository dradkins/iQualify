(function (module) {

    var analysis = function ($http) {

        var getYearlyExamAnalysis = function (subjectId) {

            return $http.get("/api/analysis/getYearlyExamAnalysis", { params: { subjectId: subjectId }}).then(function (response) {
                return response.data;
            });

        }

        return {
            getYearlyExamAnalysis: getYearlyExamAnalysis
        }

    }

    analysis.$inject = ["$http"];
    module.factory("analysis", analysis);

}(angular.module("iQualify.services")))