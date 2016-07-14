function initGame() {
	controller.fillLevelSelector('selectLevel', 'startBtn');
	controller.setGeneratorOptions('sizeLevel', 'genLevel');
	controller.setRestartBtn('restartBtn');
	controller.addControls();
	controller.loadLevel(0);
}

window.onload = function() {
	initGame();
};