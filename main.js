function main() {
  let canvas = document.getElementById("kanvas");
  let gl = canvas.getContext("webgl");

  let vertices = [
    0.5, 0.5, 0.0, 1.0, 1.0,   // A: kann atas (CYAN)
    0.0, 0.0, 1.0, 0.0, 1.0,   // B: bawah tengah (MAGENTA)
    -0.5, 0.5, 1.0, 1.0, 0.0,  // C: kiri atas (KUNING)
    0.0, 1.0, 1.0, 1.0, 1.0,   // D: tengah atas (PUTIH)
  ];

  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex shader
  const vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;

    void main() {
      float x = aPosition.x;
      float y = aPosition.y;
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

  gl.clearColor(1.0, 0.65, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
