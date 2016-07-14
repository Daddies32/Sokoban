function initGame() {
	controller.fillLevelSelector('selectLevel', 'startBtn');
	controller.setGeneratorOptions('sizeLevel', 'genLevel');
	controller.addControls();
	controller.loadLevel(0);
}

window.onload = function() {
	initGame();
};