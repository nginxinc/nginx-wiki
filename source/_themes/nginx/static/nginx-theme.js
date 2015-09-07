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
        // FREE TRIAL MODAL JS

        $('.free-trial-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleFreeTrial();
            }
        });

        $('.free-trial-wrap .close-button').click(nginxTheme.toggleFreeTrial);
        $('a[href="#free-trial"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleFreeTrial();
        });

        if(window.location.hash == "#free-trial") {
            nginxTheme.toggleFreeTrial();
        }

        if(window.location.hash == "#hack") {
            nginxTheme.toggleFreeTrial();
        }


        // CONTACT US MODAL JS
        $('.contact-us-inner-wrap').click(function(e) {
            if(e.target == this) {
                nginxTheme.toggleContactUs();
            }
        });

        $('.contact-us-wrap .close-button').click(nginxTheme.toggleContactUs);
        $('a[href="#contact-us"]').click(function(e) {
            e.preventDefault();
            nginxTheme.toggleContactUs();
        });


        if(window.location.hash == "#contact-us") {
            nginxTheme.toggleContactUs();
        }


        // Toggle mobile header.
        $('.mobile-menu-button').on('click', function(e) {
            e.preventDefault();
            nginxTheme.mobileHeaderToggle();
        });

        // Toggle mobile menu item.
        $('#page').on('click', '#masthead.mobile-expanded #menu-primary > li.menu-item-has-children > a .icon', function(e) {
            e.preventDefault();
            nginxTheme.mobilePrimaryMenuItemToggle(this);
        });

        // Toggle menu search
        $('.search-field')
            .on('focus', function() {
                $(this).closest('.search-form-wrapper').addClass('focused');
                if(!$("#masthead").hasClass("sticky-menu")) {
                    $('.header-extras-wrapper').not('.mobile-expanded .header-extras-wrapper').toggle();
                }
            })
            .on('blur', function() {
                $(this).closest('.search-form-wrapper').removeClass('focused');
                if(!$("#masthead").hasClass("sticky-menu")) {
                    setTimeout(function () {
                        $('.header-extras-wrapper').not('.mobile-expanded .header-extras-wrapper').fadeToggle();
                    }, 1000);
                }
            });

        // Apply image link modals.
        nginxTheme.applyImageModals('.entry-content');

        $(".icon-arrow-disc").css("cursor","pointer").on("click",function(){
            $(this).prev("a")[0].click();
        });

    });

    scroll_effect();


    function scroll_effect() {
        "use strict";
        var headerBar = $("#masthead.site-header");
        var lastScrollTop = 0;
        $(window).scroll(function () {
            var currentScrollValue = $(this).scrollTop();
            //console.log(currentScrollValue);
            if(headerBar.hasClass('mobile-expanded')) { return; }

            if (currentScrollValue > 150) {
                headerBar.addClass('sticky-menu');
                if($(".post").length>0 ){
                    //if(currentScrollValue>600){
                    //    $("#asidewrapper aside:eq(0)").hide(200);
                    //}else if(currentScrollValue<600){
                    //    $("#asidewrapper aside:eq(0)").show(200);
                    //}
                }else if($("article.nx_info_types-admin-guide").length>0){
                    if(currentScrollValue>400){
                        $("#asidewrapper aside:eq(1)").hide(200);
                    }else if(currentScrollValue<400){
                        $("#asidewrapper aside:eq(1)").show(200);
                    }
                }

                if (currentScrollValue > 200) {
                    headerBar.addClass('show-sticky-menu');
                    $("#menu-header-actions .menu-item a[href$='/products/pricing/']").hide();
                }
            }
            if (currentScrollValue < 200) {
                headerBar.removeClass('show-sticky-menu');
                $("#asidewrapper").css("paddingTop",0);
                if (currentScrollValue < 150) {
                    headerBar.removeClass('sticky-menu');
                    $("#menu-header-actions .menu-item a[href$='/products/pricing/']").show();
                }
            }
            lastScrollTop = currentScrollValue;
        });
    }

    $('a[href^=#]').smoothScroll({offset: -120});

})(jQuery);