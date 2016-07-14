var scoreboard = (function() {
	var username = 'guest';

	return {
		addToScoreBoard: function(level, countSteps) {
			firebase.database().ref('scoreboard/' + username + '/' + level).set({
				steps: countSteps
			});
		}
	}

})();