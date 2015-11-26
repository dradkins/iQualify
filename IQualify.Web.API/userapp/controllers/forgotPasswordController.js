(function (module) {

    var forgotPasswordController = function ($scope, toastr, oauth) {

        $scope.email = "";

        $scope.resetPassword = function (formId) {
            if ($(formId).valid()) {
                oauth.sendResetPasswordToken({ email: $scope.email })
                     .then(onPasswordReset, onPasswordResetError);
            }
            else {
                toastr.error("invalid data entered. please enter valid data and try again.");
            }
        }

        var onPasswordReset = function (data) {
            toastr.success("")
        }

    };

    forgotPasswordController.$inject = ["$scope", "toastr", "oauth"];
    module.controller("forgotPasswordController", forgotPasswordController);

}(angular.module("iQualify.controllers")));