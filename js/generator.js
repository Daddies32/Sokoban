var generator =  (function(){
    var used = [];
    var map = [];
    var field = [];
    var boxes = [];
    var charCoords;

    String.prototype.splice = function(start, count, str){
        return this.substring(0, start) + str + this.substring(start + count);
    };

    function rndBfs(v, p){
        used[v.x][v.y] = true;

        if (p != undefined) {
            var i = 1 + 3 * Math.max(v.x, p.x) - Math.abs((v.x - p.x));
            var j = 1 + 3 * Math.max(v.y, p.y) - Math.abs((v.y - p.y));
            map[i] = map[i].splice(j, 1, '.');
            i += Math.abs((v.y - p.y));
            j += Math.abs((v.x - p.x));
            map[i] = map[i].splice(j, 1, '.');
        }
        var shift = [
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: -1}
        ];
        for (var i = 0; i < 50; ++i) {
            var ind1 = (Math.random()*100 >> 0) % 4;
            var ind2 = (Math.random()*100 >> 0) % 4;
            var c = shift[ind1];
            shift[ind1] = shift[ind2];
            shift[ind2] = c;
        }

        for (var i = 0; i < 4; ++i) {
            var to = {x: v.x + shift[i].x,
                      y: v.y + shift[i].y};
            if (!used[to.x][to.y])
                rndBfs(to, v);
        }
    };

    function initArrUsed(size) {
        used = [];
        countCell = (((size - 1) / 3) >> 0);
        for (var i = -1; i < countCell + 1; ++i) {
            used[i] = [];
            for (var j = -1; j < countCell + 1; ++j)
                used[i][j] = true;
        }
        for (var i = 0; i < countCell; ++i) {
            for (var j = 0; j < countCell; ++j)
                used[i][j] = false;
        }

        used[0][0] = true;
    }

    return {
        getCharacterCoords: function() {
            for (var i = 0; i < field.length; ++i) {
                for (var j = 0; j < field[i].length; ++j) {
                    if (field[i][j] == '*')
                        return { x: j, y: i }
                }
            }
        },

        getBoxesCoords: function() {
            var boxes = [];
            for (var i = 0; i < field.length; ++i) {
                for (var j = 0; j < field[i].length; ++j) {
                    if (field[i][j] == '@' || field[i][j] == '!') {
                        boxes.push({x: j, y: i});
                    }
                }
            }

            return boxes;
        },

        move: function(shift, size) {
            var x = charCoords.x + shift.x;
            var y = charCoords.y + shift.y;
            if (field[y][x] == '.' || field[y][x] == '?') {
                var x0 = charCoords.x - shift.x;
                var y0 = charCoords.y - shift.y;
                if (field[y0][x0] == '@' || field[y0][x0] == '!') {
                    field[y0] = field[y0].splice(x0, 1, map[y0][x0]);
                    if (map[charCoords.y][charCoords.x] == '.')
                        field[charCoords.y] = field[charCoords.y].splice(charCoords.x, 1, '@');
                    if (map[charCoords.y][charCoords.x] == '?')
                        field[charCoords.y] = field[charCoords.y].splice(charCoords.x, 1, '!');
                    charCoords = {x: x, y: y};
                    field[y] = field[y].splice(x, 1, '*');
                }
                else {
                    field[charCoords.y] = field[charCoords.y].splice(charCoords.x, 1, map[charCoords.y][charCoords.x]);
                    charCoords = {x: x, y: y};
                    field[y] = field[y].splice(x, 1, '*');
                }
            }
        },

        generateLevel: function(size) {
            map = [];
            for (var i = 0; i < size; ++i) {
                map[i] = '';
                for (var j = 0; j < size; ++j)
                    map[i] += '#';
            }
            for (var i = 1; i < (size - 2); i += 3) {
                for (var j = 1; j < (size - 2); j += 3) {
                    map[i] = map[i].splice(j, 2, '..');
                    map[i + 1] = map[i + 1].splice(j, 2, '..');
                }
            }
            
            initArrUsed(size);
            rndBfs({x: 0, y: 0});

            for (var i = 0; i < size; ++i)
                field[i] = map[i];

            var stores = [];
            var boxCount = 15;
            var k = 0;
            while (k < boxCount) {
                var x = (Math.random()*100 >> 0) % size; if (x == 1) ++x;
                var y = (Math.random()*100 >> 0) % size; if (y == 1) ++y;
                if (map[x][y] == '.') {
                    if (function() {
                            for (var i = 0; i < stores.length; ++i) {
                                var distance = Math.sqrt(Math.pow((stores[i].x - x), 2) + Math.pow((stores[i].y - y), 2));
                                if (distance < 2) return true;
                            }
                        return false;
                        }()) continue;
                    stores[k] = {x: x, y: y};
                    ++k;
                    map[x] = map[x].splice(y, 1, '?');
                    field[x] = field[x].splice(y, 1, '!');
                }
            }

            field[1] = field[1].splice(1, 1, '*');
            charCoords = this.getCharacterCoords();

            for (var k = 0; k < 5 * Math.pow(10, 5); ++k) {
                var shift = [
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: -1}
                ];
                rndInd = (Math.random()*100 >> 0) % 4;
                generator.move(shift[rndInd], size);
            };

            return {
                map: map,
                charCoords: this.getCharacterCoords(),
                boxes: this.getBoxesCoords()
            };
        }
    }
})();