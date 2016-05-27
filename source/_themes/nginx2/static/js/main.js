( function($){  
    
  $(document).ready(function(){
        jQuery('a[href="https://www.nginx.com/free-trial-request/"]').attr("href", "https://www.nginx.com/products/#free-trial");
        jQuery('a[href="https://www.nginx.com/contact-sales/"]').attr("href", "https://www.nginx.com/products/#contact-us");

            var submitIcon = $('.searchbox-icon');
            var inputBox = $('.searchbox-input');
            var searchBox = $('.searchbox');
            var isOpen = false;
            submitIcon.click(function(){
                if(isOpen == false){
                    searchBox.addClass('searchbox-open');
                    inputBox.focus();
                    isOpen = true;
                } else {
                    searchBox.removeClass('searchbox-open');
                    inputBox.focusout();
                    isOpen = false;
                }
            });  
             submitIcon.mouseup(function(){
                    return false;
                });
            searchBox.mouseup(function(){
                    return false;
                });
            $(document).mouseup(function(){
                    if(isOpen == true){
                        $('.searchbox-icon').css('display','block');
                        submitIcon.click();
                    }
                });


            $(window).scroll(function() {
                if ($(document).scrollTop() > 200) {
                    $('.site-header, .mobile-header').addClass('sticky-menu', 500);
                }
                else {
                    $('.site-header, .mobile-header').removeClass('sticky-menu');
                }
            });


            $('.searchbox .search-icon').click(function() {
              $('.searchbox').toggleClass('stretch-search');
              $('.header-extras-wrapper').slideToggle( "500" );
            });
        });
            function buttonUp(){
                var inputVal = $('.searchbox-input').val();
                inputVal = $.trim(inputVal).length;
                if( inputVal !== 0){
                    $('.searchbox-icon').css('display','none');
                } else {
                    $('.searchbox-input').val('');
                    $('.searchbox-icon').css('display','block');
                }
            }


})(jQuery);