(function (module) {

    var examData = function () {

        var topic = {
            topicName: "",
            topicId: 0
        }

        var questions = [];
        var totalQuestions = 0;

        var setTopic = function (data) {
            topic.topicName = data.name,
            topic.topicId = data.topicId
        };

        var setQuestions = function (data) {
            questions = data;
            totalQuestions = data.length;
            angular.forEach(questions, function (item) {
                item.isAttempted = false;
                item.options = [];
                for (var i = 0; i < item.noOfOptions; i++) {
                    var chr = String.fromCharCode(65 + i);
                    item.options.push(chr);
                }
            });
        }

        var getQuestions = function () {
            return questions;
        }

        var clearData = function () {
            questions = [];
            totalQuestions = 0
        }

        return {
            totalQuestions: totalQuestions,
            setQuestions: setQuestions,
            getQuestions: getQuestions,
            setTopic: setTopic
        };

    };

    module.factory("examData", examData);

}(angular.module("iQualify.services")))