var stage = require('../../components/stage.vue');

var LEVEL = 0;
Zepto('<div id="container"></div>').appendTo('body');

var Game = new Vue({
    el: '#container',
    template: '<div id="1"><stage></stage></div>',
    components: {
        stage: stage
    }
});
