!function r(e, n, t) {
    function o(i, f) {
        if (!n[i]) {
            if (!e[i]) {
                var c = "function" == typeof require && require;
                if (!f && c) return c(i, !0);
                if (u) return u(i, !0);
                var a = new Error("Cannot find module '" + i + "'");
                throw a.code = "MODULE_NOT_FOUND", a;
            }
            var p = n[i] = {
                exports: {}
            };
            e[i][0].call(p.exports, (function(r) {
                return o(e[i][1][r] || r);
            }), p, p.exports, r, e, n, t);
        }
        return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
}({
    1: [ function(require, module, exports) {
        const Matrix44 = require("../util/matrix/mat4");
        module.exports = class {
            constructor(projectionMatrix = Matrix44.IDENTITY(), viewMatrix = Matrix44.IDENTITY()) {
                this.m_ProjectionMatrix = projectionMatrix, this.m_ViewMatrix = viewMatrix;
            }
            get projectionMatrix() {
                return this.m_ProjectionMatrix;
            }
            set projectionMatrix(mat4) {
                this.m_ProjectionMatrix = mat4;
            }
            get viewMatrix() {
                return this.m_ViewMatrix;
            }
            set viewMatrix(mat4) {
                this.m_ViewMatrix = mat4;
            }
        };
    }, {
        "../util/matrix/mat4": 31
    } ],
    2: [ function(require, module, exports) {
        const Camera = require("../camera"), Matrix44 = require("../../util/matrix/mat4");
        module.exports = class extends Camera {
            constructor(width = window.innerWidth, height = window.innerHeight, near = -1, far = 1) {
                super(Matrix44.orthographic(0, width, 0, height, near, far));
            }
        };
    }, {
        "../../util/matrix/mat4": 31,
        "../camera": 1
    } ],
    3: [ function(require, module, exports) {
        const Camera = require("../camera");
        module.exports = class extends Camera {};
    }, {
        "../camera": 1
    } ],
    4: [ function(require, module, exports) {
        const Stage = require("./stage"), Event = {
            MOUSE_BUTTON_PRESSED: "mousedown",
            MOUSE_BUTTON_RELEASED: "mouseup",
            MOUSE_POINTER_MOVE: "mousemove",
            on: function(type, callback) {
                Stage.getCanvas().addEventListener(type, event => {
                    type === this.MOUSE_POINTER_MOVE && callback(event.layerX, event.layerY);
                });
            }
        };
        module.exports = Event;
    }, {
        "./stage": 12
    } ],
    5: [ function(require, module, exports) {
        const GLRenderer = require("../gl/renderer"), GLShader = require("../gl/shader");
        module.exports = class {
            constructor(vss, fss) {
                this.m_Shader = new GLShader(vss, fss);
            }
            init(width = 640, height = 480) {
                GLRenderer.init(), GLRenderer.viewport(0, 0, width, height);
            }
            static clear() {
                GLRenderer.clearColor(0, .2, .5), GLRenderer.clear();
            }
            static draw(count) {
                GLRenderer.draw(count);
            }
            submit(entity) {
                entity.hasChilds && entity.childs.forEach(child => {
                    this.submit(child);
                });
            }
            preRender(camera) {
                this.m_Shader.bind(), this.m_Shader.uploadUniformMat4("u_ProjectionMatrix", camera.projectionMatrix), 
                this.m_Shader.uploadUniformMat4("u_ViewMatrix", camera.viewMatrix), this.m_Shader.uploadUniform1iv("u_Textures", [ 0, 1, 2, 3, 4, 5, 6, 7 ]);
            }
            postRender() {
                this.m_Shader.constructor.unbind(), GLRenderer.finish();
            }
        };
    }, {
        "../gl/renderer": 16,
        "../gl/shader": 17
    } ],
    6: [ function(require, module, exports) {
        const Renderer = require("../renderer"), GLIndexBuffer = require("../../gl/indexBuffer"), GLVertexBuffer = require("../../gl/vertexBuffer"), GLVertexArray = require("../../gl/vertexArray");
        module.exports = class extends Renderer {
            constructor() {
                super("#version 300 es\n    layout(location = 0) in vec2 a_Position;\n    layout(location = 1) in vec4 a_Color;\n    \n    uniform mat4 u_ProjectionMatrix;\n    uniform mat4 u_ViewMatrix;\n    \n    out vec4 v_Color;\n    \n    void main() {\n      v_Color = a_Color;\n      gl_Position = u_ProjectionMatrix * u_ViewMatrix * vec4(a_Position, 0.0, 1.0);\n    }", "#version 300 es\n    precision highp float;\n    precision highp int;\n    \n    in vec4 v_Color;\n    \n    out vec4 color;\n    \n    void main() {\n      color = v_Color;\n    }");
            }
            draw() {
                const ibo = new GLIndexBuffer(new Uint16Array([ 0, 1, 2, 2, 3, 0 ])), vbo = new GLVertexBuffer(new Float32Array([ 50, 50, 1, 0, 0, 1, 50, 100, 1, 1, 0, 1, 100, 100, 1, 0, 1, 1, 100, 50, 0, 1, 1, 1 ]));
                this.m_VAO = new GLVertexArray, this.m_VAO.bind(), this.m_VAO.setIndexBuffer(ibo), 
                this.m_VAO.setVertexBuffer(vbo, [ 8, 16 ]), this.m_VAO.constructor.unbind(), this.m_VAO.bind(), 
                this.m_VAO.m_IBO.bind(), this.m_VAO.m_VBO.bind(), Renderer.draw(this.m_VAO.m_IBO.m_Count), 
                this.m_VAO.m_VBO.constructor.unbind(), this.m_VAO.m_IBO.constructor.unbind(), this.m_VAO.constructor.unbind();
            }
        };
    }, {
        "../../gl/indexBuffer": 15,
        "../../gl/vertexArray": 20,
        "../../gl/vertexBuffer": 21,
        "../renderer": 5
    } ],
    7: [ function(require, module, exports) {
        const Renderer = require("../renderer"), GLIndexBuffer = require("../../gl/indexBuffer"), GLVertexBuffer = require("../../gl/vertexBuffer"), GLVertexArray = require("../../gl/vertexArray");
        module.exports = class extends Renderer {
            constructor() {
                super("#version 300 es\n    layout(location = 0) in vec3 a_Position;\n    layout(location = 1) in vec4 a_Color;\n    layout(location = 2) in vec2 a_TextureUV;\n    layout(location = 3) in float a_TextureID;\n    \n    uniform mat4 u_ProjectionMatrix;\n    uniform mat4 u_ViewMatrix;\n    \n    out vec4 v_Color;\n    out vec2 v_TextureUV;\n    out float v_TextureID;\n    \n    void main() {\n      gl_Position = u_ProjectionMatrix * u_ViewMatrix * vec4(a_Position, 1.0);\n      v_Color = a_Color;\n      v_TextureUV = a_TextureUV;\n      v_TextureID = a_TextureID;\n    }", "#version 300 es\n    precision highp float;\n    precision highp int;\n    \n    in vec4 v_Color;\n    in vec2 v_TextureUV;\n    in float v_TextureID;\n    \n    uniform sampler2D u_Textures[8];\n    \n    out vec4 color;\n    \n    void main() {\n      color = v_Color;\n      if (v_TextureID > 0.0) {\n        color = texture(u_Textures[int(v_TextureID)], v_TextureUV);\n        color = vec4(mix(v_Color.rgb, color.rgb, color.a), 1);\n      }\n    }");
            }
            init(w, h) {
                super.init(w, h);
                const indices = [];
                let offset = 0;
                for (let i = 0; i < 3e5; i += 6) indices[i + 0] = offset + 0, indices[i + 1] = offset + 1, 
                indices[i + 2] = offset + 2, indices[i + 3] = offset + 2, indices[i + 4] = offset + 3, 
                indices[i + 5] = offset + 0, offset += 4;
                const ibo = new GLIndexBuffer(new Uint32Array(indices)), vbo = new GLVertexBuffer(36 * offset, "dynamic_draw");
                this.m_VAO = new GLVertexArray, this.m_VAO.bind(), this.m_VAO.setIndexBuffer(ibo), 
                this.m_VAO.setVertexBuffer(vbo, [ 12, 16, 8, 4 ]), this.m_VAO.constructor.unbind();
            }
            preRender(camera) {
                super.preRender(camera), this.m_VAO.bind(), this.m_VAO.m_VBO.bind(), this.m_VAO.m_IBO.bind(), 
                this.m_IBC = 0, this.m_VAC = 0;
            }
            postRender() {
                this.m_VAO.m_VBO.constructor.unbind(), this.m_VAO.m_IBO.constructor.unbind(), this.m_VAO.constructor.unbind(), 
                super.postRender();
            }
            submit(entity) {
                const p = entity.position, s = entity.size, c = entity.color, u = entity.uv, buffer = [];
                buffer.push(p.x, p.y, p.z, c.r, c.g, c.b, c.a, u[0], u[1], entity.textureID), buffer.push(p.x, p.y + s.h, p.z, c.r, c.g, c.b, c.a, u[2], u[3], entity.textureID), 
                buffer.push(p.x + s.w, p.y + s.h, p.z, c.r, c.g, c.b, c.a, u[4], u[5], entity.textureID), 
                buffer.push(p.x + s.w, p.y, p.z, c.r, c.g, c.b, c.a, u[6], u[7], entity.textureID), 
                this.m_VAO.m_VBO.constructor.subData(this.m_VAC, new Float32Array(buffer)), this.m_IBC += 6, 
                this.m_VAC += 4 * buffer.length;
            }
            draw() {
                Renderer.draw(this.m_IBC);
            }
        };
    }, {
        "../../gl/indexBuffer": 15,
        "../../gl/vertexArray": 20,
        "../../gl/vertexBuffer": 21,
        "../renderer": 5
    } ],
    8: [ function(require, module, exports) {
        const Logger = require("../degugger/logger");
        module.exports = class {
            constructor(renderer, camera) {
                this.m_Camera = camera, this.m_Renderer = renderer, this.m_Renderer.draw && (this.draw = this.m_Renderer.draw.bind(this.m_Renderer)), 
                this.m_Renderer.submit && (this.submit = this.m_Renderer.submit.bind(this.m_Renderer));
            }
            init() {
                Logger.log("[ %s ] initialized", this.constructor.name);
                const result = this.onInit();
                return result instanceof Promise ? result : Promise.resolve(result);
            }
            attach(size) {
                Logger.log("[ %s ] attached", this.constructor.name), this.m_Renderer.init(size.w, size.h), 
                this.onAttach();
            }
            detach() {
                Logger.log("[ %s ] detached", this.constructor.name), this.onDetach();
            }
            render(dt) {
                this.m_Renderer.preRender && this.m_Renderer.preRender(this.m_Camera), this.onRender(dt), 
                this.m_Renderer.postRender && this.m_Renderer.postRender();
            }
            onInit() {}
            onAttach() {}
            onDetach() {}
            onRender() {}
        };
    }, {
        "../degugger/logger": 13
    } ],
    9: [ function(require, module, exports) {
        const Scene = require("../scene"), BatchRenderer = require("../renderer/batch"), OrthographicCamera = require("../camera/orthographic");
        module.exports = class extends Scene {
            constructor(initialize = !0) {
                super(new BatchRenderer, new OrthographicCamera), initialize && this.init();
            }
        };
    }, {
        "../camera/orthographic": 2,
        "../renderer/batch": 7,
        "../scene": 8
    } ],
    10: [ function(require, module, exports) {
        const Scene = require("../scene"), BasicRenderer = require("../renderer/basic"), OrthographicCamera = (require("../camera/perspective"), 
        require("../camera/orthographic"));
        module.exports = class extends Scene {
            constructor(init = !0) {
                super(new BasicRenderer, new OrthographicCamera), init && this.init();
            }
        };
    }, {
        "../camera/orthographic": 2,
        "../camera/perspective": 3,
        "../renderer/basic": 6,
        "../scene": 8
    } ],
    11: [ function(require, module, exports) {
        module.exports = class {
            constructor(size) {
                this.m_Scenes = [], this.m_Size = size, this.m_LastSceneIndex = 0;
            }
            push(scene, overlayer = !1) {
                overlayer ? this.m_Scenes.push(scene) : (this.m_Scenes.splice(this.m_LastSceneIndex, 0, scene), 
                this.m_LastSceneIndex += 1), scene.attach(this.m_Size);
            }
            pop(scene, overlayer = !1) {
                const idx = this.m_Scenes.indexOf(scene);
                -1 !== idx && (scene.detach(), this.m_Scenes.splice(idx, 1), overlayer || (this.m_LastSceneIndex -= 1));
            }
        };
    }, {} ],
    12: [ function(require, module, exports) {
        class Stage {
            constructor() {
                Stage.s_Instance = this, this.m_Canvas = document.createElement("canvas"), this.m_Canvas.addEventListener("contextmenu", e => {
                    e.preventDefault();
                });
            }
            static init(name, rect) {
                const canvas = Stage.getCanvas();
                canvas.id = name, canvas.height = rect.h, canvas.width = rect.w, document.getElementsByTagName("body")[0].appendChild(canvas);
            }
            static getCanvas() {
                return Stage.s_Instance.m_Canvas;
            }
            static getContext() {
                return (new Stage).m_Canvas.getContext("webgl2");
            }
        }
        module.exports = Stage;
    }, {} ],
    13: [ function(require, module, exports) {
        module.exports = {
            log: (...args) => {
                console.log(...args);
            },
            info: (...args) => {
                console.info(...args);
            },
            warn: (...args) => {
                console.warn(...args);
            },
            error: (...args) => {
                console.error(...args);
            }
        };
    }, {} ],
    14: [ function(require, module, exports) {
        const Stage = require("../core/stage");
        module.exports = Stage.getContext();
    }, {
        "../core/stage": 12
    } ],
    15: [ function(require, module, exports) {
        const gl = require("./context");
        class GLIndexBuffer {
            constructor(indices) {
                this.m_ID = gl.createBuffer(), this.m_Count = indices.length, gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_ID), 
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            }
            destructor() {
                gl.deleteBuffer(this.m_ID);
            }
            bind() {
                GLIndexBuffer.s_ID !== this.m_ID && (GLIndexBuffer.s_ID = this.m_ID, gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_ID));
            }
            static unbind() {
                GLIndexBuffer.s_ID = null, gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            }
        }
        module.exports = GLIndexBuffer;
    }, {
        "./context": 14
    } ],
    16: [ function(require, module, exports) {
        const gl = require("./context");
        module.exports = {
            clear: () => {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            },
            clearColor: (r, g, b, a = 1) => {
                gl.clearColor(r, g, b, a);
            },
            draw: count => {
                gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, 0);
            },
            finish: () => {
                gl.finish();
            },
            init: () => {
                gl.enable(gl.BLEND), gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            },
            viewport: (x, y, w, h) => {
                gl.viewport(x, y, w, h);
            }
        };
    }, {
        "./context": 14
    } ],
    17: [ function(require, module, exports) {
        const gl = require("./context");
        class GLShader {
            constructor(vertexShaderSource, fragmentShaderSource) {
                const vs = GLShader.compile(vertexShaderSource, gl.VERTEX_SHADER), fs = GLShader.compile(fragmentShaderSource, gl.FRAGMENT_SHADER);
                this.m_ID = gl.createProgram(), gl.attachShader(this.m_ID, vs), gl.attachShader(this.m_ID, fs), 
                gl.linkProgram(this.m_ID), gl.detachShader(this.m_ID, fs), gl.detachShader(this.m_ID, vs), 
                this.m_Locations = {};
            }
            destructor() {
                gl.deleteProgram(this.m_ID);
            }
            bind() {
                GLShader.s_ID !== this.m_ID && (GLShader.s_ID = this.m_ID, gl.useProgram(this.m_ID));
            }
            static unbind() {
                GLShader.s_ID = null, gl.useProgram(null);
            }
            static compile(source, type) {
                const id = gl.createShader(type);
                if (gl.shaderSource(id, source), gl.compileShader(id), !gl.getShaderParameter(id, gl.COMPILE_STATUS)) throw new Error(`Shader compile error! : \n${gl.getShaderInfoLog(id)}`);
                return id;
            }
            uniformLocationId(name) {
                return this.m_Locations[name] ? this.m_Locations[name] : (this.m_Locations[name] = gl.getUniformLocation(this.m_ID, name), 
                this.m_Locations[name]);
            }
            uploadUniformMat4(name, matrix) {
                const locationId = this.uniformLocationId(name);
                gl.uniformMatrix4fv(locationId, !1, matrix.toFloat32Array());
            }
            uploadUniform1iv(name, value) {
                const locationId = this.uniformLocationId(name);
                gl.uniform1iv(locationId, value);
            }
        }
        module.exports = GLShader;
    }, {
        "./context": 14
    } ],
    18: [ function(require, module, exports) {
        const gl = require("./context"), Vector2 = require("../util/vector/vec2");
        module.exports = class {
            constructor() {
                this.m_ID = gl.createTexture(), this.m_Size = Vector2.ZERO();
            }
            destructor() {
                gl.deleteTexture(this.m_ID);
            }
            bind(slot = 0) {
                gl.activeTexture(gl.TEXTURE0 + slot), gl.bindTexture(gl.TEXTURE_2D, this.m_ID);
            }
            static unbind(slot = 0) {
                gl.activeTexture(gl.TEXTURE0 + slot), gl.bindTexture(gl.TEXTURE_2D, null);
            }
            get width() {
                return this.m_Size.w;
            }
            set width(w) {
                this.m_Size.w = w;
            }
            get height() {
                return this.m_Size.h;
            }
            set height(h) {
                this.m_Size.h = h;
            }
        };
    }, {
        "../util/vector/vec2": 32,
        "./context": 14
    } ],
    19: [ function(require, module, exports) {
        const gl = require("../context"), GLTexture = require("../texture");
        module.exports = class extends GLTexture {
            constructor(image = null) {
                super(), image instanceof Image ? this.useImage(image) : this.useColor(), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), 
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
            useColor(r = 255, g = 255, b = 255) {
                this.width = 1, this.height = 1, gl.bindTexture(gl.TEXTURE_2D, this.m_ID), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([ r, g, b ]));
            }
            useImage(image) {
                this.width = image.width, this.height = image.height, gl.bindTexture(gl.TEXTURE_2D, this.m_ID), 
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
        };
    }, {
        "../context": 14,
        "../texture": 18
    } ],
    20: [ function(require, module, exports) {
        const gl = require("./context");
        class GLVertexArray {
            constructor() {
                this.m_ID = gl.createVertexArray(), this.m_IBO = null, this.m_VBO = null;
            }
            desctructor() {
                gl.deleteVertexArray(this.m_ID);
            }
            bind() {
                GLVertexArray.s_ID !== this.m_ID && (GLVertexArray.s_ID = this.m_ID, gl.bindVertexArray(this.m_ID));
            }
            static unbind() {
                GLVertexArray.s_ID = null, gl.bindVertexArray(null);
            }
            setVertexBuffer(vbo, layout) {
                vbo.bind();
                let offset = 0;
                const stride = layout.reduce((v, s) => s + v, 0);
                layout.forEach((v, idx) => {
                    gl.enableVertexAttribArray(idx), gl.vertexAttribPointer(idx, v / 4, gl.FLOAT, !1, stride, offset), 
                    offset += v;
                }), vbo.constructor.unbind(), this.m_VBO = vbo;
            }
            setIndexBuffer(ibo) {
                this.m_IBO = ibo;
            }
        }
        module.exports = GLVertexArray;
    }, {
        "./context": 14
    } ],
    21: [ function(require, module, exports) {
        const gl = require("./context");
        class GLVertexBuffer {
            constructor(vertices, usage) {
                switch (this.m_ID = gl.createBuffer(), this.m_Usage = gl.NONE, usage) {
                  case "dynamic_draw":
                    this.m_Usage = gl.DYNAMIC_DRAW;
                    break;

                  case "static_draw":
                  default:
                    this.m_Usage = gl.STATIC_DRAW;
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, this.m_ID), gl.bufferData(gl.ARRAY_BUFFER, vertices, this.m_Usage);
            }
            destructor() {
                gl.deleteBuffer(this.m_ID);
            }
            bind() {
                GLVertexBuffer.s_ID !== this.m_ID && (GLVertexBuffer.s_ID = this.m_ID, gl.bindBuffer(gl.ARRAY_BUFFER, this.m_ID));
            }
            static unbind() {
                GLVertexBuffer.s_ID = null, gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
            static subData(offset, data) {
                gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
            }
        }
        module.exports = GLVertexBuffer;
    }, {
        "./context": 14
    } ],
    22: [ function(require, module, exports) {
        const Sprite = require("./entity/sprite"), Tilemap = require("./entity/tilemap"), m = {
            DisplayList: {}
        };
        module.exports = {
            createSprite: (name, size) => (m.DisplayList[name] = Sprite.createBasicColor(size.width, size.height), 
            m.DisplayList[name]),
            submitSprite: (name, callback) => {
                m.DisplayList[name] && m.DisplayList[name] instanceof Sprite && callback(m.DisplayList[name]);
            },
            createTilemap: (name, tile) => (tile.width = tile.width || tile.w, delete tile.w, 
            tile.height = tile.height || tile.h, delete tile.h, m.DisplayList[name] = new Tilemap(tile), 
            m.DisplayList[name]),
            destroyTilemap: name => {
                m.DisplayList[name] && (m.DisplayList[name].destructor(), delete m.DisplayList[name]);
            },
            submitTilemap: (name, callback) => {
                m.DisplayList[name] && m.DisplayList[name] instanceof Tilemap && m.DisplayList[name].submit(callback);
            }
        };
    }, {
        "./entity/sprite": 24,
        "./entity/tilemap": 25
    } ],
    23: [ function(require, module, exports) {
        const Vector2 = require("../util/vector/vec2"), Vector3 = require("../util/vector/vector3"), Vector4 = require("../util/vector/vector4");
        module.exports = class {
            constructor() {
                this.m_Color = new Vector4(1), this.m_Position = new Vector3(0), this.m_Size = Vector2(32), 
                this.m_UV = [ 0, 0, 0, 1, 1, 1, 1, 0 ], this.m_TextureID = 0;
            }
            get color() {
                return this.m_Color;
            }
            set color(v) {
                "number" == typeof v ? (this.m_Color.r = v >> 16 & 255, this.m_Color.g = v >> 8 & 255, 
                this.m_Color.b = v >> 0 & 255, this.m_Color.a = 255, this.m_Color.devide(255)) : (this.m_Color.r = v.r, 
                this.m_Color.g = v.g, this.m_Color.b = v.b, this.m_Color.a = v.a);
            }
            get position() {
                return this.m_Position;
            }
            set position(v) {
                this.m_Position.x = v.x, this.m_Position.y = v.y, this.m_Position.z = v.z;
            }
            get size() {
                return this.m_Size;
            }
            set size(v) {
                this.m_Size.w = v.w, this.m_Size.h = v.h;
            }
            get uv() {
                return this.m_UV;
            }
            set uv(v) {
                this.m_UV = v;
            }
            get textureID() {
                return this.m_TextureID;
            }
            set textureID(v) {
                this.m_TextureID = v;
            }
        };
    }, {
        "../util/vector/vec2": 32,
        "../util/vector/vector3": 33,
        "../util/vector/vector4": 34
    } ],
    24: [ function(require, module, exports) {
        const Entity = require("../entity");
        class Sprite extends Entity {
            constructor() {
                super();
            }
            static createBasicColor(width = 32, height = 32, color = 4278255615, x = 0, y = 0) {
                const sprite = new Sprite;
                return sprite.m_Size.w = width, sprite.m_Size.h = height, sprite.m_Color.r = color >> 24 & 255, 
                sprite.m_Color.g = color >> 16 & 255, sprite.m_Color.b = color >> 8 & 255, sprite.m_Color.a = color >> 0 & 255, 
                sprite.m_Color.devide(255), sprite.m_Position.x = x, sprite.m_Position.y = y, sprite;
            }
            static createFromTexture(filepath) {
                const texture = Asset.loadTexture(filepath), sprite = new Sprite;
                return sprite.m_Size = texture.m_Size, sprite.m_Texture = texture, sprite;
            }
            static createFromAtlas(filepath, w, h) {
                const texture = Asset.loadTexture(filepath), sprite = new Sprite;
                return sprite.m_Size.w = w, sprite.m_Size.h = h, sprite.m_Texture = texture, sprite;
            }
        }
        module.exports = Sprite;
    }, {
        "../entity": 23
    } ],
    25: [ function(require, module, exports) {
        const Entity = require("../entity"), Layer = require("./tilemap/layer"), Vector2 = require("../../util/vector/vec2.js"), Material = require("../material/instance");
        module.exports = class extends Entity {
            constructor(tile) {
                super(), tile.width = tile.width || 32, tile.height = tile.height || 32, this.m_Layers = [], 
                this.m_Tile = Vector2(tile.width, tile.height), this.m_UVs = {}, this.textureID = 1;
            }
            destructor() {}
            submit(callback) {
                this.m_Layers.forEach(layer => {
                    layer.m_Tiles.forEach(tile => {
                        callback(tile);
                    });
                });
            }
            addTileset(name, image, opts) {
                (opts = opts || {}).idx = 0, void 0 !== opts.w && (opts.width = opts.w, delete opts.w), 
                void 0 !== opts.h && (opts.height = opts.h, delete opts.h), void 0 === opts.width && (opts.width = this.m_Tile.w), 
                void 0 === opts.height && (opts.height = this.m_Tile.h);
                const texture = Material.get(image || name), sizeX = texture.width / opts.width, sizeY = texture.height / opts.height, uvX = 1 / sizeX, uvY = 1 / sizeY;
                for (let y = 0; y < sizeY; y += 1) for (let x = 0; x < sizeX; x += 1) this.m_UVs[x + y * sizeX + opts.idx] = [ x * uvX, y * uvY, x * uvX, y * uvY + uvY, x * uvX + uvX, y * uvY + uvY, x * uvX + uvX, y * uvY ];
                return this;
            }
            createLayer(opts, tile) {
                opts.columns = opts.columns || opts.c, delete opts.c, opts.rows = opts.rows || opts.r, 
                delete opts.r, tile.index = tile.index || tile.i, delete tile.i, tile.color = tile.color || tile.c, 
                delete tile.c;
                const layer = new Layer(opts.columns, opts.rows, this);
                return layer.m_UVs = this.m_UVs, this.m_Layers.push(layer), layer.init(tile);
            }
        };
    }, {
        "../../util/vector/vec2.js": 32,
        "../entity": 23,
        "../material/instance": 29,
        "./tilemap/layer": 26
    } ],
    26: [ function(require, module, exports) {
        const Tile = require("./layer/tile.js"), Vector2 = require("../../../util/vector/vec2");
        module.exports = class {
            constructor(columns, rows, tilemap) {
                this.m_Size = Vector2(columns, rows), this.m_Tilemap = tilemap, this.m_Tiles = [];
                const layerW = this.m_Size.x * tilemap.m_Tile.w, layerH = this.m_Size.y * tilemap.m_Tile.h;
                layerW > tilemap.size.w && (tilemap.size.w = layerW), layerH > tilemap.size.h && (tilemap.size.h = layerH);
            }
            destructor() {}
            init(defaults) {
                for (let y = 0; y < this.m_Size.y; y += 1) for (let x = 0; x < this.m_Size.x; x += 1) {
                    const tile = new Tile(this, x, y);
                    tile.color = defaults.color, tile.uv = this.m_UVs[defaults.index], this.m_Tiles.push(tile);
                }
                return this;
            }
            update(data) {
                return data instanceof Array ? data.forEach((uv, i) => {
                    this.m_Tiles[i].uv = this.m_UVs[uv];
                }) : Object.keys(data).map(i => {
                    this.m_Tiles[i] && (this.m_Tiles[i].color = data[i][1], this.m_Tiles[i].uv = this.m_UVs[data[i][0]]);
                }), this;
            }
        };
    }, {
        "../../../util/vector/vec2": 32,
        "./layer/tile.js": 27
    } ],
    27: [ function(require, module, exports) {
        const Entity = require("../../../entity");
        module.exports = class extends Entity {
            constructor(layer, x, y) {
                super(), this.m_Layer = layer, this.m_X = x, this.m_Y = y, this.size.w = layer.m_Tilemap.m_Tile.w, 
                this.size.h = layer.m_Tilemap.m_Tile.h, this.textureID = layer.m_Tilemap.textureID;
            }
            get position() {
                return this.m_Position.x = this.m_Layer.m_Tilemap.position.x + this.m_X * this.size.w, 
                this.m_Position.y = this.m_Layer.m_Tilemap.position.y + this.m_Y * this.size.h, 
                super.position;
            }
        };
    }, {
        "../../../entity": 23
    } ],
    28: [ function(require, module, exports) {
        const GLTexture2D = require("../gl/texture/2d"), Logger = require("../degugger/logger");
        module.exports = class {
            constructor() {
                this.m_Texture = void 0;
            }
            loadImage(filepath) {
                const image = new Image;
                return new Promise(resolve => {
                    image.src = filepath, image.onload = err => {
                        this.m_Texture = new GLTexture2D(image), this.bind = this.m_Texture.bind.bind(this.m_Texture), 
                        resolve(name);
                    }, image.onerror = () => {
                        Logger.warn(`[ Material ] image file not found! [ ${filepath} ]`), resolve(name);
                    };
                });
            }
            get width() {
                return this.m_Texture.m_Size.w;
            }
            get height() {
                return this.m_Texture.m_Size.h;
            }
        };
    }, {
        "../degugger/logger": 13,
        "../gl/texture/2d": 19
    } ],
    29: [ function(require, module, exports) {
        const Material = require("../material");
        module.exports = new class {
            constructor() {
                this.m_Materials = {};
            }
            loadImage(name, filepath) {
                return this.m_Materials[name] = new Material, this.m_Materials[name].loadImage(filepath);
            }
            bind(name, slot) {
                this.m_Materials[name] && this.m_Materials[name].bind(slot);
            }
            bindAll() {}
            get(name) {
                if (this.m_Materials[name]) return this.m_Materials[name];
            }
        };
    }, {
        "../material": 28
    } ],
    30: [ function(require, module, exports) {
        const Event = require("./core/event"), Renderer = require("./core/renderer"), Stage = require("./core/stage"), Stack = require("./core/stack"), Scene2D = require("./core/scene/2d"), Scene3D = require("./core/scene/3d"), Asset = require("./graphic/asset"), Material = require("./graphic/material/instance"), Vector2 = require("./util/vector/vec2"), Vector3 = require("./util/vector/vector3.js"), Vector4 = require("./util/vector/vector4.js");
        class Liwe {
            constructor(name, opts) {
                this.m_Name = name, this.m_Size = {
                    w: opts.width,
                    h: opts.height
                }, this.m_Stack = new Stack(this.m_Size), this.m_PreviousTime = 0, this.pushScene = this.m_Stack.push.bind(this.m_Stack), 
                this.popScene = this.m_Stack.pop.bind(this.m_Stack);
            }
            launch() {
                Stage.init(this.m_Name, this.m_Size), this.onInit(), this.render(0);
            }
            render(time) {
                const dt = (time - this.m_PreviousTime) / 1e3;
                Renderer.clear(), this.m_Stack.m_Scenes.forEach(scene => {
                    scene.render(dt);
                }), this.m_PreviousTime = time, window.requestAnimationFrame(this.render.bind(this));
            }
            resize() {}
            onInit() {}
        }
        Liwe.Event = Event, Liwe.Scene2D = Scene2D, Liwe.Scene3D = Scene3D, Liwe.Asset = Asset, 
        Liwe.Material = Material, Liwe.Vector2 = Vector2, Liwe.Vector3 = Vector3, Liwe.Vector4 = Vector4, 
        window.Liwe = Liwe;
    }, {
        "./core/event": 4,
        "./core/renderer": 5,
        "./core/scene/2d": 9,
        "./core/scene/3d": 10,
        "./core/stack": 11,
        "./core/stage": 12,
        "./graphic/asset": 22,
        "./graphic/material/instance": 29,
        "./util/vector/vec2": 32,
        "./util/vector/vector3.js": 33,
        "./util/vector/vector4.js": 34
    } ],
    31: [ function(require, module, exports) {
        class Matrix44 {
            constructor(value = 0) {
                this.m_Data = Array(16).fill(0), this.m_Data[0] = value, this.m_Data[5] = value, 
                this.m_Data[10] = value, this.m_Data[15] = value;
            }
            toFloat32Array() {
                return new Float32Array(this.m_Data);
            }
        }
        module.exports = {
            IDENTITY: () => new Matrix44(1),
            orthographic: (left, right, top, bottom, near, far) => {
                const matrix = new Matrix44(1), lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
                return matrix.m_Data[0] = -2 * lr, matrix.m_Data[5] = -2 * bt, matrix.m_Data[10] = -2 * nf, 
                matrix.m_Data[12] = (left + right) * lr, matrix.m_Data[13] = (top + bottom) * bt, 
                matrix.m_Data[14] = (near + far) * nf, matrix;
            },
            perspective: () => new Matrix44(1)
        };
    }, {} ],
    32: [ function(require, module, exports) {
        class Vector2 {
            constructor(x, y) {
                this.x = x, this.y = y;
            }
            get w() {
                return this.x;
            }
            set w(v) {
                this.x = v;
            }
            get h() {
                return this.y;
            }
            set h(v) {
                this.y = v;
            }
        }
        module.exports = vec2 = (x, y) => new Vector2(x, y), vec2.ZERO = () => new Vector2(0, 0), 
        vec2.IDENTITY = () => new Vector2(1, 1);
    }, {} ],
    33: [ function(require, module, exports) {
        module.exports = class {
            constructor(x = 0, y, z) {
                this.x = x, this.y = "number" == typeof y ? y : x, this.z = "number" == typeof z ? z : x;
            }
            get r() {
                return this.x;
            }
            set r(v) {
                this.x = v;
            }
            get g() {
                return this.y;
            }
            set g(v) {
                this.y = v;
            }
            get b() {
                return this.z;
            }
            set b(v) {
                this.z = v;
            }
        };
    }, {} ],
    34: [ function(require, module, exports) {
        module.exports = class {
            constructor(x = 0, y, z, w) {
                this.x = x, this.y = "number" == typeof y ? y : x, this.z = "number" == typeof z ? z : x, 
                this.w = "number" == typeof w ? w : x;
            }
            devide(value) {
                return this.x /= value, this.y /= value, this.z /= value, this.w /= value, this;
            }
            get r() {
                return this.x;
            }
            set r(v) {
                this.x = v;
            }
            get g() {
                return this.y;
            }
            set g(v) {
                this.y = v;
            }
            get b() {
                return this.z;
            }
            set b(v) {
                this.z = v;
            }
            get a() {
                return this.w;
            }
            set a(v) {
                this.w = v;
            }
        };
    }, {} ]
}, {}, [ 30 ]);