function main() {
  let canvas = document.getElementById("kanvas");
  let gl = canvas.getContext("webgl");

  // Vertex shader
  const vertexShaderCode = `
    void  main() {

    }
  `;

  // Fragment shader
  const fragmentShaderCode = `
    void  main() {

    }
  `;

  let vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObject, vertexShaderCode);
  gl.compileShader(vertexShaderObject);

  let fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
  gl.compileShader(vertexShaderObject);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShaderObject);
  gl.attachShader(shaderProgram, fragmentShaderObject);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  gl.clearColor(0.0, 0.2, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
