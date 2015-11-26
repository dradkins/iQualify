(function (module) {

    var formInput = function () {

        return {
            link: function (scope, element) {
                jQuery(element).each(function () {
                    var $input = jQuery(this);
                    var $parent = $input.parent('.form-material');

                    if ($input.val()) {
                        $parent.addClass('open');
                    }

                    $input.on('change', function () {
                        if ($input.val()) {
                            $parent.addClass('open');
                        } else {
                            $parent.removeClass('open');
                        }
                    });
                });
            }
        }

    };

    module.directive("formInput", formInput);

}(angular.module("iQualify.directives")));