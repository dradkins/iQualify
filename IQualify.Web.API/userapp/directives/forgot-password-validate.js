(function (module) {

    var forgotPasswordValidate = function () {

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
                        'reminder-email': {
                            required: true,
                            email: true
                        }
                    },
                    messages: {
                        'reminder-email': {
                            required: 'Please enter a valid email address'
                        }
                    }
                });
            }
        }

    };

    module.directive("forgotPasswordValidate", forgotPasswordValidate);

}(angular.module("iQualify.directives")));