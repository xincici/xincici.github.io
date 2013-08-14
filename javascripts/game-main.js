seajs.config({
    base : "../modules/",
    alias :{
        "sort" : "sort.js",
        "underscore" : "underscore.js"
    }
});
define(function(require){
    var sort = require('sort');
    var _sort = new sort();
    var allCards = _sort._arr,
    type = _sort.r_str,
    result = _sort.r_arr;
    var pokers = document.getElementById('pokers').getElementsByClassName('poker');
    for(var i=0,l=pokers.length; i<l; i++){
        pokers[i].src = '../poker/images/' + allCards[i] + '.png';
    }
    var results = document.getElementById('results').getElementsByClassName('poker');
    for(var i=0,l=results.length; i<l; i++){
        results[i].src = '../poker/images/' + result[i] + '.png';
    }
    document.getElementById('type').innerHTML = type;
});

