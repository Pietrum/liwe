const Entity = require('../entity');
const Layer = require('./tilemap/layer');
const Vector2 = require('../../util/vector/vec2.js');
const Material = require('../material/instance');

class Tilemap extends Entity {
  constructor(tile) {
    super();

    tile.width = tile.width || 32;
    tile.height = tile.height || 32;

    this.m_Layers = [];
    this.m_Tile = Vector2(tile.width, tile.height);
    this.m_UVs = {};
    this.textureID = 1;
  }

  destructor() {
  }

  submit(callback) {
    this.m_Layers.forEach((layer) => {
      layer.m_Tiles.forEach((tile) => {
        callback(tile);
      })
    });
  }

  addTileset(name, image, opts) {
    opts = opts || {};
    opts.idx = 0;
    if (opts.w !== undefined) { opts.width = opts.w; delete opts.w; }
    if (opts.h !== undefined) { opts.height = opts.h; delete opts.h; }
    if (opts.width === undefined) { opts.width = this.m_Tile.w; }
    if (opts.height === undefined) { opts.height = this.m_Tile.h; }

    // texture
    const texture = Material.get(image || name);
    const sizeX = texture.width / opts.width;
    const sizeY = texture.height / opts.height;
    // UVs
    const uvX = 1 / sizeX;
    const uvY = 1 / sizeY;
    for (let y = 0; y < sizeY; y += 1)
      for (let x = 0; x < sizeX; x += 1)
        this.m_UVs[x + y * sizeX + opts.idx] = [
          x * uvX, y * uvY,
          x * uvX, y * uvY + uvY,
          x * uvX + uvX, y * uvY + uvY,
          x * uvX + uvX, y * uvY,
        ];

    // for chaining
    return this;
  }

  createLayer(opts, tile) {
    opts.columns = opts.columns || opts.c; delete opts.c;
    opts.rows = opts.rows || opts.r; delete opts.r;
    tile.index = tile.index || tile.i; delete tile.i;
    tile.color = tile.color || tile.c; delete tile.c;

    const layer = new Layer(opts.columns, opts.rows, this);
    layer.m_UVs = this.m_UVs;
    this.m_Layers.push(layer);

    return layer.init(tile);
  }
}

/**
 * Expose.
 *
 * @type {Tilemap}
 */
module.exports = Tilemap;
