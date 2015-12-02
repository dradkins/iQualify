/// <reference path="C:\Users\Xavier\Desktop\iQualify-source\IQualify.Web.API\Scripts/underscore.js" />


'use strict';

(function (module) {

    /**** Topical Exam Controller *****/

    var topicalExamController = function ($scope, $stateParams, toastr, exam, examData) {

        console.log($stateParams);

        $scope.totalQuestions;
        $scope.questions;
        $scope.currentQuestion;
        $scope.solvedQuestions = [];
        $scope.showFinishExam = false;
        $scope.currentQuestionNumber = 0;
        $scope.topic = examData.topic;

        $scope.goToQuestion = function (qNo) {
            $scope.currentQuestion = $scope.questions[qNo];
        }

        $scope.saveAnswer = function (selectedAnswer) {
            $scope.solvedQuestions.push({
                questionId: $scope.currentQuestion.id,
                selectedAnswer: selectedAnswer
            });
            gotoNextQuestion();
        }

        $scope.finishExam = function () {
            if ($scope.questions.length > $scope.solvedQuestions.length) {
                toastr.warning("please attempt all questions and try again");
            }
            toastr.success("exam finished");
        }

        var gotoNextQuestion = function () {

            var currentQuestionIndex = $scope.questions.indexOf($scope.currentQuestion);
            $scope.currentQuestionNumber = currentQuestionIndex;
            if (!(_.any($scope.questions.isAttempted))) {
                $scope.showFinishExam = true;
                return false;
            }
            else {
                if (currentQuestionIndex < $scope.totalQuestions - 1) {
                    $scope.currentQuestion = $scope.questions[currentQuestionIndex + 1];
                    if ($scope.currentQuestion.isAttempted) {
                        gotoNextQuestion();
                    }
                    else {
                        return false;
                    }
                }
                else {
                    $scope.currentQuestion = $scope.questions[0];
                    gotoNextQuestion();
                }
            }
        }

        var init = function () {
            $scope.questions = examData.getQuestions();
            $scope.currentQuestion = $scope.questions[0];
            $scope.totalQuestions = examData.totalQuestions
        }
        init();
    }

    topicalExamController.$inject = ["$scope", "$stateParams", "toastr", "exam", "examData"];
    module.controller("topicalExamController", topicalExamController);

}(angular.module("iQualify.controllers")));