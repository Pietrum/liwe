const Tile = require('./layer/tile.js');
const Vector2 = require('../../../util/vector/vec2');

class Layer {
  constructor(columns, rows, tilemap) {
    this.m_Size = Vector2(columns, rows);
    this.m_Tilemap = tilemap;
    this.m_Tiles = [];

    // resize tilemap bounds
    const layerW = this.m_Size.x * tilemap.m_Tile.w;
    const layerH = this.m_Size.y * tilemap.m_Tile.h;
    if (layerW > tilemap.size.w) {
      tilemap.size.w = layerW;
    }
    if (layerH > tilemap.size.h) {
      tilemap.size.h = layerH;
    }
  }

  destructor() {
  }

  init(defaults) {
    for (let y = 0; y < this.m_Size.y; y += 1)
      for (let x = 0; x < this.m_Size.x; x += 1) {
        const tile = new Tile(this, x, y);
        tile.color = defaults.color;
        tile.uv = this.m_UVs[defaults.index];

        this.m_Tiles.push(tile);
      }

    // for chaining
    return this;
  }

  update(data) {
    if (data instanceof Array) {
      data.forEach((uv, i) => {
        this.m_Tiles[i].uv = this.m_UVs[uv];
      });
    } else {
      Object.keys(data).map((i) => {
        if (!this.m_Tiles[i]) return;
        this.m_Tiles[i].color = data[i][1];
        this.m_Tiles[i].uv = this.m_UVs[data[i][0]];
      });
    }

    // for chaining
    return this;
  }
}

/**
 * Expose.
 *
 * @type {Layer}
 */
module.exports = Layer;
