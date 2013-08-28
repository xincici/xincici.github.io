/*
 *@author yelin
 *@date 2013-08-28
 *@brief make old ie to support some modern function
 * */
;(function(w, d, undefined){
    if( typeof Array.indexOf !== 'function' ){
        Array.prototype.indexOf = function(args){
            var index = -1;
            for(var i=0,l=this.length; i<l; i++){
                if(this[i] === args){
                    index = i;
                    break;
                }
            }
            return index;
        }
        Array.prototype.lastIndexOf = function(args){
            var index = -1;
            for(var i=this.length-1; i>=0; i--){
                if(this[i] === args){
                    index = i;
                    break;
                }
            }
            return index;
        }
    }
    if( !d.getElementsByClassName() ){
        d.getElementsByClassName = function(cname, ele){
            if( !cname || typeof cname !== 'string' ) return [];
            var tmp,result = [];
            eles = ( ele || d ).getElementsByTagName('*');
            for(var i=0,l=eles.length; i<l; i++){
                tmp = eles[i].getAttribute('class') ? eles[i].getAttribute('class').split(' ') : [];
                if( tmp.length === 0 ) continue;
                for(var j=0,k=tmp.length; j<k; j++){
                    if( tmp[j] === cname ){
                        result.push( eles[i] );
                        break;
                    }
                }
            }
            return result;
        }
    }
    if( !w.XMLHttpRequest ){
        w.XMLHttpRequest = function(){
            var xmlhttp;
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlhttp;
        }
    }
})(window, document);
