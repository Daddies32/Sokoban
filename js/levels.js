var levels = (function() {
		const level_0 = {
        map: [
        	'#####',
            '#..?#',
            '#...#',
            '#..?#',
            '#####'
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

    const level_3 = {
        map: [
            '  ##### ',
            '###...# ',
            '#...#.##',
            '#.#..?.#',
            '#....#.#',
            '##.#?..#',
            ' #...###',
            ' #####  '
        ],
        charCoords: {
            x: 2,
            y: 6
        },
        boxes: [{x: 2, y: 2},
                {x: 2, y: 5}]
    };

    const level_4 = {
        map: [
            '#######################',
            '#.....................#',
            '#.##################.##',
            '#.#???#............#..#',
            '#.#???#..........#.#..#',
            '#.#??...........#?....#',
            '#.#...#.........?#.#?.#',
            '#.#???#.#.?????#...?###',
            '#.#################...#',
            '#.....................#',
            '#######################'
        ],
        charCoords: {
            x: 1,
            y: 9
        },
        boxes: [{x: 8, y: 4}, {x: 9, y: 4}, {x: 10, y: 4},
                {x: 11, y: 4}, {x: 12, y: 4}, {x: 13, y: 4},
                {x: 14, y: 4}, {x: 15, y: 4},{x: 5, y: 5},
                {x: 8, y: 5}, {x: 15, y: 5}, {x: 19, y: 5},
                {x: 20, y: 2}, {x: 10, y: 6}, {x: 11, y: 6},
                {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6},
                {x: 15, y: 6}, {x: 19, y: 8}]
    };
	var levels = [level_0, level_1, level_2, level_3, level_4];
    var LevelsByDifficulty = [[level_0, level_1], 
                              [level_2, level_3], 
                              [level_4]];
	return {
		getLevel: function(levelNumber) {
			return levels[levelNumber];
		},

        getNumLevels: function() {
            return levels.length;
        }
	}

})();