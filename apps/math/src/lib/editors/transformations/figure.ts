// Lays out a Transformations figure as plain numbers for Figure.svelte to
// draw: the coordinate grid from $shared/graph, then the preimage and each
// image shown, each reflection's line of reflection, each rotation's and
// dilation's center, each translation's arrow, and every point label, placed
// clear of the lines and of each other and then moved where the teacher
// dragged it.

import { COLORS } from '$shared/graph/colors'
import { layoutGrid, pathOf, round, clipPath, type Point } from '$shared/graph/grid'
import { fmt } from '$shared/graph/numbering'
import { placer, textBox, textWidth, type Spot } from '$shared/graph/labels'
import { readAxes } from '$lib/grid/settings.js'
import { hasPreimage, type Drawing, type Look } from './drawing.js'
import { imagesOf, primed, type Line, type Pt } from './transform.js'

const THICKNESS = { thin: 0.6, medium: 1, thick: 1.6 }
const DOT_R = 4.5
const HEAD = 12
const HEAD_HALF = 5.5
const GAP = 12 // how far a point label sits from its point: clear of its own dot, so every place around it is free to choose

/** One figure on the grid: the preimage, or one transformation's image. */
export type Shape = {
  /** "pre" for the preimage, otherwise the step's id. */
  key: string
  pts: Pt[]
  names: string[]
  look: Look
  closed: boolean
}

/** Every figure the drawing makes, shown or not: the preimage, then one image per step. */
export function shapesOf(d: Drawing): Shape[] {
  const closed = d.closed
  const out: Shape[] = [{ key: 'pre', pts: d.vertices, names: d.names, look: d.look, closed }]
  if (!hasPreimage(d)) return out
  const images = imagesOf(d.vertices, d.steps.map((s) => s.step))
  let names = d.names
  images.forEach((pts, i) => {
    const entry = d.steps[i]
    names = names.map((n) => primed(n, 1))
    out.push({ key: entry.id, pts, names, look: entry.look, closed })
  })
  return out
}

/** Which figures are drawn: the preimage unless hidden, and each image unless hidden or (with in-between images off) not the last. */
export function shownShapes(d: Drawing, shapes = shapesOf(d)): Shape[] {
  const last = shapes.length - 1
  return shapes.filter((s, i) => {
    if (i === 0) return d.show.preimage
    const entry = d.steps[i - 1]
    return d.show.images && entry.shown && (d.show.between || i === last)
  })
}

/** Two points on a line of reflection, far enough apart to reach past any grid edge. */
function lineEnds(line: Line, box: { x0: number; x1: number; y0: number; y1: number }): [Pt, Pt] {
  const far = Math.max(box.x1 - box.x0, box.y1 - box.y0) * 4 + Math.abs(box.x0) + Math.abs(box.y0) + Math.abs(box.x1) + Math.abs(box.y1)
  if (line.kind === 'vertical') return [{ x: line.c, y: -far }, { x: line.c, y: far }]
  if (line.kind === 'horizontal') return [{ x: -far, y: line.c }, { x: far, y: line.c }]
  return [{ x: -far, y: line.slope * -far + line.b }, { x: far, y: line.slope * far + line.b }]
}

/** An arrowhead with its tip at `tip`, pointing away from `from`, and where the line should stop under it. */
function head(from: Point, tip: Point, size = 1): { d: string; base: Point } {
  const len = Math.hypot(tip.x - from.x, tip.y - from.y) || 1
  const u = { x: (tip.x - from.x) / len, y: (tip.y - from.y) / len }
  const h = HEAD * size
  const half = HEAD_HALF * size
  const base = { x: tip.x - u.x * h, y: tip.y - u.y * h }
  const d = `M${round(tip.x)},${round(tip.y)} L${round(base.x - u.y * half)},${round(base.y + u.x * half)} L${round(base.x + u.y * half)},${round(base.y - u.x * half)}z`
  return { d, base: { x: base.x + u.x, y: base.y + u.y } }
}

const dashOf = (look: Look) => {
  const size = (1 + THICKNESS[look.width]) / 2
  return look.line === 'dashed' ? `${round(9 * size)} ${round(6 * size)}` : look.line === 'dotted' ? `0.01 ${round(6 * size)}` : undefined
}

/** Places around a point, the ones facing `out` (away from its figure) first. */
function aroundPoint(p: Point, out: Point, fs: number): Spot[] {
  const spots: (Spot & { angle: number })[] = []
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    const [cx, cy] = [Math.cos(a), Math.sin(a)]
    const anchor = cx > 0.3 ? 'start' : cx < -0.3 ? 'end' : 'middle'
    // The baseline sits lower than the text's middle by about a third of its height.
    spots.push({ x: p.x + cx * GAP, y: p.y + cy * (GAP + fs * 0.45) + fs * 0.35, anchor, angle: a })
  }
  const len = Math.hypot(out.x, out.y)
  const facing = (a: number) => (len ? (Math.cos(a) * out.x + Math.sin(a) * out.y) / len : 0)
  return spots.sort((a, b) => facing(b.angle) - facing(a.angle))
}

export type FigureLayout = ReturnType<typeof buildFigure>

