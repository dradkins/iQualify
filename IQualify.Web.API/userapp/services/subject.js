(function (module) {

    var subject = function ($http) {

        var getAll = function (data) {
            return $http.get("/api/subject/getAll", { params: data })
                        .then(function (response) {
                            return response.data;
                        });
        }

        var getAllSubjects = function () {
            return $http.get("/api/subject/getAllSubjects")
                        .then(function (response) {
                            return response.data;
                        });
        }

        var saveUserSubject = function (data) {
            return $http.post("/api/subject/saveUserSubjects", data)
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getAll: getAll,
            saveUserSubject: saveUserSubject,
            getAllSubjects: getAllSubjects
        };

    };

    subject.$inject = ["$http"];
    module.factory("subject", subject);

}(angular.module("iQualify.services")))