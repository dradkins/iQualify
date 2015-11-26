(function (module) {

    var preparationExamController = function ($scope, toastr, question, answer) {

        $scope.result = {
            correctAnswers: 0,
            wrongAnswers: 0,
        }

        $scope.myDataSource = {
            chart: {
                caption: "Result of current preparation exam",
                startingangle: "120",
                showlabels: "1",
                showlegend: "1",
                enablemultislicing: "0",
                slicingdistance: "15",
                showpercentvalues: "1",
                showpercentintooltip: "0",
                plottooltext: "$label : $datavalue",
                theme: "fint"
            },
            data: [
                {
                    label: "Correct Answers",
                    value: "0"
                },
                {
                    label: "Wrong Aswers",
                    value: "0"
                },
            ]
        }

        $scope.noOfTotalQuestions;
        $scope.questions = [];
        $scope.currentQuestion = {};
        $scope.currentQuestionOptions = [];
        $scope.isExamStart = false;
        $scope.isExamComplete = false;
        $scope.answer = {};
        $scope.showErrorDialog = false;
        $scope.selectedAnswer;
        $scope.currentQuestionNumber = 0;
        $scope.nextButtonDisabled = false;

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
            if ($scope.noOfTotalQuestions < 5) {
                toastr.warning("Minimum 5 questions allowed");
                return false;
            }
            question.getRandomQuestions($scope.noOfTotalQuestions).then(onQuestions, onQuestionsError);
        }

        $scope.nextQuestion = function () {
            proceedeToNextQuestion();
            $scope.nextButtonDisabled = false;
            $scope.showErrorDialog = false;
        }

        $scope.checkAnswer = function () {
            $scope.nextButtonDisabled = true;
            answer.checkQuestionAnswer({ questionId: $scope.currentQuestion.id, selectedAnswer: $scope.selectedAnswer }).then(onAnswer, onAnswerError);
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
            $scope.showErrorDialog = !data.isCorrect;
            if ($scope.answer.isCorrect) {
                $scope.nextButtonDisabled = false;
                $scope.result.correctAnswers++;
                proceedeToNextQuestion();
            }
            else {
                $scope.result.wrongAnswers++;
            }
        }

        var proceedeToNextQuestion = function () {
            console.log($scope.noOfTotalQuestions);
            console.log($scope.currentQuestionNumber);
            if (($scope.noOfTotalQuestions - 1) == $scope.currentQuestionNumber) {
                processResult();
                return false;
            }
            $scope.selectedAnswer = null;
            $scope.answer = {};
            $scope.currentQuestionNumber++;
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionNumber];
            fillOptions();
        }

        var processResult = function () {
            $scope.isExamComplete = true;
            $scope.myDataSource.data[0].value = $scope.result.correctAnswers.toString();
            $scope.myDataSource.data[1].value = $scope.result.wrongAnswers.toString();
        }

        var onAnswerError = function (error) {
            console.log(error);
            toastr.error("Unable to check answer at this time. Please try later.")
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