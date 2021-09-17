function IntroScreen() {
    PIXI.Container.call(this);
    var bg = getQuad(Model.theStage.width, Model.theStage.height, 0x663399);
    this.addChild(bg);
    var view = TextureAtlas.createFrame("IntroScreen");
    view.interactive = true;
    this.addChild(view);
    FitToScreenUtil.fitToScreen(view);

    this.init = function (_fnctn) {
        view.mouseup = view.touchend = function () {
            view.mouseup = view.touchend = null;
            requestFullScreen();
            _fnctn();
        }
    }

}
IntroScreen.prototype = Object.create(PIXI.Container.prototype);