(function (module) {

    var question = function ($http) {

        var getRandomQuestions = function (total) {
            return $http.get("/api/questions/getRandomQuestions", { params: { id: total } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getRandomQuestions: getRandomQuestions,
        };

    };

    question.$inject = ["$http"];
    module.factory("question", question);

}(angular.module("iQualify.services")))