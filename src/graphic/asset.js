const Sprite = require('./entity/sprite');
const Tilemap = require('./entity/tilemap');

/**
 * Private members.
 *
 * @type {{
 *  Textures: {}}
 * }
 */
const m = {
  DisplayList: {},
};

module.exports = {
  createSprite: (name, size) => {
    m.DisplayList[name] = Sprite.createBasicColor(size.width, size.height);
    return m.DisplayList[name];
  },

  submitSprite: (name, callback) => {
    if (!m.DisplayList[name] || !(m.DisplayList[name] instanceof Sprite)) {
      return;
    }

    callback(m.DisplayList[name]);
  },

  createTilemap: (name, tile) => {
    tile.width = tile.width || tile.w; delete tile.w;
    tile.height = tile.height || tile.h; delete tile.h;

    m.DisplayList[name] = new Tilemap(tile);
    return m.DisplayList[name];
  },

  destroyTilemap: (name) => {
    if (!m.DisplayList[name]) {
      return;
    }

    m.DisplayList[name].destructor();
    delete m.DisplayList[name];
  },

  submitTilemap: (name, callback) => {
    if (!m.DisplayList[name] || !(m.DisplayList[name] instanceof Tilemap)) {
      return;
    }

    m.DisplayList[name].submit(callback);
  }
};
