(function (module) {

    var subjectSelectionController = function ($scope, toastr, subject) {

        $scope.subjectType = 1;
        $scope.subjectClass = 1;
        $scope.subjects = [];
        $scope.selectedSubjects = [];
        $scope.isSubjectsReached = false;

        $scope.getSubjects = function () {
            subject.getAll(
                {
                    subjectType: $scope.subjectType,
                    subjectClass: $scope.subjectClass
                })
                .then(onSubjects, onSubjectsError);
        }

        $scope.subjectsSelected = function () {
            var anySelected = false;
            angular.forEach($scope.subjects, function (s) {
                if (s.isSelected) {
                    anySelected = true;
                    $scope.selectedSubjects.push(s.subjectId);
                }
            });
            if (!anySelected) {
                toastr.warning("Please select at least 1 subject to proceede.")
            }
            else {
                subject.saveUserSubject($scope.selectedSubjects).then(function (data) {
                    console.log(data);
                })
                console.log($scope.selectedSubjects);
            }
        }

        var onSubjects = function (data) {
            angular.forEach(data, function (s) {
                s.isSelected = false;
            });
            $scope.subjects = data;
            $scope.isSubjectsReached = true;
        }

        var onSubjectsError = function (error) {
            console.log(error);
        }

        var init = function () {
            subject.getUserActivatedSubjects().then(function (data) {
                $scope.activatedSubjects = data;
            }, function (error) {
                console.log(error);
                toastr.error("Error while fetching your activated subjects");
            });
        }

        init();
    };

    subjectSelectionController.$inject = ["$scope", "toastr", "subject"];
    module.controller("subjectSelectionController", subjectSelectionController);

}(angular.module("iQualify.controllers")));