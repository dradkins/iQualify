(function () {

    var app = angular.module("iQualify", [
        "iQualify.controllers",
        "iQualify.services",
        "iQualify.directives",
        "iQualify.interceptors",
        "ui.router",
        "toastr",
        "angular-loading-bar",
        "LocalStorageModule"
    ]);

    app.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state("login", { url: "/login", templateUrl: "/userapp/templates/login.html", controller: "loginController" })
            .state("register", { url: "/register", templateUrl: "/userapp/templates/register.html", controller: "registerController" })
            .state("forgot-password", { url: "/forgot-password", templateUrl: "/userapp/templates/forgot-password.html", controller: "forgotPasswordController" })
            .state("email-confirm", { url: "/email-confirm", templateUrl: "/userapp/templates/email-confirm.html" })
            .state("confirm-email", { url: "/confirm-email/:userId/:confirmationToken", templateUrl: "/userapp/templates/confirm-email.html", controller: "confirmEmailController" })
            .state("menu", { url: "/menu", templateUrl: "/userapp/templates/menu.html" })
            .state("subject-selection", { url: "/subject-selection", templateUrl: "/userapp/templates/subject-selection.html", parent: "menu", controller: "subjectSelectionController" })
            .state("preparation-exam", { url: "/preparation-exam", templateUrl: "/userapp/templates/preparation-exam.html", parent: "menu", controller: "preparationExamController" })
        $urlRouterProvider.otherwise("/login");
    });


}());