function BoxTile() {
    PIXI.Container.call(this);
    this.row = null;
    this.col = null;
    var view = TextureAtlas.createFrame("BoxTile");
    this.addChild(view);
    view.y -= 25;
}
BoxTile.prototype = Object.create(PIXI.Container.prototype);