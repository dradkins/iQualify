(function (module) {

    var answer = function ($http) {

        var checkQuestionAnswer = function (data) {
            return $http.get("/api/answers/checkQuestionAnswer", { params: data })
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            checkQuestionAnswer: checkQuestionAnswer,
        };

    };

    answer.$inject = ["$http"];
    module.factory("answer", answer);

}(angular.module("iQualify.services")))