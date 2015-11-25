(function (module) {

    var registerController = function ($scope, $location, oauth, toastr) {

        $scope.model = {
            fullName: "Hammad Hanif",
            email: "hammadhanif@hotmail.com",
            password: "@Dmin123",
            confirmPassword: "@Dmin123",
        };

        $scope.isAgree = false;

        $scope.register = function (formId) {
            if (!$scope.isAgree) {
                toastr.info("please agree term and conditions to process further.")
                return false;
            }
            if ($(formId).valid()) {
                oauth.register($scope.model)
                     .then(onRegisterSuccess, onRegisterError);
            }
            else {
                toastr.error("invalid data entered. please enter valid data and try again.");
            }
        }

        var onRegisterSuccess = function (data) {
            toastr.success("registered successfully");
            $location.path("/email-confirm");
        }

        var onRegisterError = function (error) {
            toastr.error("unable to register now. please try again");
        }

    };

    registerController.$inject = ["$scope", "$location", "oauth", "toastr"];
    module.controller("registerController", registerController);

}(angular.module("iQualify.controllers")));