/*
 * - character
 . - background
 # - wall
 @ - box
 ? - store
 ! - box on store
 */

var model = (function() {
    String.prototype.replaceAt = function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    }

    var level =[], map = [], backMoves = [], solveWay;
    var levelNumber, stepsCount;

    var updateLevelInfo = function(levelNum, lvl) {
        levelNumber = levelNum;
        stepsCount = 0; 
        level = lvl;
        model.freeBackMoves();
        model.setMap(level);
    }

    return {
        isVictory: function() {
            var map = this.getMap();

            for (var i = 0; i < map.length; ++i)
                for (var j = 0; j < map[0].length; ++j)
                    if (map[i][j] == '@') return false;
                
            return true;
        },

        setMap: function(level){
            map = [];
            for (var i = 0; i < level.map.length; ++i) {
                map[i] = '';
                for (var j = 0; j < level.map[i].length; ++j)
                    map[i] += level.map[i][j];
            }

            map[level.charCoords.y] = map[level.charCoords.y].replaceAt(level.charCoords.x, '*');

            for (var i = 0; i < level.boxes.length; ++i) {
                map[level.boxes[i].y] = map[level.boxes[i].y].replaceAt(level.boxes[i].x, '@');
                if (level.map[level.boxes[i].y][level.boxes[i].x] == '?')
                    map[level.boxes[i].y] = map[level.boxes[i].y].replaceAt(level.boxes[i].x, '!');
            }
        },

        setGenLevel: function(size) {
            var genlevel = generator.generateLevel(size);
            updateLevelInfo('Gen', genlevel.level);
            solveWay = genlevel.solve;
        },

        getSolveWay: function() {
            return solveWay;
        },

        setLevel: function(levelNum) {
            updateLevelInfo(levelNum, levels.getLevel(levelNum));
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
                map[to.y] = map[to.y].replaceAt(to.x, '@');

            if (map[to.y][to.x] == '@') {
                if (map[to.y + shiftY][to.x + shiftX] == '.' || map[to.y + shiftY][to.x + shiftX] == '?') {
                    if (map[to.y + shiftY][to.x + shiftX] == '?')
                        map[to.y + shiftY] = map[to.y + shiftY].replaceAt(to.x + shiftX, '!');
                    else
                        map[to.y + shiftY] = map[to.y + shiftY].replaceAt(to.x + shiftX, map[to.y][to.x]);

                    movedElements[0] = this.movedRange(charCoords.x, charCoords.y, to.x, to.y);
                    map[charCoords.y] = map[charCoords.y].replaceAt(charCoords.x,
                        level.map[charCoords.y][charCoords.x]);

                    movedElements[1] = this.movedRange(to.x, to.y, to.x + shiftX, to.y + shiftY);
                    map[to.y] = map[to.y].replaceAt(to.x, '*');
                }

                if (map[to.y][to.x] == '@' && level.map[to.y][to.x] == '?')
                    map[to.y] = map[to.y].replaceAt(to.x, '!');
            }
            else {
                map[to.y] = map[to.y].replaceAt(to.x, '*');
                movedElements[0] = this.movedRange(charCoords.x, charCoords.y, to.x, to.y);
                map[charCoords.y] = map[charCoords.y].replaceAt(charCoords.x, level.map[charCoords.y][charCoords.x]);
            }

            backMoves.push(movedElements);

            return movedElements;
        },

        freeBackMoves: function() {
            backMoves = [];
        },

        moveBack: function() {
            if (backMoves.length == 0)
                return;

            var back = backMoves.pop();
            for (var i = 0; i < back.length; ++i) {
                map[back[i].startPos.y] = map[back[i].startPos.y].replaceAt(back[i].startPos.x, map[back[i].finishPos.y][back[i].finishPos.x]);
                if (map[back[i].finishPos.y][back[i].finishPos.x] == '!' && level.map[back[i].startPos.y][back[i].startPos.x] != '?')
                    map[back[i].startPos.y] = map[back[i].startPos.y].replaceAt(back[i].startPos.x, '@');
                else if (map[back[i].finishPos.y][back[i].finishPos.x] == '@' && level.map[back[i].startPos.y][back[i].startPos.x] == '?')
                    map[back[i].startPos.y] = map[back[i].startPos.y].replaceAt(back[i].startPos.x, '!');  
                      
                map[back[i].finishPos.y] = map[back[i].finishPos.y].replaceAt(back[i].finishPos.x, level.map[back[i].finishPos.y][back[i].finishPos.x]);
            }
        }
    }

})();
