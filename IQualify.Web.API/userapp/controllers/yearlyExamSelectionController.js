(function (module) {

    /***** Topical Exam Selection Controller *****/
    var yearlyExamSelectionController = function ($scope, $state, toastr, exam, subject) {

        $scope.selectedSubject;
        $scope.selectedYearlyExam;
        $scope.subjects = [];
        $scope.yearlyExams = [];

        $scope.loadingYearlyExams = true;
        $scope.showSubmit = false;

        $scope.enableSubmit = function () {
            $scope.showSubmit = true;
        }

        $scope.getYearlyExams = function () {
            $scope.loadingYearlyExams = true;
            exam.getYearlyExams({ subjectId: $scope.selectedSubject.subjectId })
                .then(onYearlyExams, onYearlyExamsError);
        }

        $scope.startYearlyExam = function () {
            console.log("Clicked");
            $state.go("yearly-exam", { "yearlyExamId": $scope.selectedYearlyExam.id });
        }

        var onYearlyExams = function (data) {
            $scope.yearlyExams = [];
            $scope.yearlyExams = data;
            $scope.loadingYearlyExams = false;
        }

        var onYearlyExamsError = function (error) {
            console.log(error);
            $scope.loadingYearlyExams = false;
            toastr.error("Unable to fetch exams at this time. Please try again.")
        }

        var onSubjects = function (data) {
            console.log(data);
            $scope.subjects = data;
            $scope.loadingYearlyExams = false;
        }

        var onSubjectsError = function (error) {
            console.log(error);
            toastr.error("Unable to load subjects at this time.")
        }

        var init = function () {
            subject.getAllSubjects().then(onSubjects, onSubjectsError);
        }

        init();

    }

    yearlyExamSelectionController.$inject = ["$scope", "$state", "toastr", "exam", "subject"];
    module.controller("yearlyExamSelectionController", yearlyExamSelectionController);

}(angular.module("iQualify.controllers")));