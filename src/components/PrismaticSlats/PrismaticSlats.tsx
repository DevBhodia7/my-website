import { useEffect, useRef } from 'react'

interface PrismaticSlatsProps {
  className?: string
  backgroundColor?: string
  colors?: string[]
  angle?: number
  flutes?: number
  refraction?: number
  aberration?: number
  softness?: number
  wave?: number
  waveFrequency?: number
  drift?: number
  highlight?: number
  highlightSoftness?: number
  lightAngle?: number
  radius?: number
  momentum?: number
  swirl?: number
  intensity?: number
  trail?: number
  texture?: number
  grain?: number
  speed?: number
  autoplay?: boolean
  interactive?: boolean
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_col0;
uniform vec3  u_col1;
uniform float u_angle;
uniform float u_flutes;
uniform float u_refraction;
uniform float u_aberration;
uniform float u_softness;
uniform float u_wave;
uniform float u_waveFreq;
uniform float u_highlight;
uniform float u_hlSoft;
uniform float u_lightAngle;
uniform float u_radius;
uniform float u_momentum;
uniform float u_intensity;
uniform float u_grain;
uniform float u_trail;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 prism(float t) {
  return mix(u_col0, u_col1, t);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 st = uv * 2.0 - 1.0;
  st.x *= u_res.x / u_res.y;

  // Mouse influence
  vec2 mouse = u_mouse * 2.0 - 1.0;
  mouse.x *= u_res.x / u_res.y;
  float mDist = length(st - mouse);
  float mInfluence = exp(-mDist * mDist * (1.0 / max(u_radius * 0.1, 0.01)));

  // Slat direction
  float rad = u_angle * 3.14159 / 180.0;
  vec2 dir = vec2(cos(rad), sin(rad));
  vec2 perp = vec2(-dir.y, dir.x);

  float proj = dot(st, perp);
  float along = dot(st, dir);

  // Wave
  float waveFn = sin(along * u_waveFreq * 3.0 + u_time * 0.7) * u_wave;
  proj += waveFn;

  // Mouse swirl / refraction nudge
  proj += mInfluence * u_refraction * 0.15 * sin(u_time * 0.5);

  // Slat index
  float slatIdx = proj * u_flutes;
  float slatFrac = fract(slatIdx);

  // Smooth edge between slats
  float edge = smoothstep(0.0, u_softness, slatFrac) * smoothstep(1.0, 1.0 - u_softness, slatFrac);

  // Chromatic aberration
  float abR = sin(slatFrac * 3.14159 + u_aberration) * 0.5 + 0.5;
  float abG = sin(slatFrac * 3.14159) * 0.5 + 0.5;
  float abB = sin(slatFrac * 3.14159 - u_aberration) * 0.5 + 0.5;
  vec3 ab = vec3(abR, abG, abB);

  // Colour blend
  vec3 col = prism(fract(slatFrac + u_time * 0.04)) * ab * edge;

  // Highlight streak
  float lightRad = u_lightAngle * 3.14159 / 180.0;
  float lProj = dot(st, vec2(cos(lightRad), sin(lightRad)));
  float hl = exp(-lProj * lProj / max(u_hlSoft * u_hlSoft, 0.0001)) * u_highlight * edge;
  col += vec3(hl);

  // Intensity
  col *= u_intensity;

  // Grain
  float noise = rand(uv + fract(u_time * 0.01)) * u_grain;
  col += vec3(noise);

  // Trail / fade to bg at edges
  float vignette = smoothstep(1.0, 0.5, length(st) * 0.5);
  col = mix(vec3(0.0), col, vignette * u_trail);

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export default function PrismaticSlats({
  className = '',
  backgroundColor = '#070708',
  colors = ['#5B4FFF', '#D042FF'],
  angle = 31,
  flutes = 8,
  refraction = 4,
  aberration = 0.61,
  softness = 0.5,
  wave = 0.06,
  waveFrequency = 1.5,
  highlight = 0.12,
  highlightSoftness = 0.3,
  lightAngle = -90,
  radius = 6.5,
  momentum = 13,
  intensity = 1,
  trail = 1,
  grain = 0.05,
  speed = 1,
  interactive = true,
}: PrismaticSlatsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const bg = hexToRgb(backgroundColor)
    gl.clearColor(bg[0], bg[1], bg[2], 1)

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs); gl.attachShader(prog, fs)
    gl.linkProgram(prog); gl.useProgram(prog)

    const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const uRes = u('u_res'), uTime = u('u_time'), uMouse = u('u_mouse')
    const uCol0 = u('u_col0'), uCol1 = u('u_col1')
    const uAngle = u('u_angle'), uFlutes = u('u_flutes')
    const uRefr = u('u_refraction'), uAber = u('u_aberration')
    const uSoft = u('u_softness'), uWave = u('u_wave'), uWaveF = u('u_waveFreq')
    const uHl = u('u_highlight'), uHlSoft = u('u_hlSoft'), uLightA = u('u_lightAngle')
    const uRad = u('u_radius'), uMom = u('u_momentum')
    const uInt = u('u_intensity'), uGrain = u('u_grain'), uTrail = u('u_trail')

    const [r0,g0,b0] = hexToRgb(colors[0] ?? '#5B4FFF')
    const [r1,g1,b1] = hexToRgb(colors[1] ?? '#D042FF')
    gl.uniform3f(uCol0, r0, g0, b0)
    gl.uniform3f(uCol1, r1, g1, b1)
    gl.uniform1f(uAngle, angle)
    gl.uniform1f(uFlutes, flutes)
    gl.uniform1f(uRefr, refraction)
    gl.uniform1f(uAber, aberration)
    gl.uniform1f(uSoft, softness)
    gl.uniform1f(uWave, wave)
    gl.uniform1f(uWaveF, waveFrequency)
    gl.uniform1f(uHl, highlight)
    gl.uniform1f(uHlSoft, highlightSoftness)
    gl.uniform1f(uLightA, lightAngle)
    gl.uniform1f(uRad, radius)
    gl.uniform1f(uMom, momentum)
    gl.uniform1f(uInt, intensity)
    gl.uniform1f(uGrain, grain)
    gl.uniform1f(uTrail, trail)

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      }
    }
    if (interactive) canvas.addEventListener('mousemove', onMouse)

    let start = 0
    const draw = (ts: number) => {
      if (!start) start = ts
      const t = ((ts - start) / 1000) * speed
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      if (interactive) canvas.removeEventListener('mousemove', onMouse)
      gl.deleteProgram(prog)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}