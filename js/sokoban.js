function initGame(levelNumber) {
	model.setLevelNumber(levelNumber);
	controller.addControls();
	view.draw();
}

window.onload = function() {
	initGame(2);
};