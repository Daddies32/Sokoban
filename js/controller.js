var controller = (function() {
	var nextLevel = function(){
		alert('NextLevel');
	};
	return {
		addControls: function() {
			document.body.addEventListener('keydown', function(event) {
				if (event.keyCode == 37)
					model.move(-1, 0);
				else if (event.keyCode == 38)
					model.move(0, -1);
				else if (event.keyCode == 39)
					model.move(1, 0);
				else if (event.keyCode == 40)
					model.move(0, 1);

				view.draw();
				if (model.checkState()) 
					nextLevel();
			});
		},
	}

})();