function initGame() {
	controller.fillLevelSelector('selectLevel', 'startBtn');
	controller.setGenButton('genLevel');
	controller.addControls();
	controller.loadLevel(0);
}

window.onload = function() {
	initGame();
};