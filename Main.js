function Main() {
    PIXI.Container.call(this);


    var currentLevel;
    var speed = 0.2;
    var boxesArr;
    var playerMC;
    var levelNum = 0;
    var bottomArr;
    var topArr;
    var movingBox = false;
    var undoBTN;
    var restartBTN;
    var animCount = 0;
    var sx;
    var sy;
    var ex;
    var ey;
    var levelTF;
    var insTF;

    var game = new PIXI.Container();
    var introScreen = null;
    var self = this;

    this.init = function () {
        //levelNum = Model.levels.length - 1;
        TextureAtlas.init(loadedComplete);
    }

    function loadedComplete() {
        //onIntroClicked();
        showIntroScreen();
    }

    function showIntroScreen() {
        introScreen = new IntroScreen();
        self.addChild(introScreen);
        introScreen.init(onIntroClicked);
    }

    function placeUndoBTN() {
        if (undoBTN) {
            undoBTN.x = Model.theStage.width - undoBTN.width;
            undoBTN.y = Model.theStage.height - undoBTN.height;
        }

    }

    function placeRestartBTN() {
        if (restartBTN) {
            restartBTN.y = Model.theStage.height - restartBTN.height;
        }

    }



    function onIntroClicked() {
        if (introScreen) {
            self.removeChild(introScreen);
        }

        startLevel();
        addListeners();

        undoBTN = TextureAtlas.createFrame("UnDoBTN");
        placeUndoBTN();

        undoBTN.interactive = true;
        undoBTN.mouseup = undoBTN.touchend = onUndoClicked;
        self.addChild(undoBTN);

        restartBTN = TextureAtlas.createFrame("RestartBTN");
        placeRestartBTN();
        restartBTN.interactive = true;
        restartBTN.mouseup = restartBTN.touchend = onRestartClicked;
        self.addChild(restartBTN);

        self.addChild(game);

        insTF = new PIXI.Text("SWIPE TO MOVE", {
            fontFamily: "Arial",
            fontSize: Model.theStage.height / 40,
            fill: 0xffcc00,
            align: 'left'
        });
        self.addChild(insTF);
        insTF.x = (Model.theStage.width - insTF.width) / 2;
    }

    function setLevelText() {

        if (!levelTF) {
            levelTF = new PIXI.Text("", {
                fontFamily: "Arial",
                fontSize: Model.theStage.height / 30,
                fill: 0xffcc00,
                align: 'left'
            });

            self.addChild(levelTF);

        }

        levelTF.text = "LEVEL " + (levelNum + 1);
        placeLevelText();

    }


    function placeLevelText() {
        levelTF.x = (Model.theStage.width - levelTF.width) / 2;
        levelTF.y = (Model.theStage.height - levelTF.height);
    }


    function onRestartClicked(e) {
        startLevel();
        addListeners();
    }



    function onUndoClicked(e) {
        if (playerMC.prevRow) {
            playerMC.row = playerMC.prevRow;
            playerMC.col = playerMC.prevCol;
            playerMC.x = Model.TILE_SIZE * playerMC.col;
            playerMC.y = Model.TILE_SIZE * playerMC.row;
            playerMC.prevRow = null;
            playerMC.prevCol = null;
        }


        var box;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i];
            if (box.prevRow) {
                box.row = box.prevRow;
                box.col = box.prevCol;
                box.x = Model.TILE_SIZE * box.col;
                box.y = Model.TILE_SIZE * box.row;
                box.prevRow = null;
                box.prevCol = null;
            }
        }

        for (var row = 0; row < topArr.length; row++) {
            for (var col = 0; col < topArr[0].length; col++) {
                topArr[row][col] = TileTypes.GROUND_TILE;
            }
        }

        topArr[playerMC.row][playerMC.col] = TileTypes.HERO_TILE;


        for (i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i];
            topArr[box.row][box.col] = TileTypes.BOX_TILE;
        }

        traceTopArr();

    }



    function clearUndoData() {
        playerMC.prevRow = null;
        playerMC.prevCol = null;

        var box;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i];
            box.prevRow = null;
            box.prevCol = null;

        }
    }





    function createStage() {
        bottomArr = [];
        topArr = [];

        var curTileNum = 0;
        var currentLevelRows = currentLevel.length;
        var currentLevelCols = currentLevel[0].length;
        for (var row = 0; row < currentLevelRows; row++) {
            bottomArr.push([]);
            topArr.push([]);
            for (var col = 0; col < currentLevelCols; col++) {
                curTileNum = currentLevel[row][col];

                if (curTileNum == TileTypes.PRIZE_AND_BOX_TILE) {
                    bottomArr[row].push(TileTypes.PRIZE_TILE);
                    topArr[row].push(TileTypes.BOX_TILE);
                }

                if (curTileNum == TileTypes.GROUND_TILE) {
                    bottomArr[row].push(TileTypes.GROUND_TILE);
                    topArr[row].push(TileTypes.GROUND_TILE);
                }

                if (curTileNum == TileTypes.WALL_TILE) {
                    bottomArr[row].push(TileTypes.WALL_TILE);
                    topArr[row].push(TileTypes.GROUND_TILE);
                }

                if (curTileNum == TileTypes.PRIZE_TILE) {
                    bottomArr[row].push(TileTypes.PRIZE_TILE);
                    topArr[row].push(TileTypes.GROUND_TILE);
                }

                if (curTileNum == TileTypes.BOX_TILE) {
                    bottomArr[row].push(TileTypes.GROUND_TILE);
                    topArr[row].push(TileTypes.BOX_TILE);
                }

                if (curTileNum == TileTypes.HERO_TILE) {
                    bottomArr[row].push(TileTypes.GROUND_TILE);
                    topArr[row].push(TileTypes.HERO_TILE);
                }

            }
        }

    }



    function addListeners() {
        //stage.addEventListener(KeyboardEvent.KEY_UP, keyIsPressed);
        game.interactive = true;
        game.touchstart = game.mousedown = onTouchStart;
        game.touchend = game.mouseupoutside = game.mouseup = game.touchendoutside = onTouchEnd;
    }



    function onTouchStart(interactionData) {
        initialPoint = interactionData.data.global;
        sx = initialPoint.x;
        sy = initialPoint.y;

    }

    function onTouchEnd(interactionData) {
        insTF.visible = false;
        finalPoint = interactionData.data.global;
        ex = finalPoint.x;
        ey = finalPoint.y;
        var xAbs = Math.abs(sx - ex);
        var yAbs = Math.abs(sy - ey);
        var keyCode = null;
        if (xAbs > 20 || yAbs > 20) { //check if distance between two points is greater then 20 otherwise discard swap event

            if (xAbs > yAbs) {

                if (ex < sx) {
                    keyCode = "LEFT";
                } else {
                    keyCode = "RIGHT";
                }

            } else {

                if (ey < sy) {
                    keyCode = "UP";
                } else {
                    keyCode = "DOWN";
                }

            }
        }
        keyIsPressed({
            keyCode: keyCode
        });
    }



    function removeListeners() {
        //stage.removeEventListener(KeyboardEvent.KEY_UP, keyIsPressed);
        game.interactive = false;
        game.touchstart = game.mousedown = null;
        game.touchend = game.mouseupoutside = game.mouseup = game.touchendoutside = null;
    }



    function keyIsPressed(event) {
        movingBox = false;
        clearUndoData();
        movePlayer(event.keyCode);
    }





    function isValidMove(_row, _col) {
        trace("------")
        var valid = false;
        var btmDestBlock = 0;
        var topDestBlock = 0;
        var boxDestBlock;

        btmDestBlock = bottomArr[playerMC.row + _row][playerMC.col + _col];
        topDestBlock = topArr[playerMC.row + _row][playerMC.col + _col];

        if (btmDestBlock == TileTypes.GROUND_TILE || btmDestBlock == TileTypes.PRIZE_TILE) //if empty or prize proceed
        {
            valid = true;
        }

        if (topDestBlock == TileTypes.BOX_TILE) //if box
        {
            var currBoxRow = playerMC.row + _row;
            var currBoxCol = playerMC.col + _col;

            var newBoxRow = currBoxRow + _row;
            var newBoxCol = currBoxCol + _col;

            boxDestBlock = bottomArr[newBoxRow][newBoxCol];
            if ((boxDestBlock == TileTypes.GROUND_TILE || boxDestBlock == TileTypes.PRIZE_TILE) && topArr[newBoxRow][newBoxCol] != TileTypes.BOX_TILE) {
                var box = getBox(currBoxRow, currBoxCol);

                box.prevRow = box.row;
                box.prevCol = box.col;

                box.row = newBoxRow;
                box.col = newBoxCol;
                topArr[newBoxRow][newBoxCol] = TileTypes.BOX_TILE;
                valid = true;
                movingBox = true;
            } else {
                valid = false;
            }
        }

        if (valid) {
            topArr[playerMC.row][playerMC.col] = TileTypes.GROUND_TILE;

        }

        return valid;
    }



    function getBox(currBoxRow, currBoxCol) {
        var box;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i]
            if (box.row == currBoxRow && box.col == currBoxCol) {
                return box;
            }
        }
        return null;
    }



    function movePlayer(dir) {
        var origRow = playerMC.row;
        var origCol = playerMC.col;
        var isMoving = false;

        playerMC.prevRow = origRow;
        playerMC.prevCol = origCol;


        if (dir == "UP") {
            if (isValidMove(-1, 0)) {
                playerMC.row--;
                isMoving = true;
            }
        }
        if (dir == "DOWN") {
            if (isValidMove(1, 0)) {
                playerMC.row++;
                isMoving = true;
            }
        }
        if (dir == "LEFT") {
            if (isValidMove(0, -1)) {
                playerMC.col--;
                isMoving = true;
            }
        }
        if (dir == "RIGHT") {
            if (isValidMove(0, 1)) {
                playerMC.col++;
                isMoving = true;
            }
        }
        if (isMoving) {
            topArr[playerMC.row][playerMC.col] = TileTypes.HERO_TILE;
            movePlayerAndBoxes(origRow, origCol, dir);
        }


    }



    function movePlayerAndBoxes(origRow, origCol, dir) {
        sortAll();
        removeListeners();
        var moveSpeed = speed;
        if (movingBox) {
            moveSpeed = speed * 2;
            playerMC.move(dir, true);
        } else {
            playerMC.move(dir, false);
        }

        var destRow = (playerMC.col - origCol);
        var destCol = (playerMC.row - origRow);
        //trace(destRow, destCol);

        var moveAmountY = Model.TILE_SIZE * destCol;
        var moveAmountX = Model.TILE_SIZE * destRow;


        //TweenLite.to(this, moveSpeed, { ease:Linear.easeNone, x : this.x - moveAmountX, y : this.y - moveAmountY } );
        TweenLite.to(playerMC, moveSpeed, {
            ease: Linear.easeNone,
            x: Model.TILE_SIZE * playerMC.col,
            y: Model.TILE_SIZE * playerMC.row,
            onComplete: onMoveComplete
        })

        var box;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i]
            TweenLite.to(box, moveSpeed, {
                ease: Linear.easeNone,
                x: Model.TILE_SIZE * box.col,
                y: Model.TILE_SIZE * box.row
            })
        }
    }



    function onMoveComplete() {
        //traceTopArr();
        playerMC.halt();

        var isWin = checkWin();
        if (isWin) {
            TweenLite.to(this, 0.1, {
                onComplete: function () {
                    trace("WIN!!!");
                    playWinAnimation();

                }
            });
        } else {
            addListeners();
        }

    }



    function playWinAnimation() {
        var box;
        var delay = 0.1;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i];
            TweenLite.to(box, 1, {
                delay: delay,
                y: -(box.height * 2),
                alpha: 0,
                onComplete: animCompleted
            });
            delay += 0.1;
        }
    }



    function animCompleted() {
        animCount++;
        if (animCount == boxesArr.length) {
            setTimeout(function () {
                levelNum++;

                if (levelNum >= Model.levels.length) {
                    levelNum = 0;
                }
                startLevel();
                addListeners();
            }, 500);

        }
    }



    function traceTopArr() {
        var currentLevelRows = topArr.length;
        var currentLevelCols = topArr[0].length;

        for (var row = 0; row < currentLevelRows; row++) {
            trace(topArr[row])
        }
        trace("--")
    }



    function checkWin() {
        var box;
        for (var i = 0; i < boxesArr.length; i++) {
            box = boxesArr[i];
            box.alpha = 1;
        }


        var isWin = false;
        var curBTMTileNum = 0;
        var curToptileNum = 0;
        var win = true;
        var numPrizes = 0;
        var numMatches = 0;
        var currentLevelRows = currentLevel.length;
        var currentLevelCols = currentLevel[0].length;
        outer: for (var row = 0; row < currentLevelRows; row++) {
            for (var col = 0; col < currentLevelCols; col++) {
                curBTMTileNum = bottomArr[row][col];
                curToptileNum = topArr[row][col];
                if (curBTMTileNum == TileTypes.PRIZE_TILE) {
                    numPrizes++;
                    if (curToptileNum == TileTypes.BOX_TILE) {
                        box = getBox(row, col);
                        box.alpha = 0.7;
                        numMatches++;
                    }
                }
            }
        }

        if (numPrizes == numMatches) {
            return true;
        } else {
            return false;
        }
    }



    function startLevel() {
        animCount = 0;
        playerMC = null;
        boxesArr = [];
        game.scale.x = 1;
        game.scale.y = 1;
        currentLevel = Model.levels[levelNum];
        clearStage();
        createStage();
        renderLevel();
        sortAll();
        checkWin();
        FitToScreenUtil.fitToScreen(game);
        setLevelText();
        placeUndoBTN();
        placeRestartBTN();
        placeLevelText()

    }

    this.fitToScreen = function () {
        FitToScreenUtil.fitToScreen(game);
        placeUndoBTN();
        placeRestartBTN();
        placeLevelText()
    }







    function sortAll() {
        var a = [];
        var child = null;
        for (var i = 0; i < game.children.length; i++) {
            child = game.children[i];
            if (child instanceof PrizeTile || child instanceof BGTile) {

            } else {
                a.push(child);
            }

        }


        sortOn(a, "row");

        var colsArr = [[]];
        var row = 0;
        for (i = 0; i < a.length; i++) {
            child = a[i];
            if (row == child.row) {
                colsArr[row].push(child);
            } else {
                colsArr.push([]);
                row++;
                colsArr[row].push(child);
            }
        }

        for (i = 0; i < colsArr.length; i++) {
            sortOn(colsArr[i], "col");
            for (var j = 0; j < colsArr[i].length; j++) {
                game.addChild(colsArr[i][j]);
            }

        }


        //
    }

    function sortOn(arr, condition) {
        var l = arr.length;
        var obj1 = null;
        var obj2 = null;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l; j++) {
                obj1 = arr[i];
                obj2 = arr[j];
                if (obj1[condition] < obj2[condition]) {
                    arr[i] = obj2;
                    arr[j] = obj1;
                }
            }
        }
    }





    function clearStage() {
        var child;
        while (game.children.length) {
            child = game.children[0];
            child.inUse = false;
            child.x = 0;
            child.y = 0;
            child.row = null;
            child.col = null;
            game.removeChild(child);
            trace("REMOVED!");
        }
        trace("game.children.length " + game.children.length);
    }





    function renderLevel() {

        var curTileNum = 0;
        var block;

        var currentLevelRows = bottomArr.length;
        var currentLevelCols = bottomArr[0].length;
        for (var row = 0; row < currentLevelRows; row++) {
            for (var col = 0; col < currentLevelCols; col++) {
                curTileNum = bottomArr[row][col];

                if (curTileNum == TileTypes.PRIZE_AND_BOX_TILE) {
                    curTileNum = TileTypes.PRIZE_TILE;
                }

                block = Pool.getAsset(curTileNum);
                if (block) {
                    if (curTileNum == TileTypes.PRIZE_TILE) {
                        game.addChildAt(block, 0);
                    } else {
                        game.addChild(block);
                    }


                    block.row = row;
                    block.col = col;
                    block.x = Model.TILE_SIZE * col;
                    block.y = Model.TILE_SIZE * row;

                }
                block = null;
            }
        }


        currentLevelRows = topArr.length;
        currentLevelCols = topArr[0].length;
        for (row = 0; row < currentLevelRows; row++) {
            for (col = 0; col < currentLevelCols; col++) {
                curTileNum = topArr[row][col];

                if (curTileNum == TileTypes.PRIZE_AND_BOX_TILE) {
                    curTileNum = TileTypes.BOX_TILE;
                }

                block = Pool.getAsset(curTileNum);
                if (block) {
                    if (curTileNum == TileTypes.BOX_TILE) {
                        game.addChild(block);
                        block.x = Model.TILE_SIZE * col;
                        block.y = Model.TILE_SIZE * row;
                        boxesArr.push(block);
                        block.row = row;
                        block.col = col;
                    }

                    if (curTileNum == TileTypes.HERO_TILE) {
                        game.addChild(block);
                        playerMC = block;
                        playerMC.row = row;
                        playerMC.col = col;
                        playerMC.x = Model.TILE_SIZE * playerMC.col;
                        playerMC.y = Model.TILE_SIZE * playerMC.row;
                    }
                }
                block = null;
            }
        }



    }
}

Main.prototype = Object.create(PIXI.Container.prototype);