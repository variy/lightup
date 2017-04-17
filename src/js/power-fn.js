
var linePointMap = {
    '1': '3',
    '3': '1',
    '2': '4',
    '4': '2'
};

var posDisMap = {
    '1': '4',
    '-1': '2',
    '4': '1',
    '-4': '3'
};
module.exports = {
    deepCopyOfObjarr: function(arr){
        var newArr = [];
        arr.forEach(function(item){
            newArr.push(Zepto.extend({}, item));
        });

        return newArr;
    },
    signTurn: function(sign, times){
        var lineSign = sign.slice(1);
        var lineLen = lineSign.length;
        var realTimes = times%lineLen;
        
        var  i = 0;
        while(i < realTimes){
            lineSign = lineSign.slice(-1) + lineSign.slice(0, -1);
            i++;
        }
        return sign[0] + lineSign;
    },
    getBatteryIndex: function(list){
        for (var i = 0, len=list.length; i < len; i++) {
            if( (list[i].sign)[0] === 'B'){
                return i;
            }
        };
        throw Error("can't find battery's index")
    },

    getLightIndexs: function(list){
        var arr = [];
        list.forEach(function(item, i){
            if(item.sign[0] === 'A'){
                arr.push(i);
            }
        });
        return arr;
    },
    getLightLen: function(list){
        var i = 0;
        list.forEach(function(item){
            if(item.sign[0] === 'A'){
                i++;
            }
        });
        return i;
    },
    isPassLevel: function(map, indexArr){
        indexArr.forEach(function(index){
            if(!map[index].lighted){
                isSuccess = false;
            }
        });
        return true;
    },
    getConnectedLines: function(map, col, batteryIndex){
        var gridCount = map.length;

        // fromPos => -1 电源初始
        var getNext = function(pos, fromPos){

            var nextArr = [];

            var sign = map[pos].turnSign;

            var matchDirNum = -1;
            if(fromPos !== -1){
                var disMark = (pos - fromPos) + '';
                matchDirNum = Number(posDisMap[disMark]);
            }

            var pushNext = function(nextPos, fromDir){
                var thatSign = map[nextPos].turnSign;
                var thatMatchDir = linePointMap[fromDir];
                if(thatSign[thatMatchDir] === '1'){
                    nextArr.push(nextPos);
                }
            }

            for (var i = 1, len=sign.length; i < len; i++) {
                if( sign[i] !== '1' || i === matchDirNum)continue;
                if (i === 1) {
                    if (pos >= col) {
                        pushNext(pos-col, i)
                    }

                } else if (i === 2) {
                   
                    if ((pos + 1) % col !== 0 ) {
                        pushNext(pos + 1, i)
                    }

                } else if (i === 3) {
                   
                    if (pos + col < gridCount) {
                        pushNext(pos + col, i)
                    }

                } else if (i === 4) {
                    if(pos%col !== 0){
                        pushNext(pos - 1, i)
                    }
                }
                

            };

            return nextArr;
        }
 
        var getLines = function(linkArr, lines){
            if(linkArr.length === 0)return lines;
            
            var newLinkArr = [];
            linkArr.forEach(function(item){
                var inLen = item.length;
                var pos = item[inLen-1];
                var fromPos = inLen > 1 ? item[inLen-2] : -1;
                var nextArr = getNext(pos, fromPos);
                if(nextArr.length > 0){
                    nextArr.forEach(function(point){
                        if( item.indexOf(point) > -1 ){
                            lines.push(item);
                        }else{
                            var newLink = item.slice();
                            newLink.push(point)
                            newLinkArr.push(newLink);
                        }
                            
                    })
                }else{
                    lines.push(item);
                }
            });

            return getLines(newLinkArr, lines);
        }

        var lines = getLines([[batteryIndex]], []);
        
        // 转化成连接起来的点
      
        var getConnectedGrids = function(lines) {
            var gridObj = {},
                gridArr = [];
            for(var i=0, len=lines.length; i< len; i++){
                for(var j=0, inLen=lines[i].length; j < inLen; j++){
                    var item = lines[i][j];
                    if( !(item in gridObj)){
                        gridObj[item] = '1';
                    }
                }
            }

            for(var attr in gridObj){
                gridArr.push(Number(attr));
            }

            return gridArr;
        }
        return getConnectedGrids(lines);
   
    }
}