<template>
    <div id="container" v-cloak>
        <header>
            <div class="fl">
                <span class="icon-pic icon-clock vertical-m"></span>
                <span class="vertical-m">{{time}}</span>
            </div>
            <div class="fr">

                第 {{level+1}} 关
            </div>
            <div v-show="isInSuccess" @click="goNextLevel" class="success-tip">
                <div class="backdrop"></div>
                <div class="content">
                    <span>恭喜过关。点击进入第{{level+2}}关 &gt</span>
                    <span class="only-vertical-align"></span>
                </div>
            </div>
        </header>
        <section id="field">
            <ul class="grid-list" v-bind:style="{ 'width': col*4+'rem'}">
                <grid v-for="(grid, index) in mapData" :sign="grid.sign" :rotate="grid.rotate" :lighted="grid.lighted" :index="index"></grid>
            </ul>
        </section>
        <footer>
            <div class="fl">
                <i class="iconfont icon-stop"></i>&nbsp;
                <i class="iconfont icon-refresh" @touchstart="resetLevelData"></i>
            </div>
            <div class="fr">
                <i class="iconfont icon-voice" @touchstart="switchVoice"></i>
            </div>
        </footer>
    </div>
</template>
<script>
var gridCpn = require('./grid.vue');
var MAP = require('../js/map-data.js');
var PowerFn = require('../js/power-fn.js');

module.exports = {
    data: function(){
        this.level = Number(sessionStorage.LEVEL || '0');
        var oneLevelData = MAP[this.level];
        var copyData =  oneLevelData.data.slice();
        this.originData =  oneLevelData.data.slice()
        return {
            level: this.level,
            col: oneLevelData.col,
            time: oneLevelData.time,
            timeout: oneLevelData.timeout,
            mapData: copyData,
            batteryIndex: PowerFn.getBatteryIndex(oneLevelData.data),
            lightCount: PowerFn.getLightLen(oneLevelData.data),
            lightIndexs: PowerFn.getLightIndexs(oneLevelData.data),
            isInSuccess: false
        }
    },
    components: {
        grid: gridCpn
    },
    created: function() {
        var me = this;
        Global.eventHub.$on('rollGrid', function(signOpt) {
            me.rollGrid(signOpt.index)
        });
        this.parseLighted();
        this.countdown();
    },
    methods: {
        goNextLevel: function(){
            this.level++;
            sessionStorage.LEVEL = this.level;
            this.isInSuccess = false;
        },
        resetLevelData: function(){
            this.mapData = this.originData.slice();
        },
        switchVoice: function(){

        },
        countdown: function() {
            var me = this;
            this.timer = setInterval(function() {
                if (!me.timeout && !me.isInSuccess) {
                    me.time--;
                    if (me.time <= 0) {
                        me.timeout = true;
                    }
                }

            }, 1000);
        },
        judgeSuccess: function(){
            var me = this;
            var isSuccess = true;

            for(var i=0, len=this.lightIndexs.length; i<len; i++ ){
                var index = this.lightIndexs[i];
                if(!this.mapData[index].lighted){
                    isSuccess = false;
                    i = len;
                }
            }
            return isSuccess;
        },
        rollGrid: function(index){

            var rotate = ++this.mapData[index].rotate;
            var sign = this.mapData[index].sign;
            var realSign = PowerFn.signTurn(sign, rotate);

            Vue.set(this.mapData, index, {
                lighted: false,
                rotate: rotate,
                sign: sign,
                turnSign: realSign
            });
            this.parseLighted();

        },
        resetLevel: function() {

        },

        parseLighted: function() {
            var me = this;
            var activeGrids = PowerFn.getConnectedLines(this.mapData, this.col, this.batteryIndex);
            var adjust = {};
            this.mapData.forEach(function(item, index) {
                if (activeGrids.indexOf(index) > -1) {
                    // 在亮灯的索引里
                    if (!item.lighted) {
                        adjust[index] = {
                            lighted: true,
                            turnSign: item.turnSign,
                            sign: item.sign,
                            rotate: item.rotate

                        }
                    }
                } else {
                    if (item.lighted) {
                        adjust[index] = {
                            lighted: false,
                            turnSign: item.turnSign,
                            sign: item.sign,
                            rotate: item.rotate
                        }
                    }
                }
            });
            for (var attr in adjust) {
                Vue.set(me.mapData, attr, adjust[attr])
            }
            if (this.judgeSuccess()) {
                this.isInSuccess = true;
            }
        }
    },
    watch: {
        'level': function() {
            var me = this;
            var theMap = PowerFn.deepCopyOfObjarr(MAP[this.level].data);

            this.col = MAP[this.level].col;
            this.time = MAP[this.level].time;

            this.lightCount = PowerFn.getLightLen(theMap);
            this.batteryIndex = PowerFn.getBatteryIndex(theMap);
            theMap.forEach(function(item, index) {
                Vue.set(me.mapData, index, item);
            });
            this.lightIndexs = PowerFn.getLightIndexs(me.mapData)

            setTimeout(function() {
                me.parseLighted();
            }, 300)
        },
        timeout: function() {
            var me = this;
            if(!me.timeout)return;
            if (confirm('时间用完了')) {
                debugger;
                me.mapData = me.originData.slice();
                me.time = 10;
                me.timeout = false;
            }
        }
    }
};
    
</script>