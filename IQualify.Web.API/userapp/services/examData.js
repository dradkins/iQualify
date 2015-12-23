(function (module) {

    var examData = function () {

        var topic = {
            topicName: "",
            topicId: 0
        }

        var subject = {
            id: 0,
            name: "",
        };

        var subjectId;

        var startingTime;

        var questions = [];

        var setTopic = function (data) {
            topic.topicName = data.name,
            topic.topicId = data.topicId
        };

        var getTopic = function () {
            return topic;
        }

        var setQuestions = function (data) {
            questions = data;
            angular.forEach(questions, function (item) {
                item.isAttempted = false;
                item.options = [];
                for (var i = 0; i < item.noOfOptions; i++) {
                    var chr = String.fromCharCode(65 + i);
                    item.options.push(chr);
                }
            });
        }

        var setSubject = function (s) {
            subject.id = s.subjectId;
            subject.name = s.subjectName;
        }

        var getSubject = function () {
            return subject;
        }

        var getQuestions = function () {
            return questions;
        }

        var clearData = function () {
            questions = [];
            totalQuestions = 0
        }

        return {
            setQuestions: setQuestions,
            getQuestions: getQuestions,
            setTopic: setTopic,
            getTopic: getTopic,
            subjectId: subjectId,
            startingTime: startingTime
        };

    };

    module.factory("examData", examData);

}(angular.module("iQualify.services")))