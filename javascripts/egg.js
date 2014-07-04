$(function(){
	var keystr = '383840403737393966656665';
	var everFalse = false;
	var pressed = '';
	$(document).on('keyup', function(e){
		if(everFalse) return;
		pressed = pressed + e.keyCode;
		if( pressed == keystr ){
			$.ydialog({
				title : 'download resume',
				simple : true,
				type : 'alert',
				content : '<a target="blank" href="/staff/resume.pdf">download resume</a>'
			});
			everFalse = true;
		}else if(pressed.length > keystr.length){
			everFalse = true;
		}
	});
});