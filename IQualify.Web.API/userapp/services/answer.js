(function (module) {

    var answer = function ($http) {

        var checkQuestionAnswer = function (data) {
            return $http.post("/api/answers/checkQuestionAnswer", data)
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