(function (module) {

    var loginValidate = function () {

        return {
            link: function (scope, element) {
                jQuery(element).validate({
                    errorClass: 'help-block text-right animated fadeInDown',
                    errorElement: 'div',
                    errorPlacement: function (error, e) {
                        jQuery(e).parents('.form-group .form-material').append(error);
                    },
                    highlight: function (e) {
                        jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                        jQuery(e).closest('.help-block').remove();
                    },
                    success: function (e) {
                        jQuery(e).closest('.form-group').removeClass('has-error');
                        jQuery(e).closest('.help-block').remove();
                    },
                    rules: {
                        'login-username': {
                            required: true,
                            email:true,
                        },
                        'login-password': {
                            required: true,
                            minlength: 5
                        }
                    },
                    messages: {
                        'login-username': {
                            required: 'Please enter an email address',
                            email: 'Please enter a valid email address',
                        },
                        'login-password': {
                            required: 'Please provide a password',
                            minlength: 'Your password must be at least 5 characters long'
                        }
                    }
                });
            }
        }

    };

    module.directive("loginValidate", loginValidate);

}(angular.module("iQualify.directives")));