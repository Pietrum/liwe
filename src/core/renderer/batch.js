const Renderer = require('../renderer');

const GLIndexBuffer = require('../../gl/indexBuffer');
const GLVertexBuffer = require('../../gl/vertexBuffer');
const GLVertexArray = require('../../gl/vertexArray');

class BatchRenderer extends Renderer {
  constructor() {
    const vertexShader = `#version 300 es
    layout(location = 0) in vec3 a_Position;
    layout(location = 1) in vec4 a_Color;
    layout(location = 2) in vec2 a_TextureUV;
    layout(location = 3) in float a_TextureID;
    
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    
    out vec4 v_Color;
    out vec2 v_TextureUV;
    out float v_TextureID;
    
    void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * vec4(a_Position, 1.0);
      v_Color = a_Color;
      v_TextureUV = a_TextureUV;
      v_TextureID = a_TextureID;
    }`;

    const fragmentShader = `#version 300 es
    precision highp float;
    precision highp int;
    
    in vec4 v_Color;
    in vec2 v_TextureUV;
    in float v_TextureID;
    
    uniform sampler2D u_Textures[8];
    
    out vec4 color;
    
    void main() {
      color = v_Color;
      if (v_TextureID > 0.0) {
        color = texture(u_Textures[int(v_TextureID)], v_TextureUV);
        color = vec4(mix(v_Color.rgb, color.rgb, color.a), 1);
      }
    }`;

    super(vertexShader, fragmentShader);
  }

  init(w, h) {
    super.init(w, h);

    // INT_16 =      32766 [ 6 *      5461 ]
    // INT_32 = 2147483646 [ 6 * 357913941 ]

    const MAX_SPRITES = 50000;
    const SPRITE_SIZE = 36; // [12, 16, 8]
    const INDICES_SIZE = MAX_SPRITES * 6;

    const indices = [];
    let offset = 0;
    for (let i = 0; i < INDICES_SIZE; i += 6) {
      indices[i + 0] = offset + 0;
      indices[i + 1] = offset + 1;
      indices[i + 2] = offset + 2;
      indices[i + 3] = offset + 2;
      indices[i + 4] = offset + 3;
      indices[i + 5] = offset + 0;

      offset += 4;
    }

    const ibo = new GLIndexBuffer(new Uint32Array(indices));
    const vbo = new GLVertexBuffer(offset * SPRITE_SIZE, 'dynamic_draw');

    this.m_VAO = new GLVertexArray();
    this.m_VAO.bind();
    this.m_VAO.setIndexBuffer(ibo);
    this.m_VAO.setVertexBuffer(vbo, [12, 16, 8, 4]);
    this.m_VAO.constructor.unbind();
  }

  preRender(camera) {
    super.preRender(camera);

    this.m_VAO.bind();
    this.m_VAO.m_VBO.bind();
    this.m_VAO.m_IBO.bind();

    this.m_IBC = 0;
    this.m_VAC = 0;
  }

  postRender() {
    this.m_VAO.m_VBO.constructor.unbind();
    this.m_VAO.m_IBO.constructor.unbind();
    this.m_VAO.constructor.unbind();

    super.postRender();
  }

  submit(entity) {
    const p = entity.position;
    const s = entity.size;
    const c = entity.color;
    const u = entity.uv;

    const buffer = [];
    buffer.push(
      /** position */ p.x, p.y, p.z,
      /** color    */ c.r, c.g, c.b, c.a,
      /** tex uv   */ u[0], u[1],
      /** tex id   */ entity.textureID,
    );
    buffer.push(
      /** position */ p.x, p.y + s.h, p.z,
      /** color    */ c.r, c.g, c.b, c.a,
      /** uv       */ u[2], u[3],
      /** tex id   */ entity.textureID,
    );
    buffer.push(
      /** position */ p.x + s.w, p.y + s.h, p.z,
      /** color    */ c.r, c.g, c.b, c.a,
      /** uv       */ u[4], u[5],
      /** tex id   */ entity.textureID,
    );
    buffer.push(
      /** position */ p.x + s.w, p.y, p.z,
      /** color    */ c.r, c.g, c.b, c.a,
      /** uv       */ u[6], u[7],
      /** tex id   */ entity.textureID,
    );

    this.m_VAO.m_VBO.constructor.subData(this.m_VAC, new Float32Array(buffer));
    this.m_IBC += 6;
    this.m_VAC += buffer.length * 4;
  }

  draw() {
    Renderer.draw(this.m_IBC);
  }
}

/**
 * Expose.
 *
 * @type {BatchRenderer}
 */
module.exports = BatchRenderer;
