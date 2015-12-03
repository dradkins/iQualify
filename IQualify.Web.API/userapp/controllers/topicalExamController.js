/// <reference path="C:\Users\Xavier\Desktop\iQualify-source\IQualify.Web.API\Scripts/underscore.js" />


'use strict';

(function (module) {

    /**** Topical Exam Controller *****/

    var topicalExamController = function ($scope, $state, $stateParams, $timeout, toastr, exam, examData) {

        $scope.totalQuestions;
        $scope.questions;
        $scope.currentQuestion;
        $scope.showFinishExam = false;
        $scope.currentQuestionNumber = 0;
        $scope.topic;
        $scope.selectedAnswer = null;

        var solvedQuestions = [];

        $scope.saveAnswer = function (selectedAnswer) {
            solvedQuestions.push({
                questionId: $scope.currentQuestion.id,
                selectedAnswer: selectedAnswer
            });
            $scope.currentQuestion.isAttempted = true;
            $timeout(function () {
                gotoNextQuestion();
            }, 1000)
        }

        $scope.finishExam = function () {
            if ($scope.questions.length > solvedQuestions.length) {
                toastr.warning("please attempt all questions and try again");
                return false;
            }
            var completedExamData = {
                selectedAnswers: solvedQuestions,
                subjectId: examData.subjectId,
                examStartingTime: examData.startingTime,
                topicId: $scope.topic.topicId
            };
            exam.submitTopicalExam(completedExamData).then(onExamSubmission, onExamSubmissionError);
        }

        $scope.$on("slideEnded", function () {
            $scope.currentQuestion = $scope.questions[$scope.slider.value - 1];
            $scope.selectedAnswer = null;
            if ($scope.currentQuestion.isAttempted) {
                $scope.selectedAnswer = _.find(solvedQuestions, function (item) { return item.questionId == $scope.currentQuestion.id }).selectedAnswer;
            }
        });

        var gotoNextQuestion = function () {
            var allAttempted = _.every($scope.questions, function (e) { return e.isAttempted });
            if (allAttempted) {
                $scope.showFinishExam = true;
                return false;
            }
            else {
                $scope.currentQuestion = nextQuestion($scope.currentQuestion);
                $scope.slider.value = $scope.questions.indexOf($scope.currentQuestion) + 1;
                $scope.selectedAnswer = null;
            }
        }

        var nextQuestion = function (question) {
            if (!question.isAttempted) {
                return question;
            }
            else {
                var index = $scope.questions.indexOf(question);
                if (index < $scope.questions.length - 1) {
                    return nextQuestion($scope.questions[index + 1]);
                }
                else {
                    console.log(question);
                    return nextQuestion($scope.questions[0]);
                }
            }
        }

        var onExamSubmission = function (data) {
            toastr.success("exam finished");
            $state.go("topical-exam-result", { "resultId": data });
        }

        var onExamSubmissionError = function (error) {
            console.log(error);
            toastr.error("unable to submit exam at this time. please try later")
        }

        var init = function () {
            $scope.questions = examData.getQuestions();
            $scope.totalQuestions = $scope.questions.length;
            if ($scope.totalQuestions == 0) {
                $state.go("topical-exam-selection");
                return false;
            }
            $scope.currentQuestion = $scope.questions[0];
            $scope.topic = examData.getTopic();

            //set slider
            var ceil = $scope.totalQuestions;
            $scope.slider = {
                value: 1,
                options: {
                    ceil: ceil,
                    floor: 1,
                    showTicks: true,
                    showTicksValues: true,
                }
            };
        }

        init();
    }

    topicalExamController.$inject = ["$scope", "$state", "$stateParams", "$timeout", "toastr", "exam", "examData"];
    module.controller("topicalExamController", topicalExamController);

}(angular.module("iQualify.controllers")));