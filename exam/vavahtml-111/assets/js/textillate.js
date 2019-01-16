(function () {
    $('.tlt').textillate({
        loop: false,
        minDisplayTime: 0,
        initialDelay: 0,
        autoStart: false,
        'in': {
            effect: 'fadeIn',
            delay: 25
        },
        out: {
            effect: 'fadeOut',
            delay: 25
        }
    });

    $('.rectangle, .rectangle-vertical, .rectangle-8-of-12').on({
        'mouseenter': function () {
            $(this).find('.tlt').textillate('in');
        },
        'mouseleave': function () {
            $(this).find('.tlt').textillate('out');
        }
    });
})();
