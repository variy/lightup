<template>
    <li :class="'grid '+ (lighted?'lighted':'')" @touchstart="roll">
        <p class="line-group" :style="{transform: rotation}" :data-rotate="rotate">
            <i v-if="topLine" class="line line-top"></i>
            <i v-if="rightLine" class="line line-right"></i>
            <i v-if="bottomLine" class="line line-bottom"></i>
            <i v-if="leftLine" class="line line-left"></i>
        </p>

        <span v-if="hasLight" class="iconfont icon-light icon-light-grid"></span>
        <span v-if="hasBattery"  class="iconfont icon-power icon-battery-grid"></span>
        <span  class="line only-for-zhuang"></span>
    </li>
</template>
<script>
module.exports = {
    props: {
        sign: {
            type: String,
            required: true
        },
        rotate: {
            type: Number,
            required: true
        },
        lighted: {
            type: Boolean
        },
        index: {
            type: Number
        }
    },
    data: function() {
        return {
            hasLight: this.sign[0] === 'A',
            hasBattery: this.sign[0] === 'B',
            topLine: this.sign[1] === '1',
            rightLine: this.sign[2] === '1',
            bottomLine: this.sign[3] === '1',
            leftLine: this.sign[4] === '1',
            rotation: 'rotate3d(0,0,0)'
        }
    },
    methods: {
        roll: function() {
            Global.eventHub.$emit('rollGrid', {
                index: this.index
            });
        },
        parseData: function() {

            this.hasLight = this.sign[0] === 'A';
            this.hasBattery = this.sign[0] === 'B';
            this.topLine = this.sign[1] === '1';
            this.rightLine = this.sign[2] === '1';
            this.bottomLine = this.sign[3] === '1';
            this.leftLine = this.sign[4] === '1';
        }
    },
    watch: {
        'sign': function() {
            this.parseData();
        },
        'rotate': function() {
            this.rotation = 'rotateZ(' + this.rotate * 90 + 'deg)';
        }
    }
};
</script>