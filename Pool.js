var Pool = {
    pool: {},

    getAsset: function (tileNum) {
        var pool = this.pool;
        var curPool;
        var assetMc;
        var CLS;

        if (tileNum == TileTypes.GROUND_TILE) {
            if (!pool["BGTile"]) {
                pool["BGTile"] = [];
            }
            curPool = pool["BGTile"];
            CLS = BGTile;
        }

        if (tileNum == TileTypes.WALL_TILE) {
            if (!pool["WallTile"]) {
                pool["WallTile"] = [];
            }
            curPool = pool["WallTile"];
            CLS = WallTile;
        }
        if (tileNum == TileTypes.PRIZE_TILE) {
            if (!pool["PrizeTile"]) {
                pool["PrizeTile"] = [];
            }
            curPool = pool["PrizeTile"];
            CLS = PrizeTile;
        }
        if (tileNum == TileTypes.BOX_TILE) {
            if (!pool["BoxTile"]) {
                pool["BoxTile"] = [];
            }
            curPool = pool["BoxTile"];
            CLS = BoxTile;
        }
        if (tileNum == TileTypes.HERO_TILE) {
            if (!pool["HeroTile"]) {
                pool["HeroTile"] = [];
            }
            curPool = pool["HeroTile"];
            CLS = HeroTile;
        }

        if (curPool) {
            for (var i = 0; i < curPool.length; i++) {
                if (curPool[i].inUse == false) {
                    assetMc = curPool[i];
                    trace("GOT FROM POOL");
                    assetMc.inUse = true;
                    assetMc.alpha = 1;
                    break;
                }
            }

            if (assetMc == null) {
                assetMc = new CLS();

                curPool.push(assetMc);
                assetMc.inUse = true;
            }
        }


        return assetMc;
    }

}