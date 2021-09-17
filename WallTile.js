function WallTile() {
    PIXI.Container.call(this);
    this.row = null;
    this.col = null;
    var view = TextureAtlas.createFrame("WallTile");
    this.addChild(view);
    view.y -= 25;
}
WallTile.prototype = Object.create(PIXI.Container.prototype);