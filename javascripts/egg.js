$(function(){
	var keystr = '383840403737393966656665';
	var pressed = '';
    var shown = false;
	$(document).on('keyup', function(e){
        if( shown ) return;
		pressed = pressed + e.keyCode;
        pressed = pressed.slice(-24);
		if( pressed == keystr ){
            shown = true;
			$.ydialog({
				title : 'download resume',
				simple : true,
				type : 'alert',
				content : '<a target="blank" href="/staff/resume.pdf">click here to download resume</a>',
                close : function(){
                    shown = false;
                }
			});
		}
	});
});
