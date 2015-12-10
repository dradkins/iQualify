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

        var getYearlyExamQuestions = function (data) {
            return $http.get("/api/YearlyExam/GetYearlyExamQuestions", { params: data })
                        .then(function (response) {
                            examData.setQuestions(response.data.yearlyExamQuestions);
                            examData.startingTime = response.data.examStartingTime;
                            return response.data;
                        });
        }

        var getYearlyExams = function (data) {
            return $http.get("/api/YearlyExam/GetSubjectYearlyExams", { params: data })
                        .then(function (response) {
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
            submitTopicalExam: submitTopicalExam,
            getYearlyExams: getYearlyExams,
            getYearlyExamQuestions: getYearlyExamQuestions
        };

    };

    exam.$inject = ["$http", "examData"];
    module.factory("exam", exam);

}(angular.module("iQualify.services")))