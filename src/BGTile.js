function BGTile() {
    PIXI.Container.call(this);
    this.row = null;
    this.col = null;
    var view = TextureAtlas.createFrame("BGTile");
    this.addChild(view);
}
BGTile.prototype = Object.create(PIXI.Container.prototype);