(function (module) {

    var registerValidate = function () {

        return {
            link: function (scope, element) {
                jQuery(element).validate({
                    //errorClass: 'help-block text-right animated fadeInDown',
                    //errorElement: 'div',
                    //errorPlacement: function (error, e) {
                    //    jQuery(e).parents('.form-group .form-material').append(error);
                    //},
                    errorClass: 'error',
                    errorElement: 'div',
                    errorPlacement: function (error, element) {
                        var placement = $(element).data('error');
                        if (placement) {
                            $(placement).append(error)
                        } else {
                            error.insertAfter(element);
                        }
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
                        'register-username': {
                            required: true,
                            minlength: 3
                        },
                        'register-email': {
                            required: true,
                            email: true
                        },
                        'register-password': {
                            required: true,
                            minlength: 5
                        },
                        'register-password2': {
                            required: true,
                            equalTo: '#register-password'
                        }
                    },
                    messages: {
                        'register-username': {
                            required: 'Please enter a username',
                            minlength: 'Your username must consist of at least 3 characters'
                        },
                        'register-email': 'Please enter a valid email address',
                        'register-password': {
                            required: 'Please provide a password',
                            minlength: 'Your password must be at least 5 characters long'
                        },
                        'register-password2': {
                            required: 'Please provide a password',
                            minlength: 'Your password must be at least 5 characters long',
                            equalTo: 'Please enter the same password as above'
                        }
                    }
                });
            }
        }

    };

    module.directive("registerValidate", registerValidate);

}(angular.module("iQualify.directives")));