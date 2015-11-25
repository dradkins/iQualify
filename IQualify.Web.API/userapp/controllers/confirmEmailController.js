(function (module) {

    var confirmEmailController = function ($scope, toastr, $stateParams, oauth) {

        var init = function () {
            var confirmationToken = $stateParams.confirmationToken;
            var userId = $stateParams.userId;
            oauth.confirmEmail(userId, confirmationToken)
            .then(function (response) {
                console.log(response);
            });
        };

        init();

    };

    confirmEmailController.$inject = ["$scope", "toastr", "$stateParams", "oauth"];
    module.controller("confirmEmailController", confirmEmailController);

}(angular.module("iQualify.controllers")));