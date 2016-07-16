/*
	* - character
	. - background
	# - wall
	@ - box
	? - store
*/

var view = (function() {
	const spriteSize = 32;

	const imgCharFront = new Image();
	imgCharFront.src = 'img/character_f.png';

	const imgCharBack = new Image();
	imgCharBack.src = 'img/character_b.png';

	const imgCharLeft = new Image();
	imgCharLeft.src = 'img/character_l.png';

	const imgCharRight = new Image();
	imgCharRight.src = 'img/character_r.png';

	const imgBackground = new Image();
	imgBackground.src = 'img/background.png';

	const imgWall = new Image();
	imgWall.src = 'img/wall.png';

	const imgBox = new Image();
	imgBox.src = 'img/box.png';

	const imgActiveBox = new Image();
	imgActiveBox.src = 'img/active_box.png';

	const imgStore = new Image();
	imgStore.src = 'img/store.png';

	var imgCharacter = imgCharFront;
	var timerId;

	var drawBoxes = function(ctx, map, boxes) {
		for (var i = 0; i < boxes.length; ++i) {
			if (map[boxes[i].y][boxes[i].x] == '@')
				ctx.drawImage(imgBox, boxes[i].x * spriteSize, boxes[i].y * spriteSize, spriteSize, spriteSize);
			else
				ctx.drawImage(imgActiveBox, boxes[i].x * spriteSize, boxes[i].y * spriteSize, spriteSize, spriteSize);		
		}
	}

	var animate = function(canvas, width, height, ctx, level, map, objects, dx, dy, boxToDraw) {
		var localMap = [];

		for (var i = 0; i < map.length; ++i) {
			localMap[i] = '';
			for (var j = 0; j < map[i].length; ++j)
				localMap[i] += map[i][j];
		}

		var frame = -1;

		requestAnimationFrame(function animate(time) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			view.drawLevel(ctx, level);
			drawBoxes(ctx, map, boxToDraw);

			for (var i = 0; i < objects.length; ++i) {
				if (localMap[objects[i].finishPos.y][objects[i].finishPos.x] == '*') {
					if (dx > 0) {
						imgCharacter = imgCharRight;
					}
					else if (dx < 0) {
						imgCharacter = imgCharLeft;
					}
					else if (dy > 0) {
						imgCharacter = imgCharFront;
					}
					else if (dy < 0) {
						imgCharacter = imgCharBack;
					}

					frame++;
					if (dx != 0 && frame > 1)
						frame = 0;
					else if (dy != 0 && frame > 2)
						frame = 0;

					ctx.drawImage(imgCharacter, frame * spriteSize, 0, spriteSize, spriteSize,
						objects[i].startPos.x * spriteSize + dx,
						objects[i].startPos.y * spriteSize + dy, spriteSize, spriteSize);
				}
				else {
					ctx.drawImage(imgBox, objects[i].startPos.x * spriteSize + dx,
						objects[i].startPos.y * spriteSize + dy, spriteSize, spriteSize);
				}
			}

			dx += 5 * (objects[0].finishPos.x - objects[0].startPos.x);
			dy += 5 * (objects[0].finishPos.y - objects[0].startPos.y);

			if (Math.abs(dx) < spriteSize + 1 && Math.abs(dy) < spriteSize + 1)
				timerId = window.setTimeout(function() {
					requestAnimationFrame(animate)
				}, 20);
			else
				view.draw();
		});
	}

	return {
		drawLevel: function(ctx, map) {
			for (var i = 0; i < map.length; ++i) {
				for (var j = 0; j < map[i].length; ++j) {
					var y = i * spriteSize, x = j * spriteSize;

					switch (map[i][j]) {
						case '.': 
							ctx.drawImage(imgBackground, x, y, spriteSize, spriteSize);
							break;
						case '#':
							ctx.drawImage(imgWall, x, y, spriteSize, spriteSize);
							break;
						case '?':
							ctx.drawImage(imgBackground, x, y, spriteSize, spriteSize);
							ctx.drawImage(imgStore, x, y, spriteSize, spriteSize);
							break;
					}
				}
			}
		},

		draw: function(objects) {
			var level = model.getLevel();

			var canvas = document.getElementById('level');
			canvas.height = level.map.length * spriteSize;
			canvas.width = 760;
			var ctx = canvas.getContext('2d');

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.drawLevel(ctx, level.map);

			var map = model.getMap();
			var boxes = model.getBoxesCoords();

			if (objects === undefined || objects.length == 0) {
				var character = model.getCharacterCoords();
				ctx.drawImage(imgCharacter, 0, 0, spriteSize, spriteSize,
					character.x * spriteSize, character.y * spriteSize, spriteSize, spriteSize);
				drawBoxes(ctx, map, boxes);
			}
			else {
				var noDraw;
				for (var i = 0; i < objects.length; ++i) {
					var noX = objects[i].finishPos.x;
					var noY = objects[i].finishPos.y;

					if (map[noY][noX] == '@' || map[noY][noX] == '!')
						noDraw = {x: noX, y: noY};
				}

				var boxToDraw = [];
				for (var i = 0; i < boxes.length; ++i)
					if ((noDraw != undefined && (boxes[i].x != noDraw.x || boxes[i].y != noDraw.y)) || noDraw == undefined)
						boxToDraw.push(boxes[i]);

				var dx = objects[0].finishPos.x - objects[0].startPos.x;
				var dy = objects[0].finishPos.y - objects[0].startPos.y;
				
				clearTimeout(timerId);
				animate(canvas, canvas.width, canvas.height, ctx, level.map, map, objects, dx, dy, boxToDraw);	
			}
		},

		updateStepsCount: function() {
			var level = model.getLevelNumber();

			if (level !== 'Gen')
				level = +level + 1;
			
			var str = document.getElementById('stepsCount' + level);

			if (str == undefined) {
				str = document.createElement('label');
				str.id = 'stepsCount' + level;
				str.innerHTML = '#' + level + ' Количество ходов: ' + model.getStepsCount();

				document.getElementById('scoreboard').appendChild(str);
				document.getElementById('scoreboard').appendChild(document.createElement('br'));
			}
			else {
				str.innerHTML = '#' + level + ' Количество ходов: ' + model.getStepsCount();
			}
		},

		updateScoreBoard: function() {
			var table = document.getElementById('scoreboard_table');

			while(table.childNodes.length != 0) {
				table.removeChild(table.lastChild);
			}

			scoreboard.getScoreBoard(function(board) {
				if (table.childNodes.length != 0)
					return;
				
				var title = document.createElement('tr');

				var thUser = document.createElement('th');
				thUser.innerHTML = 'Ник';
				title.appendChild(thUser);

				var thLvl = document.createElement('th');
				thLvl.innerHTML = 'Уровень';
				title.appendChild(thLvl);

				var thSteps = document.createElement('th');
				thSteps.innerHTML = 'Шагов';
				title.appendChild(thSteps);

				table.appendChild(title);
			
				for (var i = 0; i < board.length; ++i) {
					for (var j = 0; j < board[i].scores.length; ++j) {
						var tr = document.createElement('tr');

						var user = document.createElement('td');
						user.innerHTML = board[i].name;
						tr.appendChild(user);

						var lvl = document.createElement('td');
						lvl.innerHTML = board[i].scores[j].level;
						tr.appendChild(lvl);

						var steps = document.createElement('td');
						steps.innerHTML = board[i].scores[j].steps;
						tr.appendChild(steps);

						table.appendChild(tr);
					}
				}
			});
		},

		showWin: function() {
			var winText = document.getElementById('win_text');
			winText.style.transition = 'all 1s linear';
			winText.style.top = '100px';
		},

		hideWin: function() {
			var winText = document.getElementById('win_text');
			winText.style.transition = 'none';
			winText.style.left = window.innerWidth / 2 - winText.offsetWidth / 2 + 'px';
			winText.style.top = '-50px';
		}
	} 

})();