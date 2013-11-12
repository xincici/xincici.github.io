/*
 * @author yelin yelin@sohu-inc.com
 * @date 2013-11-05 00:00:00
 * @brief sohu pv js file
 * @async support !!!maybe has problem
 * @usage sohuPv( arguments )
 * @make sohuPv a global object, take care
 */
;(function(w,d){
    var protocol, pvCookieName, se, referObj;
    init();
    function init(){
        protocol = w.location.protocol;
        //cookie名称，这里统一定义以方便修改
        pvCookieName = 'pvinf';
        //各个搜索引擎的域名，以及查询url中关键字的key，来源关键字分析需要使用
        se = {
            'sogou.com': ['query|keyword', 101],
            'google.com.hk': ['q', 102],
            'google.com': ['q', 102],
            'bing.com': ['q', 103],
            'youdao.com': ['q', 104],
            'soso.com': ['w|key', 105],
            'baidu.com': ['word|wd|w', 106],
            'v.360.cn': ['kw', 107],
            'so.com': ['q', 107],
            'search.yahoo.com': ['p', 108],
            'yahoo.cn': ['q', 108],
            'panguso.com': ['q', 109],
            'jike.com': ['q', 109],
            'etao.com': ['q', 110],
            'soku.com': ['keyword', 111],
            'easou.com': ['q', 112],
            'glb.uc.cn': ['keyword|word|q', 113]
        };
        //解析refer，保存解析结果
        referObj = parseRefer();
        (function(){
            //将js加载完成之前页面触发的请求发送出去
            for(var i=0,l=sohuPv.q.length; i<l; i++){
                send.call( w, sohuPv.q[i] );
            }
            //js加载完成发送一个请求
            send();
        })();
        w.sohuPv = function(){
            send( arguments );
        };
    }
    //刷新pvinf cookie，值为1384135971407_1384135983580_1类型
    //字段说明: origin time_last renew time_visit times
    function refreshCookie(){
        var cValue = getCookie(pvCookieName);
        var cArr;
        if( !cValue ){
            cArr = [+new Date(), +new Date(), 0];
            cValue = cArr.join('_');
        }else{
            cArr = cValue.split('_');
            cArr[1] = +new Date();
            cArr[2] = parseInt(cArr[2], 10) + 1;
            cValue = cArr.join('_');
        }
        setCookie( pvCookieName, cValue, 0.5 );
    }
    function send( args ){
        var type = 0; //pv
        if( noUvCookie() ){
            type = 1; //uv
        }
        var url = createUrl( type, args );
        sendRequest( type, url );
        //更新cookie
        refreshCookie();
    }
    function noUvCookie(){
        return !getCookie('SUV') || !getCookie('IPLOC') || !getCookie(pvCookieName);
    }
    function getDomain(){
        return d.domain.split('.').slice(-2).join('.');
    }
    function setCookie(name, value, expireHours){
        var cString = name + "=" + escape(value) + ";path=/;domain=." + getDomain() + ";";
        if( !expireHours || expireHours === -1 ){
            d.cookie = cString;
            return;
        }
        var date = new Date();
        date.setTime( date.getTime() + expireHours * 3600 * 1000 );
        cString += "expires=" + date.toGMTString() + ";";
        d.cookie = cString;
    }
    function deleteCookie(name) {
        var date = new Date();
        date.setTime( date.getTime() - 100000 );
        var cval = getCookie( name );
        d.cookie = name + "=" + cval + ";expires=" + date.toGMTString() + ";path=/;domain=." + getDomain() + ";";
    }
    function getCookie(name){
        if (!name) return null;
        var cookies = d.cookie.split('; ');
        for(var i=0,l=cookies.length; i<l; i++){
            if(cookies[i].split('=')[0] == name){
                return (cookies[i].split('=')[1]? cookies[i].split('=')[1] : '');
            }   
        }   
        return null;
    }
    //判断浏览器是否支持cookie
    function checkCookieEnabled() {
        try {
            if( navigator.cookieEnabled === false ) {
                return false;
            }
            //添加一个测试的cookie
            var date = new Date();
            var cString = 'testCookie=yes;expires=' + new Date(date.getTime() + 5*1000).toGMTString() + ';';
            d.cookie = cString;
            if( !d.cookie ) {
                return false;
            }
            //删除掉测试cookie
            cString = 'testCookie=yes;expires=' + new Date(date.getTime() - 5*1000).toGMTString() + ';';
            d.cookie = cString;
        }catch(e){
            return false;
        }
        return true;
    }
    
    function createUrl(type, args ){
        var path = type === 0 ? '/pv.gif' : '/suv/'
        return protocol + '//pv.sohu.com'+ path +'?' + getAttrString( args );
    }
    function getAttrString( args ){
        var attrObject = {
            t : +new Date() //时间戳，unix格式，必填
            ,m : typeof pvinsight_page_type !== 'undefined' ? pvinsight_page_type : 0 //是否为多屏页面（1为mobile版，0为普通版），选填 
            ,h : d.location.host //访问站点host，必填（个人认为没必要） 
            ,c : d.characterSet //编码类型，必填 
            ,scr : w.screen.width + '_' + w.screen.height //屏幕分辨率，必填 
            ,cli : d.body.clientWidth + '_' + d.body.clientHeight //视区分辨率，必填 
            ,clr : w.screen.colorDepth //色深（个人认为没必要），选填 
            ,l : navigator.language //语言（我们只有中文，没必要），选填 
            ,v : getVisitNumber() //TODO: 连续访问的访问次数，如果是连续访问则填写 
            ,tit : typeof encodeURIComponent === 'function' ? encodeURIComponent(d.title) : d.title //文章的title，选填，不填为url做title 
            ,vl : getVisitLength() //两次访问的间隔时长，选填（第一次访问就没有） 
            ,pid : typeof pvinsight_page_ancestors !== 'undefined' ? pvinsight_page_ancestors : 0 //父对象ID序列，选填 
            //,rl : returnLength //TODO: 回访周期（个人认为没有必要，这个和visitLength区别在哪里？） 
            ,rt : getReferType() //来源类型，可以为搜索类型，直接访问，网址站，站内。其中搜索类型可参考百度的js 
            ,k : getKeyWord() //如果来源类型为搜索，此为encodeURIComponent编码后的关键字，关键字提取参考百度js。 
            ,r : typeof encodeURIComponent === 'function' ? encodeURIComponent(d.referrer) : d.referrer //来源的url 
            /*
            ,pv_screen_width : w.screen.width
            ,pv_screen_height : w.screen.height
            ,pv_referrer : typeof encodeURIComponent === 'function' ? encodeURIComponent(d.referrer) : d.referrer
            ,pv_host : d.location.host
            ,pv_characterSet : d.characterSet
            ,pv_view_width : d.body.clientWidth
            ,pv_view_height : d.body.clientHeight
            ,pv_color_depth : w.screen.colorDepth
            ,pv_language : navigator.language
            ,pv_title : d.title
            */
        };
        var strArr = [];
        for(var key in attrObject){
            strArr.push( key + '?=' + attrObject[key] );
        }
        var attrString = strArr.join('?');
        if( !args || args.length === undefined || args.length === 0 ){
            return attrString;
        }
        if( typeof args[0] !== 'undefined' ){
            attrString += '?ty?=' + args[0];
        }
        if( typeof args[1] !== 'undefined' ){
            attrString += '?va?=' + (typeof encodeURIComponent === 'function' ? encodeURIComponent(args[1]) : args[1]);
        }
        if( typeof args[2] !== 'undefined' ){
            attrString += '?e?=' + args[2];
        }
        return attrString;
    }
    //获取来源类型
    function getReferType(){
        var refer = d.referrer;
        if( !refer ) return 1;
        return referObj.type ? referObj.type : -1;
    }
    //如果来源是搜索类型，则根据来源获取keyword
    function getKeyWord(){
        var refer = d.referrer;
        if( !refer ) return '';
        return referObj.key ? referObj.key : '';
    }
    //获取访问间隔时长
    function getVisitLength(){
        var cValue = getCookie(pvCookieName);
        if( !cValue ){
            return 0;
        }
        var cArr = cValue.split('_');
        return +new Date() - parseInt(cArr[1], 10);
    }
    //获取连续访问次数
    function getVisitNumber(){
        var cValue = getCookie(pvCookieName);
        var cArr;
        if( !cValue ){
            return 0;
        }else{
            cArr = cValue.split('_');
            return cArr[2] ? cArr[2] : 0;
        }
    }
    //解析url获取参数
    function parseRefer(){
        var url = d.referrer;
        if( !url ) return {};
        var reg = /\/\/(.*?)\//;
        var arr = url.match(reg);
        var host = arr.length > 1 ? arr[1] : '';
        var domain3 = host.split('.').slice(-3).join('.');
        var domain2 = host.split('.').slice(-2).join('.');
        var key, type;
        if( domain3 && se[domain3] ){
            key = se[domain3][0];
            type = se[domain3][1];
        }else if( domain2 && se[domain2] ){
            key = se[domain2][0];
            type = se[domain2][1];
        }
        if( !key ){
            return {
                host : host
            };
        }
        var keyArr = key.split('|');
        var qs = url.split('?').length === 2 ? url.split('?')[1] : '';
        var qsArr = qs.split('&');
        var tmp, result;
        for(var i=0,l=qsArr.length; i<l; i++){
            tmp = qsArr[i].split('=');
            for(var m=0,n=keyArr.length; m<n; m++){
                if(keyArr[m] === tmp[0]){
                    result = tmp[1];
                    break;
                }
            }
        }
        return {
            host : host,
            key : result,
            type : type
        };
    }
    
    function getAttr( ele ){
        var result;
        if( typeof ele === 'string' ){
            result = ele;
        }else if(typeof ele === 'object' && typeof ele.attr === 'function' ){
            result = ele.attr('id') || ele.attr('class');
        }else if(typeof ele === 'object' && typeof ele.getAttribute === 'function' ){
            result = ele.getAttribute('id') || ele.getAttribute('class');
        }else if(typeof ele === 'object' && typeof ele[0].getAttribute === 'function' ){
            result = ele[0].getAttribute('id') || ele[0].getAttribute('class');
        }
        if( !result ){
            result = 'unknownOrigin';
        }
        return result;
    }
    function sendRequest(type, url){
        var img, srcipt;
        if(type === 0){
            img = new Image();
            img.src = url;
        }else{
            script = d.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            d.getElementsByTagName('head')[0].appendChild( script );
        }
    }
})(window, document);
