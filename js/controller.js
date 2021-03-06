var controller = (function() {
	var shiftByOrintation = {
		l: {x: -1, y: 0},
		u: {x: 0, y: -1},
		r: {x: 1, y: 0},
		d: {x: 0, y: 1}
	};
	var solverId;

	var load = function() {
		view.hideWin();
		controller.setStepsCount(0);

		if (scoreboard.checkOnline())
			view.updateScoreBoard();
		else
			view.updateStepsCount();	
		
		clearInterval(solverId);
		view.draw();
	}

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

				if (objectsToMove != undefined && objectsToMove.length > 0) { 
					model.incStepCount();
					controller.setStepsCount(model.getStepsCount());
				}

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
			load();
		},

		loadGenLevel: function(size) {
			model.setGenLevel(size);
			load();
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

		setStepsCount: function(num) {
			var steps = document.getElementById('stepsCount');
			steps.innerHTML = num;
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
				model.freeBackMoves();
				view.draw();
			};
		},

		setSolveBtn: function(id) {
			var solveBtn = document.getElementById(id);

			solveBtn.onclick = function() {	
				var solveWay = model.getSolveWay();
				var i = -1;
				console.log(solveWay);

				solverId = setInterval(function() {
					++i;
					if (i > solveWay.length)
						clearInterval(solverId);

					model.move(shiftByOrintation[solveWay[i]].x, shiftByOrintation[solveWay[i]].y);
					view.draw();
				}, 100);
			};
		},

		setMoveBackBtn: function(id) {
			var backBtn = document.getElementById(id);

			backBtn.onclick = function() {
				model.moveBack();
				view.draw();
			};
		}
	}

})();