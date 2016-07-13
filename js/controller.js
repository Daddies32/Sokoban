var controller = (function() {
	var nextLevel = function(){
		controller.loadLevel(+model.getLevelNumber() + 1);
	};

	return {
		addControls: function() {
			document.body.addEventListener('keydown', function(event) {
				var objectsToMove = undefined;

				if (event.keyCode == 37)
					objectsToMove = model.move(-1, 0);
				else if (event.keyCode == 38)
					objectsToMove = model.move(0, -1);
				else if (event.keyCode == 39)
					objectsToMove = model.move(1, 0);
				else if (event.keyCode == 40)
					objectsToMove = model.move(0, 1);

				view.draw(objectsToMove);

				if (model.isVictory())
					nextLevel();
			});
		},

		loadLevel: function(level) {
			model.setLevel(level);
			view.draw();
		},

		fillLevelSelector: function(selectId, startBtn) {
			var select = document.getElementById(selectId);

			for (var i = 0; i < levels.getNumLevels(); ++i) {
				var opt = document.createElement('option');
				opt.appendChild(document.createTextNode(i + 1));
				opt.setAttribute('value', i);

				select.appendChild(opt);
			}

			var btn = document.getElementById(startBtn);

			btn.addEventListener('click', function(event) {
				controller.loadLevel(select.options[select.selectedIndex].value);
			});
		},
	}

})();