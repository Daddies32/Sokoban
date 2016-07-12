function initGame() {
	controller.fillLevelSelector('selectLevel', 'startBtn');
	controller.addControls();
	controller.loadLevel(0);
}

window.onload = function() {
	initGame();
};