var deck = {
	container: false, // the jQuery object for the slides container
	slides: false, // the jQuery collection of slides
	count: 0, // the number of slides
	index: null, // the slide that is currently scrolling away
	page: null, // the slide that is most in view to the user
	slideHeight: 0, // the height of a single slide in px which matches the window height
	spacerSize: 0.5, // the height of the spacers between slides as a fraction of window height
	slideDistance: 0, // the combined height of slide content and spacer in px
	switchPoint: 0.65, // a fraction of the slide height used to decide which slide is most in view
	offset: 0, // the current scroll position in px
	timestamp: null, // tracking time of scroll as well as position in order to calculate speed
	speed: 1200, // time in ms to switch slides using the keyboard arrows
	lbAssetSize: 'gl', // the image prefix which will be selected based on screen size
	preloadImageLimit: 5, // number of images to load simultaneously
	minViewTime: 1000, // the time in ms spent on a slide before the hash will update and the slide will count as viewed
	updateTimeout: false, // timeout function to update the url hash
	maxScrollSpeed: 15, // px/ms if the user scrolls faster than this we fade the content during the scroll
	fadeTimeout: false, // timeout to fade the content back in after the scroll slows again
	// default image prefixes per screen size
	assetSize_800: 'ml',
	assetSize_1024: 'gs',  					
	assetSize_1366: 'gm',
	assetSize_1440: 'gm',
	assetSize_1680: 'gl',
	assetSize_1920: 'gxl',
	assetSize_2560: 'gxxl',
	assetSize_3840: 'gxxl',
	assetSize_max: 'gxxl',
	clipSize_800: 'lgclip',
	clipSize_1024: 'lgclip',  					
	clipSize_1366: 'hdclip',
	clipSize_1440: 'hdclip',
	clipSize_1680: 'fullhdclip',
	clipSize_1920: 'fullhdclip',
	clipSize_2560: '2kclip',
	clipSize_3840: '4kclip',
	clipSize_max: '8kclip',
	videoSize: 'video'
};