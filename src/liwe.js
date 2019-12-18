const Event = require('./core/event');
const Renderer = require('./core/renderer');
const Stage = require('./core/stage');
const Stack = require('./core/stack');

const Scene2D = require('./core/scene/2d');
const Scene3D = require('./core/scene/3d');

const Asset = require('./graphic/asset');
const Material = require('./graphic/material/instance');

const Vector2 = require('./util/vector/vec2');
const Vector3 = require('./util/vector/vector3.js');
const Vector4 = require('./util/vector/vector4.js');

class Liwe {
  constructor(name, opts) {
    this.m_Name = name;
    this.m_Size = {
      w: opts.width,
      h: opts.height,
    };
    this.m_Stack = new Stack(this.m_Size);
    this.m_PreviousTime = 0;

    //
    this.pushScene = this.m_Stack.push.bind(this.m_Stack);
    this.popScene = this.m_Stack.pop.bind(this.m_Stack);
  }

  launch() {
    Stage.init(this.m_Name, this.m_Size);
    this.onInit();
    this.render(0);
  }

  render(time) {
    const dt = (time - this.m_PreviousTime) / 1000;

    Renderer.clear();
    this.m_Stack.m_Scenes.forEach((scene) => {
      scene.render(dt);
    });
    this.m_PreviousTime = time;

    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
  }

  // pure functions!
  onInit() {};
}

// public access
Liwe.Event = Event;
Liwe.Scene2D = Scene2D;
Liwe.Scene3D = Scene3D;
Liwe.Asset = Asset;
Liwe.Material = Material;

Liwe.Vector2 = Vector2;
Liwe.Vector3 = Vector3;
Liwe.Vector4 = Vector4;

/**
 * Expose.
 *
 * @public
 */
window.Liwe = Liwe;
