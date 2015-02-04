/*
 * jquery辅助校验
 * author: yelin, linye1987@sina.com 
 * date: 2013-07-11
 */
;(function( $, window, undefined ){
    $.fn.jVerify = function( opts ){
        /*
        opts = {
            type : string          //期望类型
            ,emptyOk : boolean       //是否可以为空
            ,tipMsg : string        //输入提示信息
            ,emptyMsg : string      //空白的提示信息
            ,minValue : number      //当为int型时所能输入的最小值
            ,maxValue : number      //当为int型时所能输入的最大值
            ,warnMsg : string       //警告信息
            ,maxLength : number     //最大长度
            ,minLength : number     //最小长度
            ,vEvent : event type     //触发校验的事件 默认为ie:propertychange;other:input
            ,warnElement : Object       //提示信息显示容器
            ,tipMsgInit : boolean       //初始化时是否显示提示信息
            ,relationElement : Object   //type为confirmpsw确认密码时的相关元素
            ,customRegExp : String 		//自定义校验正则
            ,spaceOk : boolean			//是否可以包含空格
            ,spaceTips : String			//包含空格的提示信息
        }
        */
        var self = this;
        var isIE = (function(){
            var v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
            //通过IE检测HTML条件注释方式
            //循环判断IE浏览器当前支持版本
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
            return v > 4 ? v : undefined;
        })();
        var hasFocus = false;
        this._val;
        var _opt = {
            type : opts.type ? opts.type.toLowerCase() : 'string'
            ,emptyOk : opts.emptyOk ? true : false
            ,tipMsg : opts.tipMsg ? opts.tipMsg : ""
            ,emptyMsg : opts.emptyMsg ? opts.emptyMsg : "不能为空"
            ,warnMsg : opts.warnMsg ? opts.warnMsg : ""
            ,warnMsg1 : opts.warnMsg1 ? opts.warnMsg1 : ""
            ,maxValue : opts.maxValue
            ,minValue : opts.minValue
            ,maxLength : opts.maxLength
            ,minLength : opts.minLength
            ,vEvent : opts.vEvent ? opts.vEvent.toLowerCase() : ( isIE && isIE <= 9 ? 'propertychange' : 'input')
        	,customRegExp : opts.customRegExp ? opts.customRegExp : false
            ,warnElement : opts.warnElement
            ,tipMsgInit : opts.tipMsgInit ? true : false
            ,relationElement : opts.relationElement
            ,callback : opts.callback ? opts.callback : null
            ,errorback : opts.errorback ? opts.errorback : null
            ,blurback : opts.blurback ? opts.blurback : null
            ,noInit : opts.noInit ? true : false
            ,spaceOk : opts.spaceOk ? true : false
            ,spaceTips : opts.spaceTips ? opts.spaceTips : '不能包含空格'
        };
        if( !self.attr('placeholder') ){
            if( _opt.tipMsg ){
                self.attr('placeholder', _opt.tipMsg);
                _opt.tipMsgInit = false;
            }
        }
        this.on('focus', function(){
            hasFocus = true;
        	$(this).css('background-color', '#fff');
        	if( /\s/.test(self.val()) && !_opt.spaceOk ){
            	_opt.warnElement && _opt.warnElement.html( '' + _opt.spaceTips ).css('color', '#f00');
            	self.data('status', false);
            	return;
            }
            var val = $.trim( self.val() );
            self._val = $.trim( self.val() );
            var _checkVal = self.getResult();
            if( val == "" ){
                // resove the stupid need
                //_opt.warnElement && _opt.warnElement.html( _opt.tipMsg ).css('color', '#999');
            }else if( _checkVal === 100 ){
                if( _opt.type !== 'psw' && _opt.type !== 'confirmpsw' ){
                    _opt.warnElement && _opt.warnElement.html( '√&nbsp;' ).css('color', '0c0');
                }
                if( typeof _opt.callback === 'function' ){
                    _opt.callback();
                }
            }else if( _checkVal === 4 ){
            	
            }else{
                _opt.warnElement && _opt.warnElement.html( '' + _opt.warnMsg ).css('color', 'f00');
            }
        });
        this.on(_opt.vEvent, checkValue);
        this.on('blur', blurHandler);
        function blurHandler(e){
            checkValue(e);
            hasFocus = false;
        }
        function checkValue(e){
            //解决因按tab键获取焦点后会触发这个输入框的keyup事件问题
            if(e.keyCode == 9) return;
            self._val = self.val();
            if( /\s/.test(self._val) && !_opt.spaceOk ){
            	_opt.warnElement && _opt.warnElement.html( '' + _opt.spaceTips ).css('color', '#f00');
            	self.data('status', false);
            	return;
            }
            var result = self.getResult();
            switch (result){
                case 0:
                    if( _opt.emptyOk ){
                    	_opt.warnElement && _opt.warnElement.html( '' );
                        self.data('status', true);
                    }else if( !_opt.emptyOk ){
                        if( !hasFocus ){ //for the ie 10,11 placeholder set bug
                            self.data('status', false);
                        }else{
                        	_opt.warnElement && _opt.warnElement.html( '' + _opt.emptyMsg ).css('color', '#f00');
                            self.data('status', false);
                        }
                    }else{
                        //alert( _opt.emptyMsg );
                    }
                    break;
                case 1:
                case 2:
                    if( _opt.warnElement ){
                        _opt.warnElement.html( '' + _opt.warnMsg ).css('color', '#f00');
                    }else{
                        //alert( _opt.warnMsg );
                    }
                    self.data('status', false);
                    break;
                case 3:
                    if( _opt.warnElement ){
                        _opt.warnElement.html( '' + _opt.warnMsg ).css('color', '#f00');
                    }else{
                        //alert( _opt.warnMsg );
                    }
                    self.data('status', false);
                    break;
                case 4:
                    if( _opt.warnElement ){
                        _opt.warnElement.html( _opt.warnMsg1 ).css('color', '#f00');
                    }else{
                        //alert( _opt.warnMsg1 );
                    }
                    self.data('status', false);
                    break;
                case 100:
                    if( _opt.warnElement ){
                        _opt.warnElement.html('√&nbsp;').css('color', '#0c0');
                    }else{
                        //alert('√');
                    }
                    self.data('status', true);
                    break;
            }
            if( self.data('status') && typeof _opt.callback === 'function' ) {
                //_opt.warnElement && _opt.warnElement.html('<img style="vertical-align:middle;" src="../images/loading.gif" />');
                _opt.callback();
            }
            if( !self.data('status') && typeof _opt.errorback === 'function' ) {
                //_opt.warnElement && _opt.warnElement.html('<img style="vertical-align:middle;" src="../images/loading.gif" />');
                _opt.errorback();
            }
            if( self.data('status') && e.type === 'blur' && typeof _opt.blurback === 'function' ){
            	_opt.blurback();
            }
        }
        function _check(type, str){
            if(str === undefined || str.length === 0) return 0;
            switch (type){
                case 'string':
                    if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    return 100;
                    break;
                case 'id':
                	if( !checkID(str) ) return 3;
                    //if( !(/^[0-9]{17}[0-9xX]$/.test(str) || /^[0-9]{15}$/.test(str)) ) return 3;
                    //if(_opt.minValue && parseInt(str, 10) < _opt.minValue) return 1;
                    //if(_opt.maxValue && parseInt(str, 10) > _opt.maxValue) return 2;
                    if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    return 100;
                    break;
                case 'int':
                    if(!/^[0-9]{0,}$/.test(str)) return 3;
                    if(_opt.minValue && parseInt(str, 10) < _opt.minValue) return 1;
                    if(_opt.maxValue && parseInt(str, 10) > _opt.maxValue) return 2;
                    if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    return 100;
                case 'mobile':
                    if(!/^1[0-9]{10}$/.test(str)) return 3;
                    return 100;
                    break;
                case 'email':
                	if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    var reg = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    //fuck focus.cn email address
                    if(str.split('@')[1] === 'focus.cn'){
                    	reg = /^[a-zA-Z0-9\u4e00-\u9fff][a-zA-Z0-9\u4e00-\u9fff._-]{0,}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    }
                    return  reg.test(str)? 100 : 3;
                    break;
                 case 'emailprefix':
                	if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    var reg = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,}$/;
                    return  reg.test(str)? 100 : 3;
                    break;
                case 'psw':
                	if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    return 100;
                    break;
                case 'confirmpsw':
                    if(_opt.minLength && str.length < _opt.minLength) return 1;
                    if(_opt.maxLength && str.length > _opt.maxLength) return 2;
                    if(_opt.relationElement && (_opt.relationElement.val() === '' || _opt.relationElement.val() === str)) return 100;
                    if(_opt.relationElement && _opt.relationElement.val() !== '' && _opt.relationElement.val() !== str) return 4;
                    return 100;
                    break;
                case 'custom':
                	if( _opt.customRegExp && !_opt.customRegExp.test(str) ) return 3;
                	return 100;
                	break;
            }
        }
        function checkID( str ){
        	if( !(/^[1-9][0-9]{16}[0-9xX]$/.test(str) || /^[1-9][0-9]{14}$/.test(str)) ) return false;
        	var year,month,date;
        	if( str.length === 15 ){
        		year = parseInt( '19' + str.substr(6,2), 10 );
        		month = parseInt( str.substr(8,2), 10 );
        		date = parseInt( str.substr(10,2), 10 );
        	}else{
        		year = parseInt( str.substr(6,4), 10 );
        		month = parseInt( str.substr(10,2), 10 );
        		date = parseInt( str.substr(12,2), 10 );
        	}
        	if( month < 1 || date < 1 || month > 12 || date > 31 ) return false;
        	if( month == 4 || month == 6 || month == 9 || month == 11 ){
        		if( date > 30 ) return false;
        	}
        	if ( month == 2 ){
        		if( (year%4 == 0 && year%100 != 0) || (year%100 == 0 && year%400 == 0) ){
        			if( date > 29 ) return false;
        		}else{
        			if( date > 28 ) return false;
        		}
        	}
        	return true;
        }
        this.getResult = function(){
            return _check(_opt.type, self._val);
        };
        this._init = function(){
            self._val = $.trim( self.val() );
            var _checkVal = self.getResult();
            if( self._val !== '' && _opt.noInit && _checkVal === 100 ){
            	self.data('status', true);
                return;
            }
            if( _checkVal === 100 ){
                _opt.warnElement && _opt.warnElement.html( '√&nbsp;' ).css('color', '#0c0');
                self.data('status', true);
                return;
            }else if( _checkVal === 0 && _opt.emptyOk ){
                self.data('status', true);
                return;
            }else if( _checkVal === 0 && !_opt.emptyOk ){
                self.data('status', false);
            }else if( _checkVal !== 0 ){
                _opt.warnElement && _opt.warnElement.html( '' + _opt.warnMsg ).css('color', '#f00');
                self.data('status', false);
            }
            //是否在初始化的时候显示提示信息
            if( _opt.tipMsgInit && _opt.tipMsg && _opt.warnElement ){
                _opt.warnElement.html( _opt.tipMsg ).css('color', '#999');
            }
        };
        this.showMsg = function(){
            var val = $.trim( self.val() );
            if( val == "" && !_opt.emptyOk ){
                _opt.warnElement && _opt.warnElement.html( '' + _opt.emptyMsg ).css('color', '#f00');
                textareaBlink( this );
            }
            if( !this.data('status') ){
                textareaBlink( this );
            }
        };
        function textareaBlink(obj){
            $(obj).css('background-color', '#fc9');
            var sti = setInterval(function(){
                $(obj).css('background-color', '#fc9');
            }, 200);
            var _sti = setTimeout(function(){
                $(obj).css('background-color', '#fff');
            }, 210);
            var st = setTimeout(function(){
                clearTimeout(st);
                clearInterval(sti);
                clearTimeout(_sti);
                $(obj).css('background-color', '#fc9');
            }, 620);
        }
        this._init();
        return this;
    };
})( jQuery || $, window );
