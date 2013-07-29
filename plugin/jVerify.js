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
            ,vEvent : event type     //触发校验的事件 默认为keyup
            ,warnElement : Object       //提示信息显示容器
            ,tipMsgInit : boolean       //初始化时是否显示提示信息
        }
        */
        var self = this;
        this._val;
        var _opt = {
            type : opts.type ? opts.type.toLowerCase() : 'string'
            ,emptyOk : opts.emptyOk ? true : false
            ,tipMsg : opts.tipMsg ? opts.tipMsg : ""
            ,emptyMsg : opts.emptyMsg ? opts.emptyMsg : ""
            ,warnMsg : opts.warnMsg ? opts.warnMsg : ""
            ,maxValue : opts.maxValue
            ,minValue : opts.minValue
            ,maxLength : opts.maxLength
            ,minLength : opts.minLength
            ,vEvent : opts.vEvent ? opts.vEvent.toLowerCase() : 'keyup'
            ,warnElement : opts.warnElement
            ,tipMsgInit : opts.tipMsgInit ? true : false
        };
        this.on('focus', function(){
        	self.attr("value",self.val().trim());
            var val = $.trim( self.val() );
            self._val = $.trim( self.val() );
            var _checkVal = self.getResult();
            if( val == "" ){
                _opt.warnElement.html( _opt.tipMsg ).css('color', '#999');
            }else if( _checkVal === 100 ){
                _opt.warnElement.html( '√' ).css('color', '0c0');
            }else{
                _opt.warnElement.html( _opt.warnMsg ).css('color', 'f00');
            }
        });
        this.on(_opt.vEvent, checkValue);
        this.on('blur', checkValue);
        function checkValue(e){
        	//解决因按tab键获取焦点后会触发这个输入框的keyup事件问题
        	if(e.keyCode == 9) return;
            self._val = self.val();
            var result = self.getResult();
            switch (result){
                case 0:
                    if( _opt.warnElement && !_opt.emptyOk ){
                        _opt.warnElement.html( _opt.emptyMsg ).css('color', '#f00');
                        self.data('status', 'false');
                    }else if( _opt.emptyOk ){
                        _opt.warnElement.html( '' );
                        self.data('status', 'true');
                    }else{
                        alert( _opt.emptyMsg );
                    }
                    break;
                case 1:
                case 2:
                    if( _opt.warnElement ){
                        _opt.warnElement.html( _opt.warnMsg ).css('color', '#f00');
                    }else{
                        alert( _opt.warnMsg );
                    }
                    self.data('status', 'false');
                    break;
                case 3:
                    if( _opt.warnElement ){
                        _opt.warnElement.html( _opt.warnMsg ).css('color', '#f00');
                    }else{
                        alert( _opt.warnMsg );
                    }
                    self.data('status', 'false');
                    break;
                case 100:
                    if( _opt.warnElement ){
                        _opt.warnElement.html('√').css('color', '#0c0');
                    }else{
                        alert('√');
                    }
                    self.data('status', 'true');
                    break;
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
                case 'int':
                	if(!/^(0|[1-9][0-9]{0,9})$/.test(str)) return 3;
                    if(_opt.minValue && parseInt(str, 10) < _opt.minValue) return 1;
                    if(_opt.maxValue && parseInt(str, 10) > _opt.maxValue) return 2;
                    return 100;
                    break;
                case 'mobile':
                	if(!/^1[0-9]{10}$/.test(str)) return 3;
                	return 100;
                	break;
                case 'email':
                    var reg = /^[a-zA-Z0-9+#._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    return  reg.test(str)? 100 : 3;
            }
        }
        this.getResult = function(){
            return _check(_opt.type, self._val);
        };
        this._init = function(){
            self._val = $.trim( self.val() );
            var _checkVal = self.getResult();
            if( _checkVal === 100 || ( _checkVal === 0 && _opt.emptyOk ) ){
                self.data('status', 'true');
            }else if( _checkVal === 0 && !_opt.emptyOk ){
                self.data('status', 'false');
            }else if( _checkVal !== 0 ){
                _opt.warnElement.html( _opt.warnMsg ).css('color', '#f00');
                self.data('status', 'false');
            }
            //是否在初始化的时候显示提示信息
            if( _opt.tipMsgInit && _opt.tipMsg && _opt.warnElement ){
                _opt.warnElement.html( _opt.tipMsg ).css('color', '#999');
            }
        };
        this.showMsg = function(){
            var val = $.trim( self.val() );
            if( val == "" && !_opt.emptyOk ){
                _opt.warnElement.html( _opt.emptyMsg ).css('color', '#f00');
            }
        };
        this._init();
        return this;
    };
})( jQuery || $, window )
