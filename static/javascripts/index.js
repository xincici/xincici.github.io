document.ready(function(){
    bindEvent();
    preLoad();
    setTimeout(doConsole, 1000);
    initBgColor();
    function initBgColor(){
        var color = cookieObj.getCookie('bgcolor');
        if( color ){
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = color;
            var lis = document.getElementsByTagName('li', document.getElementsByClassName('skin_slide')[0]);
            for(var i=0,l=lis.length; i<l; i++){
                if( lis[i].getAttribute('bcolor') === color ){
                    aClass(lis[i], 'current');
                }else{
                    rClass(lis[i], 'current');
                }
            }
        }            
    }
    
    var offsetTop = getPosition(document.getElementsByClassName('left-content')[0], 'offsetTop') + 10;
    window.addEventListener('scroll', function(e){
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        offsetTop = getPosition(document.getElementsByClassName('left-content')[0], 'offsetTop') + 10;
        if( scrollTop > offsetTop-45 ){
            aClass(document.getElementsByClassName('left-content')[0], 'left-content-fixed');
        }else{
            rClass(document.getElementsByClassName('left-content')[0], 'left-content-fixed');
        }
        if( scrollTop > 45 ){
            aClass(document.getElementsByClassName('h-title')[0], 'h-title-fixed');
        }else{
            rClass(document.getElementsByClassName('h-title')[0], 'h-title-fixed');
        }
    }, false);
    (function(){
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if( scrollTop > offsetTop ){
            aClass(document.getElementsByClassName('left-content')[0], 'left-content-fixed');
        }else{
            rClass(document.getElementsByClassName('left-content')[0], 'left-content-fixed');
        }
        if( scrollTop > 45 ){
            aClass(document.getElementsByClassName('h-title')[0], 'h-title-fixed');
        }else{
            rClass(document.getElementsByClassName('h-title')[0], 'h-title-fixed');
        }
    }())

    function getPosition(ele, name) {
        var pos = 0;
        while (ele) {
            pos += ele[name];
            ele = ele.offsetParent;
        }
        return pos;
    }

    function changeSkin(e){
        var ele = e.target;
        if( ele.getAttribute('class').indexOf('current') >= 0 ) return;
        var iss1 = ele.getAttribute('class').indexOf('s1_mini') >= 0;
        var iss2 = ele.getAttribute('class').indexOf('s2_mini') >= 0;
        if( iss1 ){
            document.body.style.background = 'url("/static/images/bg.jpg") repeat 0 0 scroll transparent';
            document.getElementsByClassName('s2_mini')[0].setAttribute('class', 's2_mini');
            document.getElementsByClassName('s1_mini')[0].setAttribute('class', 's1_mini current');
        }else if(iss2){
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = "#17607D";
            document.getElementsByClassName('s1_mini')[0].setAttribute('class', 's1_mini');
            document.getElementsByClassName('s2_mini')[0].setAttribute('class', 's2_mini current');
        }
    }
    function toggleSkin(e){
        var ele = e.target;
        if( ele.getAttribute('class').indexOf('current') >= 0 ) return;
        if( ele.getAttribute('class').indexOf('color') < 0 ) return;
        var _parentEle = document.getElementsByClassName('skin_slide');
        var _currentEle = document.getElementsByClassName('current', _parentEle);
        rClass(_currentEle[0], 'current');
        aClass(ele, 'current');
        if( ele.getAttribute('class').indexOf('color0') >= 0 ){
            document.body.style.backgroundImage = 'url("/static/images/bg.jpg")';
            cookieObj.setCookie('bgcolor', '');
            return;
        }
        var color = ele.getAttribute('bcolor');
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = color;
        cookieObj.setCookie('bgcolor', color);
    }
    function rClass(ele, cname){
        if(!ele || !cname) return;
        var oldClassArr = ele.getAttribute('class') ? ele.getAttribute('class').split(' ') : [];
        for(var i=0,l=oldClassArr.length; i<l; i++){
            if(oldClassArr[i] === cname){
                oldClassArr.splice(i, 1);
                break;
            }
        }
        ele.setAttribute('class', oldClassArr.join(' '));
    }
    function aClass(ele, cname){
        if(!ele || !cname) return;
        var oldClassArr = ele.getAttribute('class') ? ele.getAttribute('class').split(' ') : [];
        for(var i=0,l=oldClassArr.length; i<l; i++){
            if(oldClassArr[i] === cname){
                break;
            }
        }
        if( i === l){
            oldClassArr.push( cname );
        }
        ele.setAttribute('class', oldClassArr.join(' '));
    }
    function showBox(){
        //document.getElementsByClassName('rect')[0].setAttribute('class', 'rect');
        //document.getElementsByClassName('skin_box')[0].setAttribute('class', 'skin_box');
        document.getElementsByClassName('skin_slide')[0].setAttribute('class', 'skin_slide ulshown');
        document.getElementsByClassName('rect')[0].setAttribute('class', 'rect rectshown');
    }
    function hideBox(){
        //document.getElementsByClassName('rect')[0].setAttribute('class', 'rect hidden');
        //document.getElementsByClassName('skin_box')[0].setAttribute('class', 'skin_box hidden');
        document.getElementsByClassName('skin_slide')[0].setAttribute('class', 'skin_slide');
        document.getElementsByClassName('rect')[0].setAttribute('class', 'rect');
    }
    function preLoad(){
        var arr = ['/static/images/pic.jpg', '/static/images/pic_1.jpg', '/static/images/bg.jpg'];
        for(var i=0,l=arr.length; i<l; i++){
            var img = new Image();
            img.src = arr[i];
        }
    }
    function bindEvent(){
        if(document.getElmentsByClassName){
            document.getElementById('skin').setAttribute('class', 'hidden');
            return;
        }
        document.getElementById('skin').onmouseover = showBox;
        document.getElementById('skin').onmouseout = hideBox;
        //document.getElementById('skin').onclick = changeSkin;
        document.getElementById('skin').onclick = toggleSkin;
    }
    function doConsole(){
        if( !window.console || typeof window.console.log !== 'function' ) return;
        var a = [
                '#     #  #######  #         #####   #######  #     #  #######',
                '#  #  #  #        #        #     #  #     #  ##   ##  #      ',
                '#  #  #  #        #        #        #     #  # # # #  #      ',
                '#  #  #  #####    #        #        #     #  #  #  #  #####  ',
                '#  #  #  #        #        #        #     #  #     #  #      ',
                '#  #  #  #        #        #     #  #     #  #     #  #      ',
                ' ## ##   #######  #######   #####   #######  #     #  #######'];
        var b = [
                '#     #  ###  #     #   #####   ###   #####   ### ', 
                ' #   #    #   ##    #  #     #   #   #     #   #  ', 
                '  # #     #   # #   #  #         #   #         #  ', 
                '   #      #   #  #  #  #         #   #         #  ', 
                '  # #     #   #   # #  #         #   #         #  ', 
                ' #   #    #   #    ##  #     #   #   #     #   #  ', 
                '#     #  ###  #     #   #####   ###   #####   ### ' ];
        var s = [
                '#        ###  #     #  #     #  #######  ',  
                '#         #   ##    #   #   #   #        ',
                '#         #   # #   #    # #    #        ',
                '#         #   #  #  #     #     #####    ',
                '#         #   #   # #     #     #        ',
                '#         #   #    ##     #     #        ',
                '#######  ###  #     #     #     #######  '];
        console.log('%c' + a.join('\r\n') + '\r\n\r\n' + b.join('\r\n'), 'color:red;');
    }
});
