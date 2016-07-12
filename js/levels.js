var levels = (function() {
		const level_0 = {
        map: [
        	'###',
            '..#',
            '..#',
            '..#',
            '###'
        ],
        charCoords: {
            x: 1,
            y: 1
        },
        boxes: [{x: 2, y: 1},
                {x: 2, y: 3}]
    };

    const level_1 = {
        map: [
        	'########',
            '#......#',
            '#......#',
            '#.###..#',
            '#......#',
            '#..?...#',
            '########'
        ],
        charCoords: {
            x: 1,
            y: 1
        },
        boxes: [{x: 3, y: 2}]
    };

    const level_2 = {
        map: [
            '  ##### ',
            '###...# ',
            '#...#.##',
            '#.#..?.#',
            '#....#.#',
            '##.#...#',
            ' #...###',
            ' #####  '
  		],
        charCoords: {
            x: 2,
            y: 6
        },
        boxes: [{x: 2, y: 2}]
    };

	var levels = [level_0, level_1, level_2];

	return {
		getLevel: function(levelNumber) {
			return levels[levelNumber];
		}
	}

})();