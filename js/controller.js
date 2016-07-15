var controller = (function() {

	var nextLevel = function(){
		if (!scoreboard.checkOnline())
			view.updateScoreBoard();

		if (model.getLevelNumber() === 'Gen' || model.getLevelNumber() == +levels.getNumLevels() - 1) {
			view.showWin();
			return;
		}

		controller.loadLevel(+model.getLevelNumber() + 1);
	};

	var writeScore = function() {
		var levelNum = model.getLevelNumber();

		if (levelNum !== 'Gen')
			levelNum++;

		var nick = document.getElementById('nickname').value;
		if (nick.split(' ').length == +nick.length + 1)
			nick = 'guest';

		scoreboard.addToScoreBoard(nick, levelNum, model.getStepsCount());
	}

	return {
		addControls: function() {
			var press = false;

			document.body.addEventListener('keydown', function(event) {
				var objectsToMove = undefined;

				if (press)
					return;

				if (event.keyCode == 37)
					objectsToMove = model.move(-1, 0);
				else if (event.keyCode == 38)
					objectsToMove = model.move(0, -1);
				else if (event.keyCode == 39)
					objectsToMove = model.move(1, 0);
				else if (event.keyCode == 40)
					objectsToMove = model.move(0, 1);

				press = true;

				if (objectsToMove != undefined && objectsToMove.length > 0) 
					model.incStepCount();

				view.draw(objectsToMove);

				if (model.isVictory()) {
					writeScore();
					nextLevel();
				}
			});

			document.body.addEventListener('keyup', function(event) {
				press = false;
			});
		},

		loadLevel: function(level) {
			model.setLevel(level);
			document.getElementById('selectLevel').selectedIndex = level;
			view.hideWin();
			if (scoreboard.checkOnline())
				view.updateScoreBoard();
			view.draw();
		},

		loadGenLevel: function(size) {
			model.setGenLevel(size);
			view.hideWin();
			if (scoreboard.checkOnline())
				view.updateScoreBoard();
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
			btn.onclick = function() {
				controller.loadLevel(select.options[select.selectedIndex].value);
			};
		},

		setGeneratorOptions: function(selectId, buttonId) {
			var select = document.getElementById(selectId);

			var btn = document.getElementById(buttonId);

			btn.onclick = function() {
				controller.loadGenLevel(select.options[select.selectedIndex].value);	
			};
		},

		setRestartBtn: function(id) {
			var btn = document.getElementById(id);

			btn.onclick = function() {
				model.setMap(model.getLevel());
				view.draw();
			};
		},

		solveLevel: function() {
			var solveBtn = document.getElementById('solveLevel');

			solveBtn.onclick = function() {

			};
		}
	}

})();