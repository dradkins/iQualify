(function (module) {

    var preparationExamController = function ($scope, toastr, question) {

        $scope.totalQuestions = 10;
        $scope.currentQuestion = {};
        $scope.currentQuestionNumber = 0;
        $scope.showExam = false;
        $scope.showStatus = false;
        $scope.selectedAnswer = null;

        $scope.getQuestions = function () {
            if ($scope.totalQuestions > 50) {
                toastr.warning("Maximum 50 questions allowed")
            }
            if ($scope.totalQuestions < 10) {
                toastr.warning("Minimum 10 questions allowed")
            }
            question.getRandomQuestions($scope.totalQuestions).then(onQuestions, onQuestionsError);
        }

        $scope.nextQuestion = function () {

            $scope.selectedAnswer = null;
            $scope.currentQuestionNumber++;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
        }

        $scope.checkAnswer = function () {

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
    }

}(angular.module("iQualify.controllers")))