/**
 * Stub for @paper-design/shaders — heavy WebGL dep that doesn't work in Storybook.
 * Components using ShaderMount will render a placeholder instead.
 */
export class ShaderMount {
  constructor(
    _el: HTMLElement,
    _shader: unknown,
    _uniforms?: Record<string, number>,
    _resolution?: unknown,
    _dpr?: number
  ) {
    // Render a grey placeholder canvas
    const canvas = document.createElement("canvas");
    canvas.width = _el.clientWidth || 56;
    canvas.height = _el.clientHeight || 56;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    _el.appendChild(canvas);
  }
  dispose() {}
}

export const liquidMetalFragmentShader = "stub";
export default { ShaderMount, liquidMetalFragmentShader };
