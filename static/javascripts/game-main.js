seajs.config({
    base : "/static/modules/",
    alias :{
        "sort" : "sort.js",
        "underscore" : "underscore.js"
    }
});
define(function(require){
    var sort = require('sort');
    var a;
    function render(){
        var _sort = new sort();
        a = _sort.totalCards;
        var allCards = _sort._arr,
        type = _sort.r_str,
        result = _sort.r_arr;
        var pokers = document.getElementById('pokers').getElementsByClassName('poker');
        for(var i=0,l=pokers.length; i<l; i++){
            pokers[i].src = '/poker/images/' + allCards[i] + '.png';
        }
        var results = document.getElementById('results').getElementsByClassName('poker');
        for(var i=0,l=results.length; i<l; i++){
            results[i].src = '/poker/images/' + result[i] + '.png';
        }
        document.getElementById('type').innerHTML = type;
    }
    function preload(){
        var i = 0,l = a.length;
        var st = setInterval(function(){
            if(i >= l){
                clearInterval(st);
                return;
            }
            var img = new Image();
            img.src = '/poker/images/' + a[i] + '.png';
            i++;
        }, 100);
    }
    render();
    preload();
    document.getElementById('again').addEventListener('click', function(){
        render();
    });
});

