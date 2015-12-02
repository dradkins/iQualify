(function (module) {

    var topics = function ($http) {

        var getBySubject = function (subjectId) {
            return $http.get("api/TopicalExam/getSubjectTopics", { params: { subjectId: subjectId } })
                        .then(function (response) {
                            return response.data;
                        });
        }

        return {
            getBySubject: getBySubject,
        };

    };

    topics.$inject = ["$http"];
    module.factory("topics", topics);

}(angular.module("iQualify.services")))