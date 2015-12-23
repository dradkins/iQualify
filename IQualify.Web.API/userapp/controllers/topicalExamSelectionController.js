'use strict';

(function (module) {

    /***** Topical Exam Selection Controller *****/
    var topicalExamSelectionController = function ($scope, $state, toastr, exam, examData, topics, subject) {

        $scope.noOfTotalQuestions;
        $scope.topics = [];
        $scope.subjects = [];
        $scope.selectedSubject;
        $scope.selectedTopic;
        $scope.loadingTopics = true;

        $scope.getTopics = function () {
            $scope.loadingTopics = true;
            topics.getBySubject($scope.selectedSubject.subjectId).then(onTopics, onTopicsError);
        }

        $scope.getExam = function () {
            exam.getTopicalExamQuestions({ topicId: $scope.selectedTopic.topicId, totalQuestions: $scope.noOfTotalQuestions })
                .then(onExam, onExamError);
        }

        var onExam = function (data) {
            examData.setTopic($scope.selectedTopic);
            examData.subjectId = $scope.selectedSubject.subjectId;
            $state.go("topical-exam", { "topicId": $scope.selectedTopic.topicId, "topicName": $scope.selectedTopic.urlLink });
        }

        var onExamError = function (error) {
            console.log(error);
            toastr.error("Unable to start exam at this time. Please try again.")
        }

        var onTopics = function (data) {
            $scope.loadingTopics = false;
            $scope.topics = data;
            $scope.selectedTopic = $scope.topics[0];
        }

        var onTopicsError = function (error) {
            $scope.loadingTopics = false;
            console.log(error);
            toastr.error("Unable to load topics at this time.")
        }

        var onSubjects = function (data) {
            $scope.subjects = data;
            $scope.loadingTopics = false;
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

    topicalExamSelectionController.$inject = ["$scope", "$state", "toastr", "exam", "examData", "topics", "subject"];
    module.controller("topicalExamSelectionController", topicalExamSelectionController);

}(angular.module("iQualify.controllers")));