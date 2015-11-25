(function (module) {

    var preparationExamController = function ($scope, toastr, question, answer) {

        $scope.noOfTotalQuestions = 10;
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
            if ($scope.noOfTotalQuestions > 50) {
                toastr.warning("Maximum 50 questions allowed")
            }
            if ($scope.noOfTotalQuestions < 10) {
                toastr.warning("Minimum 10 questions allowed")
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
            $scope.showExam = true;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
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
            for (var i = 0; i < $scope.currentQuestion.totalNoOfOptions; i++) {
                var chr = String.fromCharCode(65 + n);
                $scope.currentQuestionOptions.push(chr);
            }
        }
    }

}(angular.module("iQualify.controllers")))