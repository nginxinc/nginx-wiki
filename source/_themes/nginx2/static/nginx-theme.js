/**
 * nginx-theme.js
 *
 * General JS customizations for Nginx theme. "Localized" vars
 * are available in nginxThemeVars object.
 */
(function($) {

    var nginxTheme = {

        /**
         * Expand/collapse the header for mobile.
         */
        mobileHeaderToggle: function() {
            var expandedClass = 'mobile-expanded',
                $header = $('#masthead');

            $header.stop(true, true);
            if (!$header.hasClass(expandedClass)) {
                $header.addClass(expandedClass);
            } else {
                $header.removeClass(expandedClass);
            }
        },

        /**
         * Toggle expansion of a primary menu item that has children (mobile display only).
         *
         * @param triggerElement
         */
        mobilePrimaryMenuItemToggle: function(triggerElement) {
            var expandedClass = 'item-mobile-expanded',
                $item = $(triggerElement).closest('.menu-item'),
                $iconElement = $item.find('.icon').first();

            $item.stop(true, true);
            if (!$item.hasClass(expandedClass)) {
                $item.addClass(expandedClass);
                $iconElement.removeClass('icon-arrow-down').addClass('icon-arrow-up');
            } else {
                $item.removeClass(expandedClass);
                $iconElement.removeClass('icon-arrow-up').addClass('icon-arrow-down');
            }
        },

        /**
         * Apply modals for image links within the provided selector.
         *
         * @param {string} containerSelector A selector such as '.entry-content'.
         */
        applyImageModals: function(containerSelector) {

            var imgFileExtensions = [ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'tif' ];

            // We're targeting all links that lead directly to an image file.
            var $links = $(containerSelector).find('a').filter(function() {
                // Do a case-insensitive check on the file extension of each link.
                if (_.isString(this.href)) {
                    var href = this.href.toLowerCase(), fileExt = href.substr(href.lastIndexOf('.') + 1);
                    if ($.inArray(fileExt, imgFileExtensions) > -1) {
                        return true;
                    }
                }
                return false;
            });

            // Apply modal to each matching link.
            $links.each(function() {
                $(this).magnificPopup({
                    'type': 'image'
                });
            });
        },

        toggleFreeTrial: function() {
            $('.free-trial-wrap').toggleClass('visible');
        },

        toggleContactUs: function() {
            $('.contact-us-wrap').toggleClass('visible');
        }

    };

    $(document).ready(function() {

        // Toggle mobile header.
        $('.mobile-menu-button').on('click', function(e) {
            e.preventDefault();
            nginxTheme.mobileHeaderToggle();
        });

        // Toggle mobile menu item.
        $(document).on('click', '#masthead.mobile-expanded #menu-primary > li.menu-item-has-children > a .icon', function(e) {
            e.preventDefault();
            nginxTheme.mobilePrimaryMenuItemToggle(this);
        });

        // Apply image link modals.
        nginxTheme.applyImageModals('.entry-content');

        $(".icon-arrow-disc").css("cursor","pointer").on("click",function(){
            $(this).prev("a")[0].click();
        });

    });

    $('a.reference.external').each(function() {
        $(this).click(function(event) {
            event.preventDefault(); event.stopPropagation();window.open(this.href, '_blank');
        });
    });

})(jQuery);
