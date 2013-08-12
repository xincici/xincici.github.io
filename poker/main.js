$(function(){
  window['cookieObj'] = {
    setCookie: function(name,value){
      var Days = 365; //此 cookie 将被保存 1 天
      var exp = new Date();
      exp.setTime(exp.getTime() + Days*24*60*60*1000);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function(name){
      var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
      if(arr != null) return unescape(arr[2]); return null;
    },
    delCookie: function(name){
      var exp = new Date();
      exp.setTime(exp.getTime() - 1); 
      var cval = this.getCookie(name);
      if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    } 
  };
  function _init(){
    var cookieValue = cookieObj.getCookie('sValues');
    var _totalMoney, _perMoney;
    if(/^\d+\|\d+$/.test(cookieValue)){
      _totalMoney = cookieValue.split('|')[0];
      _perMoney = cookieValue.split('|')[1];
    }else{
        _totalMoney = 1000;
        _perMoney = 20;
    }
    $('.total-num').html( _totalMoney );
    $('.down-num').html( _perMoney );
  }
  function rc(val){
    cookieObj.setCookie('sValues', val);
  }
  _init();
  var arr = ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10','b11','b12','b13',
        'r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13',
        'm1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','m13',
        'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13'];
  //是否正在游戏
  var game = false;
  //是否正在显示牌背面
  var sback = false;
  //是否正在猜大小
  var guess = false;
  //是否正在发牌
  var dealing = false;
  //发牌次数计数
  var fnum = 0;
  //是否正在猜大小
  var sti;
  //赢牌型闪烁
  var _win = 0;
  //防止发牌重复保留数组
  var random_value = [];
  //帮助按钮被点击次数
  var count = 0;
  $(document).delegate('#main .control-area', 'click', function(e){
    var el = $(e.target);
    if(!guess){
      //发牌
      if(!dealing && el.hasClass('go')){
        game = true;
        //startJudge();
        //扣钱
        if(fnum < 2){
          var gum = parseInt($('#main .money-area .down').find('b').html());
          if(!sback){
            if(fnum < 1){
              var now = parseInt($('#main .money-area .total b').html()) - gum;
              $('#main .money-area .total b').html(now);
              rc(now + '|' + gum);
              el.html('继续');
            }
            fnum ++;
            dealCards();
          }
          //判断牌型是赢或输
          if(fnum == 2){
            el.html('开始');
            var unhold = $('#main .poker-area').find('.hold');
            var len = unhold.length;
            var d_st = setTimeout(function(){
              clearTimeout(d_st);
              //赢的继续操作
              var f_cards = cardsResult();
              var _gResult = gameResult(f_cards);
              if(_gResult >= 1){
                //牌消失，显示一下赢或输的提示
                $('#main .poker-area .pokers').fadeOut(400, function(){
                  $('#main .poker-area .win-result').fadeIn(100);
                });
                var __st = setTimeout(function(){
                  clearTimeout(__st);
                  //赢或输的提示消失，继续显示牌面
                  $('#main .poker-area .win-result').fadeOut(50, function(){
                    $('#main .poker-area .pokers').fadeIn(200, function(){
                      game = false;
                      _win = setInterval(function(){
                        switch (_gResult){
                          case 250:
                            $('#list .tonghuashun').toggleClass('hidden');
                            break;
                          case 60:
                            $('#list .sitiao').toggleClass('hidden');
                            break;
                          case 20:
                            $('#list .hulu').toggleClass('hidden');
                            break;
                          case 10:
                            $('#list .shunzi').toggleClass('hidden');
                            break;
                          case 7:
                            $('#list .tonghua').toggleClass('hidden');
                            break;
                          case 5:
                            $('#list .santiao').toggleClass('hidden');
                            break;
                          case 2:
                            $('#list .liangdui').toggleClass('hidden');
                            break;
                          case 1:
                            $('#list .yidui').toggleClass('hidden');
                            break;
                        }
                      },400);
                    });
                  });
                },1000);
                $('#main .money-area .money').find('b').html(gum * _gResult)
                game = false;
                startJudge();
                random_value = [];
                guess = true;
              }
              //输的继续操作
              else{
                var _st = setTimeout(function(){
                  clearTimeout(_st);
                  $('#main .poker-area .back').fadeOut(50, function(){
                    $('#main .poker-area .lose-result').fadeIn(200, function(){
                      var __st = setTimeout(function(){
                        clearTimeout(__st);
                        $('#main .poker-area .lose-result').fadeOut(100, function(){
                          $('#main .poker-area .back').fadeIn(200, function(){
                            random_value = [];
                            fnum = 0;
                            game = false;
                            guess = false;
                            showBack();
                          });
                        });  
                      },1500);
                    });
                  });
                },1500);
              }
            },len * 300 + 300);
          }
        }
      }
    }
    //算账
    if(el.hasClass('get')){
      if(!game && fnum == 2){
        var current = parseInt($('#main .money-area .total').find('b').html());
        var win = parseInt($('#main .money-area .money').find('b').html());
        $('#main .money-area .total').find('b').html(current + win);
        rc((current + win) + '|' + parseInt($('#main .money-area .down').find('b').html()));
        $('#main .money-area .money').find('b').html('0');
        clearInterval(sti);  
        guess = false;
        game = false;
        fnum = 0;
        clearInterval(_win);
        if($('#list .hidden').length != 0){
          $('#list .hidden').removeClass('hidden');
        }
        $('#main .poker-area .win-result').fadeOut(50, function(){
          $('#main .poker-area .back').fadeIn(200);
        });
        $('#main .judge-area .win-lose').html(' ');
        $('#main .judge-area .result').html(' ');
        showBack();
        random_value = [];
      }
    }
  });
  //选择保留
  $(document).delegate('#main .poker-area', 'click', function(e){
    var el = $(e.target);
    if(!dealing && fnum == 1 && el.hasClass('back')){
      el.toggleClass('hold');
    }
  });
  $(document).delegate('#main .judge-area', 'click', function(e){
    var el = $(e.target);
    //猜大小结果判断
    if(guess && el.hasClass('big')){
      clearInterval(sti);
      var val = parseInt($(this).find('.result').html());
      var win = parseInt($('#main .money-area .money').find('b').html());
      if(val >= 8){
        $(this).find('.win-lose').html('赢');
        $('#main .money-area .money').find('b').html(win * 2);
        clearInterval(sti);  
        var stt = setTimeout(function(){
          clearTimeout(stt);
          if(guess){
            startJudge();
          }
        },1500);
      }
      else{
        showLose();
      }
    }
    else if(guess && el.hasClass('small')){
      var val = parseInt($(this).find('.result').html());
      var win = parseInt($('#main .money-area .money').find('b').html());
      if(val <= 7){
        $(this).find('.win-lose').html('赢');
        $('#main .money-area .money').find('b').html(win * 2);
        clearInterval(sti);  
        var stt = setTimeout(function(){
          clearTimeout(stt);
          if(guess){
            startJudge();
          }
        },1500);
      }
      else{
        showLose();
      }
    }
  });
  //赌注加大减小
  $(document).delegate('#main .money-area .down', 'click', function(e){
    var el = $(e.target);
    var num = parseInt($(this).find('.down-num').html());
    if(!game && el.hasClass('lower') && num > 1){
      $(this).find('.down-num').html(num - 1);
    }
    else if(!game && el.hasClass('higher') && num < 99){
      $(this).find('.down-num').html(num + 1);
    }
  }).delegate('#main .money-area .help', 'click', function(e){
    if(count < 4){
      count ++;
      alert('点击开始按钮发牌，第一次发牌后点击牌可以选择保留该牌，再次点击发牌会替换掉未被保留的牌，形成最终牌型，'
      + '当有四条，或同花，或葫芦，或顺子，或三条，或两对，或大于一对8的牌型时胜利，可选择继续猜大小，'
      + '猜对则奖金加倍，猜错则奖金清零，也可以随时选择结算奖金。');
    }
    else{
      count = 0;
      alert('乖老婆真听话，想我不？');
      $('#clear').fadeIn(8000,function(){
        $(this).bind('click', function(){
          clearInterval(ss_tt);
          clearInterval(sss_tt);
          var st = setTimeout(function(){
            $('#p1').fadeOut(1000);
            $('#p2').fadeOut(1000);
          },2500);
          $(this).fadeOut(1000);
          iii = 1;
          iiii = 1;
        });
      });
      var iii = 1;
        //_iii = 200;
      var iiii = 1;
        //_iiii = 280;
      var ss_tt = setInterval(function(){
        if(iii <= 9){
          var _iii = parseInt(Math.random() * 800);
          var __iii = parseInt(Math.random() * 400);
          $('#p1').fadeOut(1000, function(){
            $('#p1').css('background-image', 'url("images/pictures/1-'+ iii +'.jpg")');
            $('#p1').css({'left': _iii + 'px','top': __iii + 'px'});
            $('#p1').fadeIn(1000);
            iii ++;
          });
        }
        else{
          iii = 1;
        }
      },3500);
      var sss_tt = setInterval(function(){
        if(iiii <= 12){
          var _iiii = parseInt(Math.random() * 800);
          var __iiii = parseInt(Math.random() * 400);
          $('#p2').fadeOut(1000, function(){
            $('#p2').css('background-image', 'url("images/pictures/2-'+ iii +'.jpg")');
            $('#p2').css({'left': _iiii + 'px','top': __iiii + 'px'});
            $('#p2').fadeIn(1000);
            iiii ++;
          });
        }
        else{
          iiii = 1;
        }
      },3000);
    }
  });
  //猜大小
  function startJudge(){
    sti = setInterval(function(){
      var val = parseInt(Math.ceil(Math.random()*13));
      $('#main .judge-area .result').html(val);
    },100);
  }
  //显示牌背面
  function showBack(){
    sback = true;
    var __cards = $('#main .poker-area').find('.back');
    var len = __cards.length;
    var i = 0;
    var _sti = setInterval(function(){
      i++;
      if(i <= len){
        $(__cards[i-1]).addClass('hold');
        $(__cards[i-1]).css('background-image', 'url(\"images/back.png\")');
      }
      else{
        clearInterval(_sti);
        //game = false;
        sback = false;
      }
    },300);
  }
  //发牌
  function dealCards(){
    dealing = true;
    var __cards = $('#main .poker-area').find('.hold');
    var len = __cards.length;
    var i = 0;
    var _sti = setInterval(function(){
      i++;
      if(i <= len){
        var r_value = parseInt(Math.ceil(Math.random()* 51));
        for(var m=0; ; m++){
          if($.inArray(r_value, random_value) == -1){
            random_value.push(r_value);
            break;
          }
          else{
            r_value = parseInt(Math.ceil(Math.random()* 51));
          }
        }
        var rcard = arr[r_value];
        $(__cards[i-1]).css('background', 'none');
        $(__cards[i-1]).css('background-image', 'url(\"images/'+ rcard +'.png\")');
      }
      else{
        clearInterval(_sti);
        dealing = false;
      }
    },300);
  }
  //获取最终牌型
  function cardsResult(){
    var finalCards = [];
    for(var i=0; i<5; i++){
      var s = $($('#main .poker-area .back')[i]).css('background-image');
      var str = s.split('/')[s.split('/').length - 1];
      //var m = s.indexOf('/stylesheets/images/');
      //var n = s.indexOf('\.png');
      //var r = s.substring(m+7,n);
      var r = str.substring(0,str.indexOf('\.png'));
      finalCards.push(r);
    }
    return finalCards;
  }
  //游戏胜负结果
  function gameResult(finalCards){
    if(finalCards.length != 5) return;
    var type = [];
    var _number = [];
    for(var i=0; i<5; i++){
      type.push(finalCards[i].charAt(0));
      _number.push(parseInt(finalCards[i].substring(1)));
    }
    var number = insertSort(_number);
    if(type[0] == type[1] && type[0] == type[2] && type[0] == type[3] && type[0] == type[4]){
      //同花顺
      if(number[4] - number[0] == 4){
        return 250;
      }
      //同花
      else return 7;
    }
    if(number[0] != number[1] && number[1] != number[2] && number[2] != number[3] && number[3] != number[4]){
      //顺子
      if((number[4] - number[0] == 4) || (number[0] == 1 && number[1] == 10)){
        return 10;
      }
      //什么也不是
      else return 0;
    }
    //四条
    if(number[0] == number[3] || number[1] == number[4]){
      return 60;
    }
    //葫芦
    if((number[0] == number[2] && number[3] == number[4]) || (number[0] == number[1] && number[2] == number[4])){
      return 20;
    }
    //三条
    if(number[0] == number[2] || number[1] == number[3] || number[2] == number[4]){
      return 5;
    }
    //两对
    if((number[0] == number[1] && (number[2] == number[3] || number[3] == number[4])) || (number[1] == number[2] && number[3] == number[4])){
      return 2;
    }
    //大于8一对
    if((number[1] == 1) || (number[0] == number[1] && number[0] >= 8) || (number[1] == number[2] && number[1] >= 8) || (number[2] == number[3] && number[2] >= 8) || (number[3] == number[4] && number[3] >= 8)){
      return 1;
    }
  }
  //猜大小输调用
  function showLose(){
    $('#main .judge-area').find('.win-lose').html('输');
    $('#main .money-area .money').find('b').html('0');
    clearInterval(sti);  
    guess = false;
    game = false;
    clearInterval(_win);
    if($('#list .hidden').length != 0){
      $('#list .hidden').removeClass('hidden');
    }
    showBack();
    fnum = 0;
    var _stt = setTimeout(function(){
      clearTimeout(_stt);
      $('#main .judge-area .win-lose').html(' ');
      $('#main .judge-area .result').html(' ');
    },2000);
  }
  //排序
  function insertSort(iin){
    var out = [];
    var j = iin[0];
    var m = 0;
    for(var con=0; con<5; con ++){
      for(var i=1; i<iin.length; i++){
        if(j > iin[i]){
          j = iin[i];
          m = i;
        }
      }
      out.push(iin[m]);
      iin.splice(m,1);
      m = 0;
      j = iin[0];
    }
    return out;
  }
});
