/*
 * - character
 . - background
 # - wall
 @ - box
 ? - store
 ! - box on store
 */

var model = (function() {
    var level =[], map = [];
    var levelNumber, stepsCount;

    return {
        isVictory: function(){
            var map = this.getMap();
            for (var i = 0; i < map.length; ++i)
                for (var j = 0; j < map[0].length; ++j)
                    if (map[i][j] == '@') return false;
            return true;
        },

        setLevel: function(levelNum) {
            levelNumber = levelNum;
            stepsCount = 0;
            level = levels.getLevel(levelNumber);

            for (var i = 0; i < level.map.length; ++i) {
                map[i] = [];
                for (var j = 0; j < level.map[i].length; ++j)
                    map[i][j] = level.map[i][j];
            }

            map[level.charCoords.y][level.charCoords.x] = '*';

            for (var i = 0; i < level.boxes.length; ++i) {
                map[level.boxes[i].y][level.boxes[i].x] = '@';
            }
        },

        incStepCount: function() {
            stepsCount++;
        },

        getStepsCount: function() {
            return stepsCount;
        },

        getLevelNumber: function() {
            return levelNumber;
        },

        getMap: function() {
            return map;
        },

        getLevel: function() {
            return level;
        },

        getCharacterCoords: function() {
            for (var i = 0; i < map.length; ++i) {
                for (var j = 0; j < map[i].length; ++j) {
                    if (map[i][j] == '*')
                        return { x: j, y: i }
                }
            }
        },

        getBoxesCoords: function() {
            var boxes = [];
            for (var i = 0; i < map.length; ++i) {
                for (var j = 0; j < map[i].length; ++j) {
                    if (map[i][j] == '@' || map[i][j] == '!') {
                        boxes.push({x: j, y: i});
                    }
                }
            }
            
            return boxes;
        },

        movedRange: function(xStart, yStart, xFinish, yFinish) {
            return {
                startPos: {
                    x: xStart,
                    y: yStart
                },
                finishPos: {
                    x: xFinish,
                    y: yFinish
                }
            }
        },

        move: function(shiftX, shiftY) {
            var movedElements = [];
            var charCoords = this.getCharacterCoords();

            var to = {
                x: charCoords.x + shiftX,
                y: charCoords.y + shiftY
            }

            if (map[to.y][to.x] == '#') 
                return movedElements;

            if (map[to.y][to.x] == '!')
                map[to.y][to.x] = '@';

            if (map[to.y][to.x] == '@') {
                if (map[to.y + shiftY][to.x + shiftX] == '.' || map[to.y + shiftY][to.x + shiftX] == '?') {
                    if (map[to.y + shiftY][to.x + shiftX] == '?')
                        map[to.y + shiftY][to.x + shiftX] = '!';
                    else
                        map[to.y + shiftY][to.x + shiftX] = map[to.y][to.x];

                    movedElements[0] = this.movedRange(to.x, to.y, to.x + shiftX, to.y + shiftY);
                    map[to.y][to.x] = '*';

                    movedElements[1] = this.movedRange(charCoords.x, charCoords.y, to.x, to.y);
                    map[charCoords.y][charCoords.x] = level.map[charCoords.y][charCoords.x];
                }

                if (map[to.y][to.x] == '@' && level.map[to.y][to.x] == '?')
                    map[to.y][to.x] = '!';

                return movedElements;
            }

            map[to.y][to.x] = '*';
            movedElements[0] = this.movedRange(charCoords.x, charCoords.y, to.x, to.y);
            map[charCoords.y][charCoords.x] = level.map[charCoords.y][charCoords.x];

            return movedElements;
        }

    }

})();
