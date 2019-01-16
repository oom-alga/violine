(function () {
    'use strict';

    function log () {
        //console.log(Array.prototype.slice.call(arguments))
    }

    /*
    * The container where our content is going to be loaded
    * */
    var $main = $('#main');

    var $body = $('body');

    var $curtains = $('#curtains');
    var curtainsAnimationSpeed = 600;

    var initialDocumentTitle = document.title;

    /*
    * All the links that need AJAX treatment
    * */
    var $links = $('.ajax-link');

    /*
    * Global current hash variable
    * */
    var currentHash;

    /*
    * Using this function, we can assign a current page class
    * */
    function handleCurrentPage (hash) {
        $links.removeClass('current-page');

        for (var i = 0, max = $links.length; i < max; i++) {
            var $link =  $($links[i]);
            if ($link.attr('href') === hash) {
                $link.addClass('current-page');
            }
        }

        /*
        * Detecting current index page
        * */
        var pathname = window.location.pathname;
        var re = /(\w+|\-+)+\.html/;
        var currentIndex = re.exec(pathname);

        if (Array.isArray(currentIndex)) {
            $('[href*=' + currentIndex[0].replace('.html', '') + ']').addClass('current-page');
        }
    }

    /*
    * This is the click handing function, it substitutes all of the normal clicks
    * as well as page loads and history change */
    function handleClick (href, pushState) {
        if (href.length > 2 && href[href.length - 1] === '/') { // Detecting trailing slash
            href = href.slice(0, -1); // Removing the trailing slash
        }

        var fullHref = href;
        var noHashHref = fullHref.replace(/#\//, '');
        log('fullHref', fullHref);
        log('noHashHref', noHashHref);

        /*
        * A little check to avoid loading anything, if we're trying to access an already open page
        * */
        if (fullHref === currentHash) {
            log('Same page, not loading anything.');
            return;
        }

        currentHash = fullHref;

        /*
        * Empty hash means we should go home
        * */
        if (noHashHref.length === 0) {
            noHashHref = 'home';
        }

        /*
        * Assinging the .current-page class to the current page item menu
        * */
        handleCurrentPage(fullHref);

        $curtains.css('visibility', 'visible').css('left', 0);

        /*
        * Destroying fullpage
        * */
        if ($('#fullpage').length) {
            $.fn.fullpage.destroy('all');
        }

        /*
         * Destroying pagepiling
         * */
        if ($('#pagepiling').length) {
            $.fn.pagepiling.destroy('all');
        }

        $body.removeClass('zero-nav-height');
        $('.navbar-fixed').css('mix-blend-mode', 'unset');

        setTimeout(function () {
            /*
             * Initializing the AJAX call to fetch the page
             * */
            $.ajax({
                url: 'pages/' + noHashHref + '.html'
            }).done(function (resp) {
                /*
                 * A bit of history manipulation
                 * */
                if (pushState) {
                    window.history.pushState(null, null, fullHref);
                } else {
                    window.history.replaceState(null, null, fullHref);
                }

                /*
                 * Changing the document title
                 * */
                var newTitle = noHashHref.replace(/-/g, ' ').replace(/\//g, ' / ').split(' ');

                newTitle.forEach(function (el, i) {
                    newTitle[i] = el.charAt(0).toUpperCase() + el.slice(1);
                });

                newTitle = newTitle.join(' ');
                document.title = initialDocumentTitle + ' — ' + newTitle;

                /*
                 * Scrolling to top for each new page
                 * */
                window.scrollTo(0, 0);

                /*
                 * Popuilating the $main container with our contents
                 * */
                $main.html(resp);

                /*
                * Closing overlay menu, if it's open
                * */
                if ($('#nav-overlay').hasClass('visible')) {
                    $('.nav-icon-container').click();
                }

                setTimeout(function () {
                    $curtains.css('left', '100%');

                    setTimeout(function () {
                        $curtains.css('visibility', 'hidden');
                        $curtains.css('left', '-100%');
                    }, curtainsAnimationSpeed)
                }, curtainsAnimationSpeed);

                $body.removeClass(function (index, css) {
                    return (css.match (/(^|\s)page-\S+/g) || []).join(' ');
                }).addClass('page-' + noHashHref.replace(/\//g, '-'));

            }).fail(function (err) {
                /*
                 * When faililng to fetch the page, send to 404 page
                 * */
                log('ajax.fail', err);
                handleClick('#/404', true);
            });
        }, curtainsAnimationSpeed);

    }

    /*
    * This function is running on page load and popstate
    * It's checking for the current hash and handles the URL accordingly
    * */
    function handleLoad () {
        var location = window.location;
        var hash = location.hash;
        log('location', location);

        if (hash === '#!') {
            return;
        }

        if (hash.length > 0) {
            log('hash', hash);
            handleClick(hash, false);
        } else {
            hash = '#/';
            handleClick(hash, false);
        }
    }

    /*
    * Handling clicks
    * */
    $links.on('click', function (e) {
        e.preventDefault();
        log('#', $(this).attr('href').indexOf('#'));
        var href = $(this).attr('href');
        if (href.indexOf('#') !== -1) {
            handleClick(href, true);
        }
    });

    /*
    * Handling initial window load
    * */
    $(window).on('load popstate', function (e) {
        log('popstate', e);
        handleLoad();
    });

    /*
     * A fix for IE that didn't react on .popstate
     * */
    if (navigator.userAgent.toLowerCase().indexOf('msie')) {
        window.onhashchange = function () {
            handleLoad();
        };
    }
}());
