(function(win){
	/*公共方法*/
	// var tapEvt = 'ontouchstart' in document? 'touchstart': 'click';
	// var classNames = ['rft', 'bfr', 'lfb', 'tfl'];
	// var map = {
	// 	'line-right': 'bfr',
	// 	'line-bottom': 'lfb',
	// 	'line-left': 'tfl',
	// 	'line-top': 'rft'
	// };

	/*
		0:  light or battery or nonexit, A\B\0;  + lighten, - darken
		1: topLine, 1 exit 0 nonexit, + -
		2: rightLine
		3: bottomLine
		4: leftLine
	*/

/**/
    var eventHub = new Vue();

	win.Levels = Vue.extend({});
})(window)