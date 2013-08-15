define(function(require, exports, module){
var _ = require("underscore");
var arr = ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10','b11','b12','b13',
      'r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13',
      'm1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','m13',
      'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13'];
//module.exports = game;
module.exports = getMaxCards;

function game(){
  var r = new getMaxCards();
  return r;
}

function getMaxCards(){
  this._arr = [];
  this.r_str = "";
  this.r_arr = [];
  this.init();
}
getMaxCards.prototype.end = function(){
  //this.init();
  var a = this._arr.concat(this.r_arr).concat(this.r_str);
  return a;
}
getMaxCards.prototype.getResultsType = function(){
  return this.r_str;
}
getMaxCards.prototype.getResultsCards = function(){
  return this.r_arr; 
}
getMaxCards.prototype.getRandomCards = function(){
  return this._arr;
}
getMaxCards.prototype.randomCards = function(){
  var ran_arr = [];

  for (var i=0; i<7; i++){
    var ran_value = parseInt(Math.ceil(Math.random()* 51));
    if(ran_arr.indexOf(ran_value) === -1){
      ran_arr.push(ran_value);
      this._arr.push(arr[ran_value]);
    }else{
      i--;
    }
  }
  //for test result
  //this._arr = ['b2','m2','r2','f2','r1','r12','m12'];
  console.log("7张牌为：" + this._arr.join(' '));
}
getMaxCards.prototype.init = function(){
  //10000次测试速度
  var stime = new Date().getTime(); 
  //for(var j=0;j<1000;j++){

  //获取7张随机的牌

  this.randomCards();

  console.dir(this._arr);
  var _sarr = numberSort(this._arr);
  //console.log("大小排序后: " + _sarr.join(' '));

  var _mcolor = getMostSameColor( _sarr );

  //出结果
  if( _mcolor ){
    this.isSameColor( _mcolor );
  }else{
    var _nosnum = deleteSameNunmer(_sarr);
    //console.log("去掉重复大小后：" + _nosnum.join(' '));
    if( _nosnum.length >= 5 ){
      if( this.isSnake(_nosnum) ){
        
      }else{
        this.lastResult( numSort(_sarr) );
      }
    }else{
      this.lastResult( numSort(_sarr) );
    }
  }

  //end 10000次测试速度
  //}
  var etime = new Date().getTime();
  console.log("time use:" + (etime-stime));
}

//function lastResult(arr){
getMaxCards.prototype.lastResult = function(arr){
  var obj = {};
  var _arr = [];
  var tmp;
  var t1 = [],
    t2 = [],
    t3 = [],
    t4 = [];
  for(var i=0,l=arr.length; i<l; i++){
    if( !obj[getNum(arr[i])] ){
      obj[getNum(arr[i])] = [ arr[i] ];
    }else{
      obj[getNum(arr[i])].push( arr[i] );
    }
  }
  for(var key in obj){
    if ( key == '1'){
      //1比较特殊，记录下来
      tmp = obj[key];
    }else{
      switch (obj[key].length){
        case 1:
          t1 = obj[key].concat(t1);
          break;
        case 2:
          t2 = obj[key].concat(t2);
          break;
        case 3:
          t3 = obj[key].concat(t3);
          break;
        case 4:
          t4 = obj[key].concat(t4);
          break;
      }
    }
  }
  //将特殊的1插入
  if(tmp && tmp.length == 1){
    t1 = tmp.concat(t1);
  }else if(tmp && tmp.length == 2){
    t2 = tmp.concat(t2);
  }else if(tmp && tmp.length == 3){
    t3 = tmp.concat(t3);
  }else if(tmp && tmp.length == 4){
    t4 = tmp.concat(t4);
  }
  var winstr;
  if( t4.length == 4 ){
    winstr = "四条";
  }else if( t3.length >= 3 && t2.length >= 2 ){
    winstr = "葫芦";
  }else if( t3.length == 3 && t2.length == 0 ){
    winstr = "三条";
  }else if( t2.length >= 4 ){
    winstr = "两对";
  }else if( t2.length == 2 ){
    winstr = "一对";
  }else{
    winstr = "高牌";
  }
  _arr = t4.concat(t3).concat(t2).concat(t1);
  //蛋疼的2221的情况需要特殊处理
  //蛋疼的421的情况也要特殊处理
  if( t2.length == 6 || (t4.length == 4 && t2.length == 2) ){
    var _t = getNum(_arr[6]) == 1 ? _arr[6] : ( _arr[4] > _arr[6] ? _arr[4] : _arr[6] );
    _arr = _arr.slice(0,4).concat( _t );
  }else{
    _arr = _arr.slice(0,5);
  }
  console.log( winstr + _arr.join(' '));
  this.r_str = winstr;
  this.r_arr = _arr;
}
getMaxCards.prototype.isSameColor = function(arr){
  switch (arr.length){
    case 5:
      if( judgeSnake( arr ) ){
        this.printSameColor( arr, true );
      }else{
        this.printSameColor( arr );
      }
      break;
    case 6:
      if( judgeSnake( arr ) ){
        this.printSameColor( arr, true );
      }else{
        this.printSameColor( arr );
      }
      break;
    case 7:
      if( judgeSnake( arr ) ){
        this.printSameColor( arr, true );
      }else{
        this.printSameColor( arr );
      }
      break;
    default:
      console.log('error');
      break;
  }
}
getMaxCards.prototype.isSnake = function( arr ){
  var _result = false;
  switch (arr.length){
    case 5:
      if( judgeSnake( arr ) ){
        _result = true;
        this.printSnake(arr);
      }
      break;
    case 6:
      if( judgeSnake( arr ) ){
        _result = true;
        this.printSnake(arr);
      }
      break;
    case 7:
      if( judgeSnake( arr ) ){
        _result = true;
        this.printSnake(arr);
      }
      break;
  }
  return _result;
}
function judgeSnake( arr ){
  var _result = false;
  switch (arr.length){
    case 5:
      if( (getNum(arr[4]) - getNum(arr[0]) == 4) || (getNum(arr[0]) == 1 && getNum(arr[1]) == 10) ){
        _result = true;
      }
      break;
    case 6:
      if( (getNum(arr[4]) - getNum(arr[0]) == 4) || (getNum(arr[5]) - getNum(arr[1]) == 4) || (getNum(arr[0]) == 1 && getNum(arr[2]) == 10) ){
        _result = true;
      }
      break;
    case 7:
      if( (getNum(arr[4]) - getNum(arr[0]) == 4) || (getNum(arr[5]) - getNum(arr[1]) == 4) || (getNum(arr[6]) - getNum(arr[2]) == 4) || (getNum(arr[0]) == 1 && getNum(arr[3]) == 10) ){
        _result = true;
      }
      break;
  }
  return _result;
}
function equalColor(a, b){
  return a.charAt(0) === b.charAt(0);
}
function equalNumber(a, b){
  return a.substring(1) === b.substring(1);
}
function numberSort(arr){
  var _arr = _.clone(arr);
  _arr.sort(function(a,b){
    return parseInt(a.substring(1)) - parseInt(b.substring(1));
  });
  return _arr;
}
function numSort(arr){
  var _arr = _.clone(arr);
  _arr.sort(function(a,b){
    if( parseInt(a.substring(1)) == 1 ){
      return -1;
    }else{
      return parseInt(b.substring(1)) - parseInt(a.substring(1));
    }
  });
  return _arr;
}
function getMostSameColor(arr){
  var _arr;
  var tmp = {};
  var color;
  for(var i=0,l=arr.length; i<l; i++){
    color = arr[i].charAt(0);
    if(!tmp[color]){
      tmp[color] = [ arr[i] ];
    }else{
      tmp[color].push( arr[i] );
    }
  }
  for(var c in tmp){
    if(tmp[c].length >= 5){
      _arr = tmp[c];
    }
  }
  return _arr;
}
function getNum(s){
  return parseInt(s.substring(1));
}
//function printSnake(arr){
getMaxCards.prototype.printSnake = function(arr){
  switch( arr.length ){
    case 5:
      if(getNum(arr[0]) == 1 && getNum(arr[1]) == 10){
        arr = arr.slice(1).concat(arr[0]);
        console.log( "顺子：" + arr.join(' '));
      }else{
        console.log( "顺子：" + arr.join(' '));
      }
      this.r_str = "顺子";
      this.r_arr = arr;
      break;
    case 6:
      if(getNum(arr[0]) == 1 && getNum(arr[2]) == 10){
        arr = arr.slice(2).concat(arr[0]);
        console.log( "顺子：" + arr.join(' '));
      }else if(getNum(arr[5]) - getNum(arr[1]) == 4){
        arr.splice(0,1);
        console.log( "顺子：" + arr.join(' '));
      }else if(getNum(arr[4]) - getNum(arr[0]) == 4){
        arr.splice(5,1);
        console.log( "顺子：" + arr.join(' '));
      }
      this.r_str = "顺子";
      this.r_arr = arr;
      break;
    case 7:
      if(getNum(arr[0]) == 1 && getNum(arr[3]) == 10){
        arr = arr.slice(3).concat(arr[0]);
        console.log('顺子：' + arr.join(' '));
      }else if(getNum(arr[6]) - getNum(arr[2]) == 4){
        arr.splice(0,2);
        console.log('顺子：' + arr.join(' '));
      }else if(getNum(arr[5]) - getNum(arr[1]) == 4){
        arr = arr.slice(1,6);
        console.log('顺子：' + arr.join(' '));
      }else if(getNum(arr[4]) - getNum(arr[0]) == 4){
        arr.splice(5,2);
        console.log('顺子：' + arr.join(' '));
      }
      this.r_str = "顺子";
      this.r_arr = arr;
      break;
  }
}
//function printSameColor(arr, isth){
getMaxCards.prototype.printSameColor = function(arr, isth){
  switch( arr.length ){
    case 5:
      if(isth){
        if(getNum(arr[0]) == 1 && getNum(arr[1]) == 10){
          arr = arr.slice(1).concat(arr[0]);
          console.log( "同花顺：" + arr.join(' '));
        }else{
          console.log( "同花顺：" + arr.join(' '));
        }
        this.r_str = "同花顺";
        this.r_arr = arr;
      }else{
        console.log('同花：' + arr.join(' '));
        this.r_str = "同花";
        this.r_arr = arr;
      }
      break;
    case 6:
      if(isth){
        if(getNum(arr[0]) == 1 && getNum(arr[2]) == 10){
          arr = arr.slice(2).concat(arr[0]);
          console.log('同花顺：' + arr.join(' '));
        }else if(getNum(arr[5]) - getNum(arr[1]) == 4){
          arr.splice(0,1);
          console.log('同花顺：' + arr.join(' '));
        }else if(getNum(arr[4]) - getNum(arr[0]) == 4){
          arr.splice(5,1);
          console.log('同花顺：' + arr.join(' '));
        }
        this.r_str = "同花顺";
        this.r_arr = arr;
      }else if(getNum(arr[0]) == 1){
        arr.splice(1,1);
        console.log('同花：' + arr.join(' '));
        this.r_str = "同花";
        this.r_arr = arr;
      }else{
        arr.splice(0,1);
        console.log('同花：' + arr.join(' '));
        this.r_str = "同花";
        this.r_arr = arr;
      }
      break;
    case 7:
      if(isth){
        if(getNum(arr[0]) == 1 && getNum(arr[3]) == 10){
          arr = arr.slice(3).concat(arr[0]);
          console.log('同花顺：' + arr.join(' '));
        }else if(getNum(arr[6]) - getNum(arr[2]) == 4){
          arr.splice(0,2);
          console.log('同花顺：' + arr.join(' '));
        }else if(getNum(arr[5]) - getNum(arr[1]) == 4){
          arr = arr.slice(1,6);
          console.log('同花顺：' + arr.join(' '));
        }else if(getNum(arr[4]) - getNum(arr[0]) == 4){
          arr.splice(5,2);
          console.log('同花顺：' + arr.join(' '));
        }
        this.r_str = "同花顺";
        this.r_arr = arr;
      }else if(getNum(arr[0]) == 1){
        arr.splice(1,2)
        console.log('同花：' + arr.join(' '));
        this.r_str = "同花";
        this.r_arr = arr;
      }else{
        arr.splice(0,2);
        console.log('同花：' + arr.join(' '));
        this.r_str = "同花";
        this.r_arr = arr;
      }
      break;
  }
}
function deleteSameNunmer(arr){
  var _arr = [ arr[0] ];
  for(var i=0,l=arr.length; i<l-1; i++){
    if( !equalNumber(arr[i], arr[i+1]) ){
      _arr.push( arr[i+1] );
    }
  }
  return _arr;
}
});
