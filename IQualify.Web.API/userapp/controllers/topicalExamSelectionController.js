'use strict';

(function (module) {

    /***** Topical Exam Selection Controller *****/
    var topicalExamSelectionController = function ($scope, $state, toastr, exam, examData, topics) {

        $scope.noOfTotalQuestions;
        $scope.topics = [];
        $scope.selectedTopic;

        $scope.getExam = function () {
            exam.getTopicalExamQuestions({ topicId: $scope.selectedTopic.topicId, totalQuestions: $scope.noOfTotalQuestions })
                .then(onExam, onExamError);
        }

        var onExam = function (data) {
            examData.setTopic($scope.selectedTopic);
            $state.go("topical-exam", { "topicId": $scope.selectedTopic.topicId, "topicName": $scope.selectedTopic.urlLink });
        }

        var onExamError = function (error) {
            console.log(error);
            toastr.error("Unable to start exam at this time. Please try again.")
        }

        var onTopics = function (data) {
            $scope.topics = data;
            $scope.selectedTopic = $scope.topics[0];
        }

        var onTopicsError = function (error) {
            console.log(error);
            toastr.error("Unable to load topics at this time.")
        }

        var init = function () {
            topics.getBySubject(1).then(onTopics, onTopicsError);
        }

        init();

    }

    topicalExamSelectionController.$inject = ["$scope", "$state", "toastr", "exam", "examData", "topics"];
    module.controller("topicalExamSelectionController", topicalExamSelectionController);

}(angular.module("iQualify.controllers")));