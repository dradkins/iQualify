(function (module) {

    var exam = function ($http, examData) {

        var getTopicalExamQuestions = function (data) {
            return $http.get("/api/TopicalExam/GetTopicalExamQuestions", { params: data })
                        .then(function (response) {
                            examData.setQuestions(response.data.topicalExamQuestions);
                            examData.startingTime = response.data.examStartingTime;
                            return response.data;
                        });
        }

        var submitTopicalExam = function (data) {
            return $http.post("/api/TopicalExam/saveExam", data)
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getTopicalExamQuestions: getTopicalExamQuestions,
            submitTopicalExam: submitTopicalExam
        };

    };

    exam.$inject = ["$http", "examData"];
    module.factory("exam", exam);

}(angular.module("iQualify.services")))