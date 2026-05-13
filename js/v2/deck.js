document.addEventListener('contextmenu', event => event.preventDefault());

$(function(){
	deckSetup();
});

function deckSetup() {

	deck.assetStorageURL = $('#slides').data('storageUrl');
	setAssetSize();
	preloadAllElementImages('#slides');

	deck.container = $('#slides');
	deck.slides = $('.slide');
	deck.count = deck.slides.length;
	deck.slides.each(function(){
		var slideId = '#'+$(this).attr('id');
		if (typeof jQuery.scrollDepth === 'function' && typeof jQuery.scrollDepth.addElements === 'function') {
			jQuery.scrollDepth.addElements([slideId]);
		} else {
			console.log('scrollDepth was not setup');
		}
	});

	$(window).on('resize', deckResize);
	deckResize();
	window.onscroll = deckScroll;
	deckScroll();
	document.onkeydown = deckKeyControls;

	deckVideos();
	videoPlayPause();
	deckHelp();

	if (deck.page == 0 && $('.slide:first-child video')) {
		playVideos(deck.page);
	}

	if (window.location.hash) {
		changeSlide(parseInt(window.location.hash.slice(1)), { transition: false });
	}

	$('body').addClass('ready');
}

function deckResize(){
	deck.slideHeight = window.innerHeight;
	deck.slideDistance = deck.slideHeight * (1 + deck.spacerSize);
}

function deckScroll() {
	var offset = window.pageYOffset;
	var index = Math.floor(offset/deck.slideDistance);
	var opacity = 1 - Math.min((offset - index * deck.slideDistance)/deck.slideHeight, 1);
	var page = offset - index * deck.slideDistance > deck.slideHeight * deck.switchPoint ? index + 1 : index;

	var timestamp = Date.now();
	if (deck.timestamp && deck.offset) {
		var deltaT = timestamp - deck.timestamp;
		var deltaY = offset - deck.offset;
		var scrollSpeed = deltaY/deltaT;
		if (scrollSpeed < -deck.maxScrollSpeed) {
			deck.container.addClass('fastScroll');
			clearTimeout(deck.fadeTimeout);
			deck.fadeTimeout = setTimeout(function() {
				deck.container.removeClass('fastScroll');
			}, 200);
		}
	}

	var pastSlides = deck.slides.slice(0, index);
	var currentSlide = deck.slides.eq(index);
	var nextSlide = deck.slides.eq(index + 1);
	var futureSlides = deck.slides.slice(index + 2);
	if (index !== deck.index) {
		pastSlides.removeClass('slide-future').addClass('slide-past');
		currentSlide.removeClass('slide-future').addClass('slide-past');
		nextSlide.removeClass('slide-past').removeClass('slide-future');
		futureSlides.removeClass('slide-past').addClass('slide-future');
	}
	$('.slide-overlay', nextSlide).css('opacity', opacity);

	if (page !== deck.page) {
		pauseVideos(deck.slides);
		if (page === index) {
			playVideos(currentSlide);
		} else {
			playVideos(nextSlide);
		}

		clearTimeout(deck.updateTimeout);
		deck.updateTimeout = setTimeout(function() {
			window.location.hash = page;
		}, deck.minViewTime);
	}

	deck.offset = offset;
	deck.timestamp = timestamp;
	deck.index = index;
	deck.page = page;
}

function deckKeyControls(e) {
	switch (e.keyCode) {
		case 37:
		case 38:
			e.preventDefault();
			if (!$('html').hasClass('noscroll')) {
				changeSlide('prev');
			}
			return false;
			break;
		case 39:
		case 40:
			e.preventDefault();
			if (!$('html').hasClass('noscroll')) {
				changeSlide('next');
			}
			return false;
			break;
		case 72:
		case 73:
			if ($('#help').hasClass('show')) {
				$('html').removeClass('noscroll');
				$('#help').removeClass('show');
			} else {
				$('html').addClass('noscroll');
				$('#help').addClass('show');
			}
			break;
	}
};

function changeSlide(target, opts = {}) {
	var targetIndex = false;
	var speed = opts.transition === false ? 1 : deck.speed;

	switch(target) {
		case 'prev':
			targetIndex = deck.page - 1;
			if (targetIndex < 0) {
				targetIndex = 0;
			}
			break;
		case 'next':
			targetIndex = deck.page + 1;
			if (targetIndex >= deck.count) {
				targetIndex = deck.count - 1;
			}
			break;
		default:
			if (Number.isInteger(target) && target >= 0 && target < deck.count) {
				targetIndex = target;
			}
			break
	}
	if (targetIndex >= 0) {
		$('html, body').stop().animate({scrollTop: targetIndex * deck.slideDistance}, speed);
	}
}

function deckHelp() {
	$('.info-link').on('click', function(e){
		e.preventDefault();
		$('html').addClass('noscroll');
		$('#help').addClass('show');
		return false;
	});

	$('.help-close').on('click', function(e){
		e.preventDefault();
		$('html').removeClass('noscroll');
		$('#help').removeClass('show');
		return false;
	});
}

function deckVideos() {
	$('.slide-video .play-icon').on('click', function(e){
		e.preventDefault();
		$('html').addClass('noscroll');
		var vid = $(this).attr('href');
		$(vid).addClass('show');
		$('video', vid)[0].play();
		return false;
	});
	$('.video-close').on('click', function(e){
		e.preventDefault();
		var vid = $(this).parent().find('video');
		$(vid)[0].pause();
		$(this).parent().removeClass('show');
		$('html').removeClass('noscroll');
		return false;
	});

	pauseVideos(deck.slides);

	$('.slide-video').each(function(){
		let emptyBody = !$.trim($(this).find('.slide-body').html());
		if (emptyBody) {
			$(this).find('.play-icon').addClass('center');
		}
	});
}

