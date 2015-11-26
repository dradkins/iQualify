(function (module) {

    var preparationExamController = function ($scope, toastr, question, answer) {

        $scope.noOfTotalQuestions;
        $scope.currentQuestion = {};
        $scope.currentQuestionOptions = [];
        $scope.isExamStart = false;
        $scope.isExamComplete = false;
        $scope.answer = {};
        $scope.selectedAnswer = null;
        $scope.currentQuestionNumber = 0;
        $scope.nextButtonEnabled = true;

        $scope.showExam = false;
        $scope.showStatus = false;
        $scope.selectedAnswer = null;

        $scope.getQuestions = function () {
            console.log($scope.noOfTotalQuestions);
            if (isNaN($scope.noOfTotalQuestions)) {
                toastr.warning("Please enter a valid number and try again");
                return false;
            }
            if ($scope.noOfTotalQuestions > 50) {
                toastr.warning("Maximum 50 questions allowed");
                return false;
            }
            if ($scope.noOfTotalQuestions < 10) {
                toastr.warning("Minimum 10 questions allowed");
                return false;
            }
            question.getRandomQuestions($scope.noOfTotalQuestions).then(onQuestions, onQuestionsError);
        }

        $scope.nextQuestion = function () {
            $scope.selectedAnswer = null;
            $scope.currentQuestionNumber++;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
        }

        $scope.checkAnswer = function () {
            $scope.nextButtonEnabled = false;
            answer.checkQuestionAnswer({questionId:$scope.currentQuestion.id, selectedAnswer:$scope.selectedAnswer}).then(onAnswer, onAnswerError);
        }

        $scope.finishExam = function () {
            $scope.showExam = false;
            $scope.showStatus = true;
        }

        var onQuestions = function (data) {
            $scope.questions = data;
            $scope.isExamStart = true;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
            fillOptions();
        }

        var onQuestionsError = function (error) {
            console.log(error);
            toastr.error("Unable to load questions at this time. Please try later.")
        }

        var onAnswer = function (data) {
            $scope.answer = data;
            if ($scope.answer.isCorrect) {
                proceedeToNextQuestion();
            }
        }

        var proceedeToNextQuestion = function () {
            $scope.selectedAnswer = null;
            $scope.answer = {};
            $scope.currentQuestionNumber++;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
            fillOptions();
        }

        var onAnswerError = function (error) {
            console.log(error);
        }

        var fillOptions = function () {
            $scope.currentQuestionOptions = [];
            for (var i = 0; i < $scope.currentQuestion.noOfOptions; i++) {
                var chr = String.fromCharCode(65 + i);
                $scope.currentQuestionOptions.push(chr);
            }
        }
    }

    module.controller("preparationExamController", preparationExamController);

}(angular.module("iQualify.controllers")))