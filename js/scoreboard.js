var scoreboard = (function() {

	var isOnline = true;

	return {
		addToScoreBoard: function(username, level, countSteps) {
			if (typeof firebase === 'undefined')
				return;
			
			firebase.database().ref('scoreboard/' + username + '/' + level).set({
				steps: countSteps
			});
		},

		getScoreBoard: function(callback) {
			var board = [];

			if (!isOnline)
				view.updateStepsCount();

			if (typeof firebase === 'undefined') {
				isOnline = false;
				return;
			}

			firebase.database().ref('scoreboard/').once('value', function(users) {
				users.forEach(function(user) {
					var player = {
					name: user.key,
					scores: []
				};

				user.forEach(function(level) {
					var lvl = {
					level: level.key,
					steps: level.child('steps').val()
				};

					player.scores.push(lvl);
				});

					board.push(player);
				});

				callback(board);
			});
		},

		checkOnline: function() {
			return isOnline;
		}
	}

})();