
// nav
$(function() {
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 1) {
            $('#header').addClass('fixed');
        } else {
            $('#header').removeClass('fixed');
        }
    });

	$('.hamburger-button').on('click', function(event){
		event.preventDefault();
		
		$(this).toggleClass('active');
        $('.overlay').toggleClass('visible');
        $('.blus').toggleClass('blur');
	});
});


// owl
$('.owl-index-1').owlCarousel({
    loop:true,
    margin:30,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        992:{
            items:3
        }
    }
});
$('.owl-index-2').owlCarousel({
    loop:true,
    margin:0,
    nav:false,autoplay:true,
    autoplayTimeout:5000,
    items:1,
});
$('.owl-testimonial-1').owlCarousel({
    loop:true,
    margin:10,
    nav:false,autoplay:true,
    autoplayTimeout:5000,
    responsive:{
        0:{
            items:3
        },
        600:{
            items:6
        }
    }
});
$('.owl-work-items').owlCarousel({
    center: true,
    loop:true,
    margin:30,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        }
    }
});

$('.owl-about').owlCarousel({
    center: true,
    items:2,
    loop:true,
    margin:10,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        }
    }
});