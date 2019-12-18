class Loader extends Liwe.Scene2D {
  onInit() {
  }
  onAttach() {
  }
  onDetach() {
  }
}

class GameScene extends Liwe.Scene2D {
  onInit() {
    return Promise.all([
      Liwe.Material.loadImage('tint', './assets/tint.png'),
      Liwe.Material.loadImage('tile', './assets/tile.png'),
    ]);
  }

  onAttach() {
    const tilemap = Liwe.Asset.createTilemap('board', { width: 16, height: 16 })
      .addTileset('tint');

    tilemap.createLayer({ columns: 11, rows: 3 }, { index: 10, color: 0x0066aa })
      .update([1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])
      .update({
        22: [ 0, 0x00ff00 ], 23: [ 1, 0x00ff00 ],
        25: [ 3, 0x00ffff ], 26: [ 4, 0x00ffff ],
        28: [ 6, 0xffff00 ], 29: [ 7, 0xffff00 ],
        32: [ 10, 0xffffff ]
      });

    Liwe.Event.on(Liwe.Event.MOUSE_POINTER_MOVE, (x, y) => {
      marker.position.x = Math.floor(x / 16) * 16;
      marker.position.y = Math.floor(y / 16) * 16;
    });

    const marker = Liwe.Asset.createSprite('marker', { width: 16, height: 16 });
  }

  onRender() {
    Liwe.Asset.submitTilemap('board', this.submit);
    Liwe.Asset.submitSprite('marker', this.submit);
    Liwe.Material.bind('tint', 1);
    this.draw();
  }
}

class GUI extends Liwe.Scene2D {
  onInit() {
  }

  onAttach() {
  }
}

class App extends Liwe {
  onInit() {
    // scenes
    const loader = new Loader();
    const game = new GameScene(false);
    const gui = new GUI(false);

    this.pushScene(loader);
    Promise.all([game.init(), gui.init()]).then(() => {
      this.popScene(loader);
      this.pushScene(game);
      this.pushScene(gui, true);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App('liwe', {
    width: window.innerWidth,
    height: window.innerHeight,
  });
  app.launch();
}, false);
