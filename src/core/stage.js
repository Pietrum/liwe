class Stage {
  constructor() {
    Stage.s_Instance = this;

    this.m_Canvas = document.createElement('canvas');
    // disable right click
    this.m_Canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  static init(name, rect) {
    const canvas = Stage.getCanvas();

    canvas.id = name;
    canvas.height = rect.h;
    canvas.width = rect.w;

    document.getElementsByTagName('body')[0].appendChild(canvas);
  }

  static getCanvas() {
    return Stage.s_Instance.m_Canvas;
  }

  static getContext() {
    const stage = new Stage();
    return stage.m_Canvas.getContext('webgl2');
  }
}

module.exports = Stage;
