"use client";

import { useEffect, useRef } from "react";
import { useExtensions } from "@/hooks/useExtensions";

const SHADERS = {
  sonoma: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.00012;
    vec3 base = vec3(0.06, 0.06, 0.09);
    vec3 purple = vec3(0.38, 0.22, 0.58);
    vec3 blue = vec3(0.10, 0.28, 0.62);
    vec3 rose = vec3(0.58, 0.20, 0.40);
    float d1 = length(uv - vec2(0.22 + sin(t) * 0.05, 0.32 + cos(t * 0.7) * 0.04));
    float d2 = length(uv - vec2(0.78 + cos(t * 0.8) * 0.04, 0.52 + sin(t * 0.6) * 0.05));
    float d3 = length(uv - vec2(0.48 + sin(t * 0.5) * 0.06, 0.78));
    vec3 color = base;
    color = mix(color, purple, smoothstep(0.62, 0.0, d1) * 0.42);
    color = mix(color, blue, smoothstep(0.52, 0.0, d2) * 0.38);
    color = mix(color, rose, smoothstep(0.48, 0.0, d3) * 0.22);
    float vignette = 1.0 - smoothstep(0.45, 1.25, length(uv - 0.5));
    color *= vignette * 0.88 + 0.12;
    gl_FragColor = vec4(color, 1.0);
}`,
  monterey: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.0001;
    vec3 base = vec3(0.04, 0.07, 0.12);
    vec3 teal = vec3(0.08, 0.32, 0.48);
    vec3 blue = vec3(0.06, 0.18, 0.42);
    float d1 = length(uv - vec2(0.3 + sin(t) * 0.04, 0.4 + cos(t * 0.6) * 0.03));
    float d2 = length(uv - vec2(0.7 + cos(t * 0.7) * 0.05, 0.6));
    vec3 color = base;
    color = mix(color, blue, smoothstep(0.55, 0.0, d1) * 0.45);
    color = mix(color, teal, smoothstep(0.5, 0.0, d2) * 0.35);
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5));
    color *= vignette * 0.9 + 0.1;
    gl_FragColor = vec4(color, 1.0);
}`,
  sequoia: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.00011;
    vec3 base = vec3(0.08, 0.06, 0.05);
    vec3 amber = vec3(0.45, 0.28, 0.12);
    vec3 plum = vec3(0.35, 0.15, 0.28);
    float d1 = length(uv - vec2(0.25 + sin(t) * 0.04, 0.35));
    float d2 = length(uv - vec2(0.72, 0.65 + cos(t * 0.5) * 0.04));
    vec3 color = base;
    color = mix(color, amber, smoothstep(0.58, 0.0, d1) * 0.4);
    color = mix(color, plum, smoothstep(0.52, 0.0, d2) * 0.32);
    float vignette = 1.0 - smoothstep(0.45, 1.25, length(uv - 0.5));
    color *= vignette * 0.88 + 0.12;
    gl_FragColor = vec4(color, 1.0);
}`,
  "aqua-classic": `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 top = vec3(0.91, 0.91, 0.93);
    vec3 mid = vec3(0.78, 0.78, 0.82);
    vec3 bot = vec3(0.62, 0.62, 0.66);
    vec3 color = mix(top, mid, smoothstep(0.0, 0.5, uv.y));
    color = mix(color, bot, smoothstep(0.5, 1.0, uv.y));
    float shimmer = sin(uv.x * 40.0 + u_time * 0.0003) * 0.008;
    color += shimmer;
    float vignette = 1.0 - smoothstep(0.6, 1.4, length(uv - 0.5)) * 0.25;
    color *= vignette;
    gl_FragColor = vec4(color, 1.0);
}`,
};

const DEFAULT_FS = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float noise = sin(uv.x * 10.0 + u_time * 0.5) * cos(uv.y * 10.0 + u_time * 0.5);
    vec3 color = vec3(0.04, 0.05, 0.08);
    color += vec3(0.02, 0.03, 0.06) * noise * 0.2;
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
    color *= vignette;
    gl_FragColor = vec4(color, 1.0);
}`;

const OPACITY = {
  sonoma: "opacity-55",
  monterey: "opacity-50",
  sequoia: "opacity-52",
  "aqua-classic": "opacity-35",
};

export default function ShaderBackground() {
  const canvasRef = useRef(null);
  const { isActive, macVariant } = useExtensions();
  const macWallpaper = isActive("macintosh-theme");
  const liveAnimationActive = isActive("live-animation");
  const variant = macVariant || "sonoma";

  useEffect(() => {
    if (liveAnimationActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vs = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const fs = macWallpaper ? (SHADERS[variant] ?? SHADERS.sonoma) : DEFAULT_FS;
    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let raf;
    function render(t) {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      cancelAnimationFrame(raf);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [macWallpaper, variant, liveAnimationActive]);

  if (liveAnimationActive) return null;

  const opacityClass = macWallpaper ? (OPACITY[variant] ?? "opacity-55") : "opacity-40";

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${opacityClass}`}
    >
      <div className="absolute inset-0 w-full h-full" style={{ display: "block" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
          width={1280}
          height={1024}
        />
      </div>
    </div>
  );
}