// click video to play/pause
function videoPlayPause() {

	$('.slide-single .slide-body').on('mouseover', function(){
		var label = $('.play-label', this);
		var vid = $('video', this);
		$(this).mousemove(function(e) {
			if ($(vid).hasClass('pause')) {
				$(label).html('Play');
			} else {
				$(label).html('Pause');
			}
			$('.play-label', this).css(
				{'left': e.clientX - ($('.play-label', this).width() / 2),
				'top': e.clientY - ($('.play-label', this).height() / 2)
			}).addClass('show');
		});
	}).on('mouseout', function(){
		$('.play-label', this).removeClass('show');
	});

	$('.slide-single .slide-body').on('click', function(e){
		e.preventDefault();
		var vid = $('video', this);
		if ($(vid)[0].paused) {
			$(vid)[0].muted = 0;
			$(vid)[0].play();
			$(vid).removeClass('pause');
			$('.play-label', this).html('Pause');
		} else {
			$(vid)[0].pause();
			$(vid).addClass('pause');
			$('.play-label', this).html('Play');
		}
		return false;
	});
}


// pause videos
function pauseVideos(slides) {
	$('video', slides).each(function(){
		if ($(this).is('[autoplay]') && !$(this).hasClass('pause')) {
			$(this).addClass('pause');
			$(this)[0].pause();
		}
	});
	// check iframes
	var iframes = document.querySelectorAll('iframe');
	Array.prototype.forEach.call(iframes, function (iframes) {
		var src = iframes.src;
		iframes.src = src;
	});
}

// play videos
function playVideos(slides) {
	if ($(slides).hasClass('slide-single')) {
		$('video', this).each(function(){
			var vid = $(this);
			$(vid).removeAttr('muted').removeAttr('autoplay');
			$(vid)[0].pause();
		})
	} else {
		$('video', slides).each(function(){
			if ($(this).is('[autoplay]') || $(this).hasClass('pause')) {
				$(this).removeClass('pause');
				$(this)[0].play();
			}
		});
	}
}

// image preloading

function setAssetSize() {
	if (screen.width <= 800) { // even smaller screens
		deck.lbAssetSize = deck.assetSize_800;
		deck.lbClipSize = deck.clipSize_800;
	} else if (screen.width <= 1024) { // smaller screens
		deck.lbAssetSize = deck.assetSize_1024;
		deck.lbClipSize = deck.clipSize_1024;
	} else if (screen.width <= 1366) { // 11" macbook air
		deck.lbAssetSize = deck.assetSize_1366;
		deck.lbClipSize = deck.clipSize_1366;
	} else if (screen.width <= 1440) { // 15" macbook pro and 13" macbook air
		deck.lbAssetSize = deck.assetSize_1440;
		deck.lbClipSize = deck.clipSize_1440;
	} else if (screen.width <= 1680) { // 17" displays
		deck.lbAssetSize = deck.assetSize_1680;
		deck.lbClipSize = deck.clipSize_1680;
	} else if (screen.width <= 1920) { // 19-20" displays
		deck.lbAssetSize = deck.assetSize_1920;
		deck.lbClipSize = deck.clipSize_1920;
	} else if (screen.width <= 2560) { // 27" displays
		deck.lbAssetSize = deck.assetSize_2560;
		deck.lbClipSize = deck.clipSize_2560;
	} else if (screen.width <= 3840) {
		deck.lbAssetSize = deck.assetSize_3840;
		deck.lbClipSize = deck.clipSize_3840;
	} else {
		deck.lbAssetSize = deck.assetSize_max;
		deck.lbClipSize = deck.clipSize_max;
	}
	deck.lbVideoSize = deck.videoSize;
}

var preloadImageQueue = new Array();
function preloadAllElementImages(container, size_override){
	if(typeof size_override == 'undefined'){ size_override = deck.lbAssetSize; }
	$(container).find('img[filename]').each(function(i) {
		if ($(this).attr('data-original') == true) {
			$(this).attr('size_override', 'origgif');
		} else {
			$(this).attr('size_override', size_override);
		}
		preloadImageQueue.push($(this));
	});
	processPreloadImageQueue();
}
function processPreloadImageQueue(){
	var count = 0;
	while(preloadImageQueue.length > 0) {
		if(++count > deck.preloadImageLimit){ break; }
		preloadTheImage(preloadImageQueue.shift());
	}
}
function preloadTheImage(image_selector) {
	var offscreen = new Image();
	var image_source = image_selector.attr('filename');
	if(image_source) {
		var size_override = image_selector.attr('size_override');
		if(image_selector.hasClass('video') || image_selector.attr('type') == 'video'){ size_override = 'lg'; }
		if(typeof size_override == 'undefined'){ size_override = deck.lbAssetSize; }
		var fileName = /[^_]+$/.exec(image_source);
		var storage_url = (image_selector.attr('data-baseurl') ? image_selector.attr('data-baseurl') : deck.assetStorageURL);
		var $imageURL = storage_url+size_override+'_'+fileName;
			offscreen.onload = function(){
				image_selector.attr('src',$imageURL).removeAttr('filename').removeAttr('size_override').removeClass("loader");
				if(preloadImageQueue.length > 0) { preloadTheImage(preloadImageQueue.shift(), size_override); }
				$(document).trigger('core.imagePreloaded', image_selector);
				delete offscreen;
			}
			offscreen.onerror = function() {
				image_selector.attr('data-status', 'failed');
				if(preloadImageQueue.length > 0) { preloadTheImage(preloadImageQueue.shift(), size_override); }
				$(document).trigger('core.imagePreloaded', image_selector);
				delete offscreen;
			}
			offscreen.src = $imageURL;
	}
}
