(function (module) {

    var exam = function ($http, examData) {

        var getTopicalExamQuestions = function (data) {
            return $http.get("/api/TopicalExam/GetTopicalExamQuestions", { params: data })
                        .then(function (response) {
                            examData.setQuestions(response.data);
                            return response.data;
                        });
        }

        return {
            getTopicalExamQuestions: getTopicalExamQuestions,
        };

    };

    exam.$inject = ["$http", "examData"];
    module.factory("exam", exam);

}(angular.module("iQualify.services")))