export function buildFigure(d: Drawing) {
  const axes = readAxes(d.grid)
  const { px, box, ...grid } = layoutGrid(d.grid, axes)
  const fs = grid.fs
  const shapes = shapesOf(d)
  const shown = shownShapes(d, shapes)
  const done = hasPreimage(d)

  // Each figure's sides, then its vertices.
  const polys = shown.map((s) => {
    const k = THICKNESS[s.look.width]
    const ink = COLORS[s.look.color]
    const pts = s.pts.map(px)
    return {
      key: s.key,
      d: pts.length > 1 ? pathOf(pts) + (s.closed ? 'Z' : '') : '',
      dots: pts,
      color: ink,
      dash: dashOf(s.look),
      cap: s.look.line === 'dotted' ? ('round' as const) : ('butt' as const),
      width: round((s.look.line === 'dotted' ? 3.2 : 2.5) * k),
      r: round(DOT_R * (1 + k) / 2),
    }
  })

  // Lines of reflection, centers and translation arrows, for the steps whose image is drawn.
  const lines: { key: string; d: string; heads: string[]; color: string }[] = []
  const centers: { key: string; x: number; y: number; color: string }[] = []
  const arrows: { key: string; d: string; head: string; color: string }[] = []
  if (done) {
    const drawnKeys = new Set(shown.map((s) => s.key))
    d.steps.forEach((entry, i) => {
      // A step's line or center shows with the step, even when its image is hidden (for students to draw it);
      // a translation's arrow only with its image, which it points to.
      if (!entry.shown) return
      const step = entry.step
      const ink = COLORS[entry.look.color]
      if (step.kind === 'reflection' && d.show.lines) {
        const [run] = clipPath(lineEnds(step.line, box), box)
        if (!run) return
        const [a, b] = [px(run[0]), px(run.at(-1)!)]
        const ha = head(b, a, 0.85)
        const hb = head(a, b, 0.85)
        // In its image's color, so one along an axis still shows over the black axis.
        lines.push({ key: entry.id, d: pathOf([ha.base, hb.base]), heads: [ha.d, hb.d], color: ink })
      } else if ((step.kind === 'rotation' || step.kind === 'dilation') && d.show.centers) {
        centers.push({ key: entry.id, ...px(step.center), color: ink })
      } else if (step.kind === 'translation' && d.show.arrows && drawnKeys.has(entry.id)) {
        const from = shapes[i].pts[0]
        const to = shapes[i + 1].pts[0]
        if (!from || !to || (from.x === to.x && from.y === to.y)) return
        const [a, b] = [px(from), px(to)]
        // Start just clear of the vertex dot, and end with the head's tip at the image's.
        const len = Math.hypot(b.x - a.x, b.y - a.y)
        if (len < HEAD * 1.5) return
        const start = { x: a.x + ((b.x - a.x) / len) * 7, y: a.y + ((b.y - a.y) / len) * 7 }
        const tip = { x: b.x - ((b.x - a.x) / len) * 6, y: b.y - ((b.y - a.y) / len) * 6 }
        const h = head(start, tip, 0.9)
        arrows.push({ key: entry.id, d: pathOf([start, h.base]), head: h.d, color: ink })
      }
    })
  }

  // Point labels, clear of every side and line and of each other, then moved where the teacher dragged them.
  const place = placer({ x0: 0, y0: 0, x1: grid.width, y1: grid.height })
  for (const p of polys) {
    const pts = p.dots
    place.line(p.d.includes('Z') ? [...pts, pts[0]] : pts)
    for (const q of pts) place.box({ x0: q.x - p.r, y0: q.y - p.r, x1: q.x + p.r, y1: q.y + p.r })
  }
  for (const a of arrows) place.line(pathPoints(a.d))
  for (const l of lines) place.line(pathPoints(l.d), true)
  // The grid's own numbers and titles are in the way too.
  for (const n of [...grid.numbers, ...grid.labels.filter((l) => !l.rotate)]) place.box(textBox({ x: n.x, y: n.y, anchor: n.anchor ?? 'middle' }, textWidth(n.text, fs), fs))
  place.line([{ x: grid.xAxis.x1, y: grid.xAxis.y }, { x: grid.xAxis.x2, y: grid.xAxis.y }], true)
  place.line([{ x: grid.yAxis.x, y: grid.yAxis.y1 }, { x: grid.yAxis.x, y: grid.yAxis.y2 }], true)

  const nameFs = fs * 1.2
  const pointLabels: { key: string; x: number; y: number; anchor: 'start' | 'middle' | 'end'; name: string; coords: string; color: string; at: Point }[] = []
  const inside = (p: Pt) => p.x >= box.x0 - 1e-9 && p.x <= box.x1 + 1e-9 && p.y >= box.y0 - 1e-9 && p.y <= box.y1 + 1e-9
  if (d.show.labels || d.show.coords) {
    for (const s of shown) {
      const ink = COLORS[s.look.color]
      const pts = s.pts.map(px)
      const mid = pts.reduce((m, q) => ({ x: m.x + q.x / pts.length, y: m.y + q.y / pts.length }), { x: 0, y: 0 })
      s.pts.forEach((v, k) => {
        if (!inside(v)) return
        const name = d.show.labels ? s.names[k] ?? '' : ''
        const coords = d.show.coords ? `(${fmt(v.x)}, ${fmt(v.y)})` : ''
        if (!name && !coords) return
        const at = pts[k]
        // Away from the figure's middle, or (for a lone point, or one at its middle) up and to the right.
        let out = { x: at.x - mid.x, y: at.y - mid.y }
        if (Math.hypot(out.x, out.y) < 1) out = { x: 1, y: -1 }
        const width = textWidth(name, nameFs) + textWidth(coords, fs)
        const spot = place.place(aroundPoint(at, out, nameFs), width, nameFs)
        const key = `${s.key}:${k}`
        const moved = d.moved[key]
        pointLabels.push({
          key, x: round(spot.x + (moved?.dx ?? 0)), y: round(spot.y + (moved?.dy ?? 0)), anchor: spot.anchor, name, coords, color: ink, at,
        })
      })
    }
  }

  return { ...grid, px, box, axes, polys, lines, centers, arrows, pointLabels, nameFs }
}

/** The points of a path written by pathOf(). */
function pathPoints(d: string): Point[] {
  return [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]) }))
}
