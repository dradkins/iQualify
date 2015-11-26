(function (module) {

    var registerController = function ($scope, $location, oauth, toastr, registration, subject) {

        $scope.model = registration.model;

        $scope.step_one_complete = false;

        $scope.subjects = [];

        $scope.isAgree = false;

        $scope.nextStep = function (formId) {
            if (!$scope.isAgree) {
                toastr.info("please agree term and conditions to process further.")
                return false;
            }
            if ($(formId).valid()) {
                console.log($scope.model);
                subject.getAll(
                    {
                        subjectType: $scope.model.subjectType,
                        subjectClass: $scope.model.subjectClass
                    })
                    .then(onSubjects, onSubjectsError);
                //oauth.register($scope.model)
                //     .then(onRegisterSuccess, onRegisterError);
            }
            else {
                toastr.error("invalid data entered. please enter valid data and try again.");
            }
        }

        $scope.register = function () {
            var anySelected = false;
            angular.forEach($scope.subjects, function (s) {
                if (s.isSelected) {
                    anySelected = true;
                    $scope.model.selectedSubjects.push(s.subjectId);
                }
            });
            console.log($scope.model);
        }

        var onSubjects = function (data) {
            console.log(data);
            angular.forEach(data, function (s) {
                s.isSelected = false;
            });
            $scope.subjects = data;
            $scope.step_one_complete = true;
        }

        var onSubjectsError = function (error) {
            console.log(error);
        }

        var onRegisterSuccess = function (data) {
            toastr.success("registered successfully");
            $location.path("/email-confirm");
        }

        var onRegisterError = function (error) {
            toastr.error("unable to register now. please try again");
        }
    };

    registerController.$inject = ["$scope", "$location", "oauth", "toastr", "registration", "subject"];
    module.controller("registerController", registerController);

}(angular.module("iQualify.controllers")));