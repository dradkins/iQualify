(function (module) {

    var registration = function () {

        var model = {
            firstName: "hammad",
            surName: "hanif",
            email: "hammadhanif@hotmail.com",
            password: "hammad",
            confirmPassword: "hammad",
            subjectClass: 1,
            subjectType: 2,
            selectedSubjects: [],
        };

        return {
            model: model,
        }

    }

    module.factory("registration", registration);

}(angular.module("iQualify.services")))