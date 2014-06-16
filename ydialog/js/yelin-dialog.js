/*
    @author yelin yelin@sohu-inc.com
    @brief : this plugin is based on jquery, inject the jquery namespace with 
            5 veriable : ydialograndomvalue, yfixtipstimer, fn.ydialog, fn.yfixtips, fn.ytips
            notice : fn.ydialog needs the outer css support, specified in sohu cloudscape project. 
                     fn.yfixtips and fn.ytips has no dependencies except jquery and can be used freely
*/
;(function($){
    $.ydialograndomvalue = [];
    $.yzindex = 2014;
    $.yfixtipstimer = null;
    $.fn.ydialog = function(opts){
        var defaultSettings = {
            type : 'confirm'
            ,simple : false
            ,danger : false
            ,title : '提示消息'
            ,okText : '确定'
            ,cancelText : '取消'
            ,content : '确定要这么做吗？'
            ,lock : true
            ,id : ''
            ,width : 560
            ,maxHeight : 300
            ,init : function(){}
            ,ok : function(){}
            ,cancel : function(){}
            ,close : function(){}
            ,okDelete : true
            ,waitTitle : '操作进行中...'
            ,waitMsg : '操作进行中，请稍候...'
        };
        var opt = $.extend( {}, defaultSettings, opts );
        var ran = Math.floor( Math.random() * 100000000 );
        function getRandomValue(){
            for(;;){
                if( $.inArray(ran, $.ydialograndomvalue) >= 0 ){
                    ran = Math.floor( Math.random() * 100000000 );
                }else{
                    $.ydialograndomvalue.push( ran );
                    break;
                }
            }
        }
        var self = this;
        if( document === this[0] ){
            getRandomValue();
            showDialog();
            return this;
        }

        self.on('click', function(){
            getRandomValue();
            showDialog();
        });

        function showDialog(){
            var overlayHTML  = [
                            '<div class="yoverlay ydialog-element" style="z-index: '+ ($.yzindex++) +';">',
                                '<iframe width="100%" height="100%" frameborder="0" src="javascript:;"></iframe>',
                                '<div></div>',
                            '</div>'
                            ].join('');
            function createElement( opt ){
                var str = '';
                str += '<div id="'+ opt.id +'" class="ydialog ydialog-element" style="z-index: '+ ($.yzindex++) +'; width: '+ (opt.simple ? 450 : opt.width) +'px; height: auto; left: 50%; margin-left: -'+ (opt.simple ? 225 : opt.width/2) +'px; top: 33.3%; margin-top: -'+ (opt.maxHeight/2-70) +'px;">'
                        + '<table class="pop_dialog_table">'
                            + '<tr>'
                                + '<td class="pop_content" colspan="3">'
                                    + '<div class="dialog_header">'
                                        + '<div class="dialog_title">'+ opt.title +'</div>'
                                        + '<a class="dialog_minimize" href="javascript:;" style="display: none;">最小化</a>'
                                        + '<a class="dialog_close yclose" href="javascript:;" title="关闭">关闭</a>'
                                    + '</div>'
                                    + '<div class="dialog_body" style="'+ (opt.simple ? '':'min-height: 180px;_height:180px;') +'max-height: '+ opt.maxHeight +'px;">'
                                        + (opt.simple ? '<div class="simple_wrapper"><div class="simple_inner '+ (opt.danger ? 'simple_danger':'') +'">'+ opt.content +'</div></div>' : opt.content)
                                    + '</div>'
                                    + '<div class="dialog_footer">'
                                        + '<span class="info-msg"></span>'
                                        + '<a href="javascript:;" class="btn nbtn nbtn-primary yconfirm">'+ opt.okText +'</a>'
                                        + (opt.type == 'confirm' ? '<a href="javascript:;" class="btn nbtn nbtn-default ycancel">'+ opt.cancelText +'</a>' : '')
                                    + '</div>'
                                + '</td>'
                            + '</tr>'
                        + '</table>'
                    + '</div>';
                return str;
            }
            var dialogHTML = createElement( opt );
            var overlayElement = opt.lock ? $(overlayHTML) : '';
            
            var waitOverlayHTML = [
                            '<div class="yoverlay wait-element ydialog-element" style="z-index: '+ ($.yzindex++) +';">',
                                '<iframe width="100%" height="100%" frameborder="0" src="javascript:;"></iframe>',
                                '<div></div>',
                            '</div>'
                            ].join('');
            var waitHTML = '<div class="wait-element ydialog-element" style="z-index: '+ ($.yzindex++) +'; left: 50%; width: 300px; margin: 0 0 0 -150px; color: rgb(255, 255, 255); font-size: 14px;position: fixed; top: 45%;"><img src="img/loading.gif" style="vertical-align:middle;" /><span style="vertical-align:middle;">'+ opt.waitMsg +'</span></div>';
            var waitElement;
            var dialogElement = $(dialogHTML);
            $(document.body).append( overlayElement ).append( dialogElement );

            typeof opt.init === 'function' && opt.init();

            dialogElement.on('click', function(e){
                var el = $(e.target);
                var rval;
                if( el.hasClass('yconfirm') ){
                    if( typeof opt.ok == 'function' ){
                        rval = opt.ok();
                        if( rval === false ) return;
                        if( opt.okDelete != false ){
                        	typeof opt.close == 'function' && opt.close();
                        }
                    }else{
                        typeof opt.close == 'function' && opt.close();
                    }
                }else if( el.hasClass('ycancel') ){
                    if( typeof opt.cancel == 'function' ){
                        rval = opt.cancel();
                        if( rval === false ) return;
                        typeof opt.close == 'function' && opt.close();
                    }else{
                        typeof opt.cancel == 'function' && opt.cancel();
                        typeof opt.close == 'function' && opt.close();
                    }
                }else if( el.hasClass('yclose') ){
                    if( typeof opt.close == 'function' ){
                        rval = opt.close();
                        if( rval === false ) return;
                    }else{
                        typeof opt.close == 'function' && opt.close();
                    }
                }else{
                    return;
                }
                //dialogElement && dialogElement.remove();
                if( el.hasClass('yconfirm') && !opt.okDelete ){
                    waitElement = $(waitOverlayHTML + waitHTML)
                    $(document.body).append( waitElement );
                }else{
                    dialogElement && dialogElement.remove();
                    overlayElement && overlayElement.remove();
                }
                var index = $.inArray( ran, $.ydialograndomvalue );
                $.ydialograndomvalue.splice( index, 1 );
            });
        }
        return this;
    };

    $.yfixtips = function( opts ){
        $.yfixtipstimer && clearTimeout($.yfixtipstimer);
        $('.yfixtips-element').remove();
        var opt;
        var defaultSettings = {
            title : '提示消息'
            ,content : '这里是提示内容...'
            ,time : 2
            ,type : 'error'
            ,lock : false
            ,width : 200
            ,position : 'right-bottom'
        };
        if(typeof opts === 'string'){
            opt = $.extend({}, defaultSettings, {content : opts});
        }else{
            opt = $.extend({}, defaultSettings, opts);
        }
        var positionStr = '';
        switch(opt.position){
            case 'left-top':
                positionStr = 'left:2px;top:2px;';
                break;
            case 'left-bottom':
                positionStr = 'left:2px;bottom:2px;';
                break;
            case 'right-top':
                positionStr = 'right:2px;top:2px;';
                break;
            case 'center':
                positionStr = 'left:50%;top:100px;margin-left:-' + opt.width/2 + 'px;';
                break;
            case 'right-bottom':
            default:
                positionStr = 'right:2px;bottom:2px;';
                break;
        }
        function createHTML(){
            var str = '';
            str +=    '<div class="yfixtips yfixtips-element" style="z-index: '+ ($.yzindex++) +';'+ positionStr +'width:'+ opt.width +'px;display:none;">'
                        + '<div class="ftips-header" style="background:'+ getColor() +';">'
                            + '<h4>'+ opt.title +'</h4>'
                            + '<a class="yfixtips-close" href="javascript:;" title="关闭">'
                                + '<i>x</i>'
                            + '</a>'
                        + '</div>'
                        + '<div class="ftips-body">'
                            +'<div class="ftips-body-wrapper">'
                                + '<p>'+ opt.content +'</p>'
                            +'</div>'
                        + '</div>'
                    + '</div>'
            return str;
        }
        var overlayHTML  = [
                            '<div class="yoverlay yfixtips-element" style="z-index: '+ ($.yzindex++) +';">',
                                '<iframe width="100%" height="100%" frameborder="0" src="javascript:;"></iframe>',
                                '<div></div>',
                            '</div>'
                            ].join('');
        function getColor(){
            var color = '#900';
            switch(opt.type){
                case 'success':
                    color = '#1FBBA6';
                    break;
                case 'warn':
                    color = '#844';
                    break;
                case 'normal':
                    color = '#666';
                    break;
                case 'error':
                default:
                    break;
            }
            return color;
        }
        var elHTML = createHTML();
        var el = $( elHTML );
        var overlayElement = opt.lock ? $(overlayHTML) : '';
        $.yfixtipstimer && clearTimeout($.yfixtipstimer);
        $('.yfixtips-element').remove();
        $(document.body).append(overlayElement).append(el);
        el.slideDown(600);
        $('.yfixtips-close').on('click', function(){
            $.yfixtipstimer && clearTimeout($.yfixtipstimer);
            el.slideUp(600, function(){
                $('.yfixtips-element').remove();
            });
        });
        $.yfixtipstimer = setTimeout(function(){
            $.yfixtipstimer && clearTimeout($.yfixtipstimer);
            el.slideUp(600, function(){
                $('.yfixtips-element').remove();
            });
        }, opt.time * 1000);
        el.on('mouseenter', function(){
            $.yfixtipstimer && clearTimeout($.yfixtipstimer);
        }).on('mouseleave', function(){
            $.yfixtipstimer = setTimeout(function(){
                $.yfixtipstimer && clearTimeout($.yfixtipstimer);
                el.slideUp(600, function(){
                    $('.yfixtips-element').remove();
                });
            }, opt.time * 1000);
        });
    };

    $.fn.ytips = function(opts){
        var self = this;
        var defaultSettings = {
            content : self.data('title') ? self.data('title') : '提示消息内容。'
        };
        var opt = $.extend({}, defaultSettings, opts);
        function createHTML( left, top ){
            var str = '';
            str +=    '<div class="ytips-element" style="width:180px;height:28px;z-index: 1100;background:#fff;border:1px solid #999;border-radius:3px;position:absolute;left:'+left+';top'+top+';">'
                        + '<div class="ytips-body" style="">'
                            +'<div style="font-size:13px;padding:5px 10px;">'
                                + '<p style="text-align:center;">'+ opt.content +'</p>'
                            +'</div>'
                        + '</div>'
                    + '</div>'
            return str;
        }
        this.on('mouseenter', function(e){
            var left = (e.pageX-90) + 'px';
            var top = (e.pageY-34) + 'px';
            var el = $(createHTML(left, top));
            $(document.body).append(el);
        }).on('mousemove', function(e){
            var left = (e.pageX-90) + 'px';
            var top = (e.pageY-34) + 'px';
            $('.ytips-element').css({
                left : left,
                top : top
            });
        }).on('mouseleave', function(e){
            $('.ytips-element').remove();
        });
    }
})(jQuery || $);