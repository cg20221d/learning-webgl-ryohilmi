let freeze = false;

function main() {
  let canvas = document.getElementById("kanvas");
  let gl = canvas.getContext("webgl");

  let vertices = [
    0.5, 0.0, 0.0, 1.0, 1.0,   // A: kann atas (CYAN)
    0.0, -0.5, 1.0, 0.0, 1.0,   // B: bawah tengah (MAGENTA)
    -0.5, 0.0, 1.0, 1.0, 0.0,  // C: kiri atas (KUNING)
    0.0, 0.5, 1.0, 1.0, 1.0,   // D: tengah atas (PUTIH)
  ];

  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex shader
  const vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform float uTheta;
    uniform vec2 uTranslation;

    void main() {
      float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y + uTranslation.x;
      float y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x + uTranslation.y;
      gl_PointSize = 10.0;
      gl_Position = vec4(x, y, 0.0, 1.0);

      vColor = aColor;
    }
  `;

  // Fragment shader
  const fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;

    void main() {
      float r = 0.0;
      float g = 0.0;
      float b = 1.0;   
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  let vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObject, vertexShaderCode);
  gl.compileShader(vertexShaderObject);

  let fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
  gl.compileShader(fragmentShaderObject);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShaderObject);
  gl.attachShader(shaderProgram, fragmentShaderObject);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Variabel lokal
  let theta = 0.0;
  let translation = [0.0, 0.0];

  // Variabel pointer ke GLSL
  let uTHeta = gl.getUniformLocation(shaderProgram, "uTheta");
  let uTranslation = gl.getUniformLocation(shaderProgram, "uTranslation");

  // Mengajari GPU bagaimana caranya mengoleksi
  // nilai posisi dari ARRAY_BUFFER
  // untuk setiap verteks yang sedang diproses
  let aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aPosition);

  let aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aColor);

  function toggleFreeze(e) {
    setTimeout(() => {
      freeze = !freeze;
    }, freeze ? 0 : 500)
  }

  canvas.addEventListener("mouseenter", toggleFreeze);
  canvas.addEventListener("mouseleave", toggleFreeze);

  let controller = {
    w: false,
    a: false,
    s: false,
    d: false
  }

  window.onkeydown = event => {
    if (event.key == 'w')
    {
      controller.w = true
    } 
    if (event.key == 'a')
    {
      controller.a = true
    }
    if (event.key == 's')
    {
      controller.s = true
    }
    if (event.key == 'd')
    {
      controller.d = true
    }
  }

  window.onkeyup = event => {
    if (event.key == 'w')
    {
      controller.w = false
    } 
    if (event.key == 'a')
    {
      controller.a = false
    }
    if (event.key == 's')
    {
      controller.s = false
    }
    if (event.key == 'd')
    {
      controller.d = false
    }
  }

  function render() {
    gl.clearColor(1.0, 0.65, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!freeze) {
      theta += 0.003;
      theta = (theta > 2.0 * Math.PI) ? 0.0 : curveValue(theta, 0.0, 2.0 * Math.PI, 0.94);
    }

    if (controller.w) {
      translation[1] += 0.01;
    }
    if (controller.a) {
      translation[0] -= 0.01;
    }
    if (controller.s) {
      translation[1] -= 0.01;
    }
    if (controller.d) {
      translation[0] += 0.01;
    }

    gl.uniform1f(uTHeta, theta);
    gl.uniform2f(uTranslation, translation[0], translation[1]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function minValue(a, b) {
  return a > b ? b : a; 
}

function maxValue(a, b) {
  return a > b ? a : b;
}

function curveValue(x, min, max, exponential) {
  let val = minValue(x, (maxValue(min, max)))
  val = maxValue(val, minValue(min, max))
  
  return min + ((max - min) * (Math.pow((val - min), exponential) / Math.pow((max - min), exponential)));
}