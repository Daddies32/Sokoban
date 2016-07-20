var solver = (function() {
    var map = [];
    var charCoords;
    var boxes = [];
    var usedStates = [];
    var used = [];
    var shift = [
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1}
    ];
    var k = 0;
    var way = [];
    var resultWay = '';
    var backShift = [2, 3, 0, 1];
    var orientation = ['l', 'u', 'r', 'd'];
    var interferingBoxes = [];

    function initStates() {
        for (var i = 0; i < map.length; ++i) {
            usedStates[i] = [];
            for (var j = 0; j < map[0].length; ++j) {
                usedStates[i][j] = [];
                for (var k = 0; k < 4; ++k)
                    usedStates[i][j][k] = false;
            }
        }
        for (var i = 0; i < map.length; ++i) {
            way[i] = [];
            interferingBoxes[i] = [];
            for (var j = 0; j < map[0].length; ++j) {
                way[i][j] = [];
                interferingBoxes[i][j] = [];
                for (var k = 0; k < 4; ++k) {
                    way[i][j][k] = '';
                    interferingBoxes[i][j][k] = [];
                }
            }
        }
    };

    String.prototype.splice = function(start, count, str){
        return this.substring(0, start) + str + this.substring(start + count);
    };

    String.prototype.reverse = function () {
        return this.split('').reverse().join('');
    };

    function initUsed() {
        for (var i = 0; i < map.length; ++i) {
            used[i] = [];
            for (var j = 0; j < map[0].length; ++j)
                used[i][j] = false;
        }
    };

    function findWayToBox(char, finish, curBoxInd) {
        var queue = [], l = 0, r = 1;
        queue[l] = char;
        var wayToBox = [];
        let interferingBoxes = [];
        if (map[finish.y][finish.x] == '#')
            return 'no way';
        for (var i = 0; i < map.length; ++i) {
            wayToBox[i] = [];
            interferingBoxes[i] = [];
            for (var j = 0; j < map[0].length; ++j) {
                interferingBoxes[i][j] = [];
            }
        }
        wayToBox[char.x][char.y] = '';
        while (l < r) {
            ++k;
            var v = queue[l];
            used[v.x][v.y] = true;
            if (v.x == finish.x && v.y == finish.y) {
                //if (interferingBoxes[v.x][v.y].length == 0)
                    return wayToBox[v.x][v.y];
                //return interferingBoxes[v.x][v.y];
            }
            l++;
            for (var i = 0; i < 4; ++i) {
                var to = {x: v.x + shift[i].x, y: v.y + shift[i].y};
                if (!(function(){
                    for (var j = 0; j < boxes.length; ++j)
                        if (boxes[j].x == to.x && boxes[j].y == to.y) {
                            //if (j == curBoxInd)
                                return false;
                            //interferingBoxes[to.x][to.y].push(j);
                        }
                    return true;
                })()) continue;
                if (map[to.y][to.x] == '.' || map[to.y][to.x] == '?')
                    if (!used[to.x][to.y]) {
                        queue[r] = to;
                        used[to.x][to.y] = true;
                        wayToBox[to.x][to.y] = wayToBox[v.x][v.y] + orientation[i];
                        //interferingBoxes[to.x][to.y].concat(interferingBoxes[v.x][v.y]);
                        r++;
                    }
            }
        }
        return 'no way';
    };

    return {
        findWay: function(boxIndex) {
            var box = boxes[boxIndex];
            var curCharCoords = charCoords;
            var queue = [], l = 0, r = 0;
            for (var i = 0; i < 4; ++i) {
                var x = box.x;
                var y = box.y;
                queue[r] = {
                    x: x,
                    y: y,
                    shift: i
                };
                ++r;
                var curShift = shift[i];
                initUsed();
                var res = findWayToBox(curCharCoords, {x: box.x + curShift.x, y: box.y + curShift.y}, boxIndex);
                if (res == 'no way') {
                    way[x][y][i] = '-';
                    continue;
                }
                way[x][y][i] = res;
                break;
            }

            while (l < r) {
                var state = queue[l];
                ++l;
                usedStates[state.x][state.y][state.shift] = true;
                if (map[state.y][state.x] == '?') {
                    console.log(k);
                    boxes[boxIndex] = {x: state.x, y: state.y};
                    var stateShift = shift[state.shift];
                    charCoords = {x: state.x + stateShift.x, y: state.y + stateShift.y};
                    //if (interferingBoxes[state.x][state.y][state.shift].length == 0)
                        return way[state.x][state.y][state.shift];
                    //return interferingBoxes[state.x][state.y][state.shift];
                }
                if (way[state.x][state.y][state.shift] == '-') continue;

                for (var i = 0; i < 4; ++i) {
                    var newX = state.x + shift[i].x;
                    var newY = state.y + shift[i].y;
                    var oldX = boxes[boxIndex].x;
                    var oldY = boxes[boxIndex].y;
                    boxes[boxIndex] = {x: state.x, y: state.y};
                    //for (var j = 0; j < boxes.length; ++j)
                        //if (boxes[j].x == newX && boxes[j].y == newY)
                            //interferingBoxes[newX][newY][backShift[i]].push(j);
                    if (!(function(){
                        for (var j = 0; j < boxes.length; ++j)
                            if (boxes[j].x == newX && boxes[j].y == newY)
                                return false;
                        return true;
                    })()) continue;
                    if (map[newY][newX] == '.' || map[newY][newX] == '?') {
                        if (!usedStates[newX][newY][backShift[i]]) {
                            curShift = shift[i];
                            stateShift = shift[state.shift];
                            way[newX][newY][backShift[i]] = way[state.x][state.y][state.shift];
                            if (stateShift.x != -curShift.x || stateShift.y != -curShift.y) {
                                initUsed()
                                var char = {x: state.x + stateShift.x, y: state.y + stateShift.y};
                                res = findWayToBox(char, {x: state.x - curShift.x, y: state.y - curShift.y}, boxIndex);
                                //if (Array.isArray(res))
                                   // interferingBoxes[newX][newY][backShift[i]].concat(res);
                                if (res == 'no way') continue;
                                else
                                    way[newX][newY][backShift[i]] += res;
                            }
                            boxes[boxIndex] = {x: oldX, y: oldY};
                            var curBackShift = backShift[i];
                            queue[r] = {
                                x: newX,
                                y: newY,
                                shift: curBackShift
                            };
                            usedStates[newX][newY][curBackShift] = true;
                            ++r;
                            //interferingBoxes[newX][newY][backShift[i]].concat(way[state.x][state.y][state.shift]);
                            way[newX][newY][backShift[i]] += orientation[i];
                        }
                    }
                }
            }
            return 'no way';
        },

        setLevel: function(level) {
            charCoords = level.charCoords;
            boxes = level.boxes;
            for (var i = 0; i < level.map.length; ++i) {
                map[i] = level.map[i];
                /*map[i] = [];
                for (var j = 0; j < level.map[0].length; ++j)
                    map[i][j] = level.map[i][j];*/
            }
        },

        solve: function(level) {
            this.setLevel(level);
            initStates();
            k = 0;
            resultWay = '';
            for (var i = 0; i < boxes.length; ++i) {
                var res = this.findWay(i);
                if (res != 'no way') resultWay += res;
            }
            return resultWay;
        }
    };
})();