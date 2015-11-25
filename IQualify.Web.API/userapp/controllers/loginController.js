(function (module) {

    var loginController = function ($scope, $http, $state, toastr, oauth, currentUser) {

        $scope.username = "";
        $scope.password = "";
        $scope.user = currentUser.profile;
        $scope.form;
        $scope.showEmailConfirmation = false;

        $scope.login = function (formId, formName) {
            if ($(formId).valid()) {
                oauth.login($scope.username, $scope.password)
                     .then(onLoginSuccess, onLoginError);
                $scope.form = formName;
            }
            else {
                toastr.error("invalid data entered. please enter valid data and try again.");
            }
        }

        $scope.resendEmailConfirmation = function () {
            $scope.showEmailConfirmation = false;
            if ($scope.form.$valid) {
                oauth.resendConfirmationEmail($scope.username)
                     .then(onResendEmailSuccess, onResendEmailError);
            }
            else {
                toastr.error("invalid email address entered. please enter valid email and try again.");
            }
        }

        var onResendEmailSuccess = function (data) {
            toastr.success("Email sent successfully, please check your inbox / spam folder and confirm your email");
            $location.path("/email-confirm")
        }

        var onResendEmailError = function (error) {
            console.log(error);
            if (error.status === 404) {
                toastr.error("no account is registered with given email address.")
                return false;
            }
            toastr.error("unable to send email at this time, please try again in few minuts.");
        }

        var onLoginSuccess = function (data) {
            toastr.success("Welcom to iQualify " + data);
            $state.go('subject-selection');
        }

        var onLoginError = function (response) {
            if (response.status === 400) {
                if (response.data.error === "email_not_confirmed") {
                    $scope.showEmailConfirmation = true;
                    toastr.warning(response.data.error_description);
                }
                else {
                    toastr.error(response.data.error_description);
                }
            }
            $scope.password = "";
            $scope.form.$setPristine();
        }

    };

    loginController.$inject = ["$scope", "$http", "$state", "toastr", "oauth", "currentUser"];
    module.controller("loginController", loginController);

}(angular.module("iQualify.controllers")));