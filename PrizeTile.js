function PrizeTile() {
    PIXI.Container.call(this);
    this.row = null;
    this.col = null;
    var view = TextureAtlas.createFrame("PrizeTile");
    this.addChild(view);
}
PrizeTile.prototype = Object.create(PIXI.Container.prototype);