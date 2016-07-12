/*
	* - character
	. - background
	# - wall
	@ - box
	? - store
*/

var view = (function() {
	const spriteSize = 32;

	const imgCharacter = new Image();
	imgCharacter.src = 'img/character.png';

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
			canvas.width = level.map[0].length * spriteSize;
			var ctx = canvas.getContext('2d');

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.drawLevel(ctx, level.map);

			var map = model.getMap();

			if (objects === undefined) {
				var character = model.getCharacterCoords();
				var boxes = model.getBoxesCoords();

				ctx.drawImage(imgCharacter, character.x * spriteSize, character.y * spriteSize, spriteSize, spriteSize);

				for (var i = 0; i < boxes.length; ++i) {
					if (map[boxes[i].y][boxes[i].x] == '@')
						ctx.drawImage(imgBox, boxes[i].x * spriteSize, boxes[i].y * spriteSize, spriteSize, spriteSize);
					else
						ctx.drawImage(imgActiveBox, boxes[i].x * spriteSize, boxes[i].y * spriteSize, spriteSize, spriteSize);		
				}
			}
		}
	} 

})();