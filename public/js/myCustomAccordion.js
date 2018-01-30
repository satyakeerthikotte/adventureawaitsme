$('#myAccordion>li:nth-child(odd)').click(function(){

		//$('#myAccordion>li:nth-child(even)').css('background', '#888');
		//$(this).next().css('background', 'white');

		//$('#myAccordion>li:nth-child(odd)').show();
		//$(this).hide();
		//$('#myAccordion>li:nth-child(even)').children().hide();
		//$(this).next().children().show();
		
		$(this).next().children().fadeIn(500);

		$('#myAccordion>li:nth-child(even)').animate({width: '45px'}, {duration: 500, queue: false});

		$(this).next().animate({width: '75%'}, {duration: 500, queue: false});

	});