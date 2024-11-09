function HeroTile() {
    PIXI.Container.call(this);
    this.row = null;
    this.col = null;
    var self = this;
    //var view = TextureAtlas.createFrame("HeroTile");
    //this.addChild(view);
    //view.y -= 25;

    var mc;
    var inUse = false;

    var walkUpMC = getFrames("walkUp");
    var walkDownMC = getFrames("walkDown");
    var walkLeftMC = getFrames("walkLeft");
    var walkRightMC = getFrames("walkRight");

    var idleUpMC = getFrames("idleUp");
    var idleDownMC = getFrames("idleDown");
    var idleLeftMC = getFrames("idleLeft");
    var idleRightMC = getFrames("idleRight");
    var dir = null;

    var views = [walkUpMC, walkDownMC, walkLeftMC, walkRightMC, idleUpMC, idleDownMC, idleLeftMC, idleRightMC];

    function getFrames(_framePrefix) {
        var frames = [];
        var numFrames = TextureAtlas.getNumOfFrames(_framePrefix);
        trace(numFrames + " in " + _framePrefix);
        for (var i = 0; i < numFrames; i++) {
            var val = i < 10 ? '0' + i : i;
            var textureName = _framePrefix + '00' + val;
            frames.push(PIXI.Texture.fromFrame(textureName));
        }


        mc = new PIXI.extras.AnimatedSprite(frames);
        mc.animationSpeed = 0.4;
        mc.loop = false;
        mc.name = _framePrefix;
        return mc;
    }

    setDir("idleUp");

    this.move = function (_dir, pushingBox) {
        dir = _dir;
        if (dir == "UP") {
            setDir("walkUp", true);
        }
        if (dir == "DOWN") {
            setDir("walkDown", true);
        }
        if (dir == "LEFT") {
            setDir("walkLeft", true);
        }
        if (dir == "RIGHT") {
            setDir("walkRight", true);
        }
    }

    this.halt = function () {
        if (dir == "UP") {
            setDir("idleUp", false);
        }
        if (dir == "DOWN") {
            setDir("idleDown", false);
        }
        if (dir == "LEFT") {
            setDir("idleLeft", false);
        }
        if (dir == "RIGHT") {
            setDir("idleRight", false);
        }
    }

    function setDir(_dirName, _playMe) {
        var view = null;
        var selectedMC = null;

        for (var i = 0; i < views.length; i++) {
            view = views[i];
            if (view.parent) {
                view.loop = false;
                view.stop();
                view.y = 0;
                view.x = 0;
                view.parent.removeChild(view);
            }

            if (view.name == _dirName) {
                selectedMC = view;
            }
        }

        if (selectedMC) {

            self.addChild(selectedMC);
            selectedMC.y -= (selectedMC.height * 0.7);
            selectedMC.x = (Model.TILE_SIZE - selectedMC.width) / 2;
            if (_playMe) {
                selectedMC.gotoAndPlay(0);
                selectedMC.loop = true;
            } else {
                selectedMC.gotoAndStop(0);
                selectedMC.loop = false;
            }


        }
    }




    /* this.play = function (_fnctn) {
         self.fnctn = _fnctn;
         mc.loop = false;
         mc.onComplete = onAnimComplete;
         mc.gotoAndPlay(0);
     }

     function onAnimComplete() {
         self.fnctn(self);
         mc.onComplete = null;
         self.fnctn = null;
     }*/


}
HeroTile.prototype = Object.create(PIXI.Container.prototype);