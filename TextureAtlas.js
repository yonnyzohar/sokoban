var TextureAtlas = {
    dict: {},
    atlas: null,
    assetsPath: "sokoban.json",
    init: function (_loadCompleteFnctn) {
        PIXI.loader.add(TextureAtlas.assetsPath).load(function () {
            trace("ATLAS LOADED " + TextureAtlas.assetsPath);
            atlas = PIXI.loader.resources[TextureAtlas.assetsPath].textures;
            //GlobalEventDispatcher.getInstance().dispatchEvent("ASSETS_LOADED");
            _loadCompleteFnctn();
        });

    },

    createFrame: function (itemName) {
        //trace(itemName);
        if (!atlas[itemName]) {
            itemName = itemName + "0000";
        }
        var image = new PIXI.Sprite(atlas[itemName]);
        if (image == null) {
            trace("could not create " + itemName);

        }
        return image;
    },

    getNumOfFrames: function (_framePrefix) {
        var num = 0;
        for (var k in atlas) {
            if (k.indexOf(_framePrefix) != -1) {
                num++;
            }
        }
        return num;
    },



    createMovieClip: function (itemName) //:starling.display.MovieClip 
        {
            //trace("itemName: " + itemName);
            //trace(atlas.getTextures(itemName));
            return new MovieClip(atlas.getTextures(itemName), 30);
        }
}