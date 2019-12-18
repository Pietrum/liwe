const Entity = require('../../../entity');

class Tile extends Entity {
  constructor(layer, x, y) {
    super();

    this.m_Layer = layer;
    this.m_X = x;
    this.m_Y = y;
    this.size.w = layer.m_Tilemap.m_Tile.w;
    this.size.h = layer.m_Tilemap.m_Tile.h;
    this.textureID = layer.m_Tilemap.textureID;
  }

  get position() {
    this.m_Position.x = this.m_Layer.m_Tilemap.position.x + this.m_X * this.size.w;
    this.m_Position.y = this.m_Layer.m_Tilemap.position.y + this.m_Y * this.size.h;

    return super.position;
  }
}

/**
 * Expose.
 *
 * @type {Tile}
 */
module.exports = Tile;
