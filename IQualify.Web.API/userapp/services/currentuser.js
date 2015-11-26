(function (module) {

    var currentUser = function (formEncode, localStorageService) {


        var USERKEY = "USERAUTHTOKEN";

        var setProfile = function (username, fullName, token) {
            profile.username = username;
            profile.fullName = fullName;
            profile.token = token;
            localStorageService.set(USERKEY, angular.toJson(profile));
        };

        var initialize = function () {
            var user = {
                username: "",
                fullName: "",
                token: "",
                get loggedIn() {
                    return this.token;
                }
            }
            var localUser = localStorageService.get(USERKEY);
            if (localUser) {
                var currentUser = angular.fromJson(localUser);
                user.username = currentUser.username;
                user.token = currentUser.token;
                user.fullName = currentUser.fullName;
            }
            return user;
        }

        var profile = initialize();

        //var profile = {
        //    username: "",
        //    fullName: "",
        //    token: "",
        //    get loggedIn() {
        //        return this.token;
        //    }
        //};

        return {
            setProfile: setProfile,
            profile: profile,
        }

    }

    currentUser.$inject = ["formEncode", "localStorageService"]
    module.factory("currentUser", currentUser);

}(angular.module("iQualify.services")))