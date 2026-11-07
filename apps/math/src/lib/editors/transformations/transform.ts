// The math of transformations on a coordinate grid, in the axes' own numbers:
// where each transformation sends a point, the images a composition makes,
// which points end up off the grid or between its lines, how far to widen
// the grid to fit them, and how steps, lines and point labels are written.

import { fmt, numberLabel } from '$shared/graph/numbering'

export type Pt = { x: number; y: number }

/**
 * A line of reflection: x = c (vertical), y = c (horizontal), or y = x + b and
 * y = −x + b (diagonal). The axes are the lines at c = 0.
 */
export type Line = { kind: 'vertical'; c: number } | { kind: 'horizontal'; c: number } | { kind: 'diagonal'; slope: 1 | -1; b: number }

export type Degrees = 90 | 180 | 270
export type Direction = 'cw' | 'ccw'

/** One transformation. */
export type Step =
  | { kind: 'translation'; dx: number; dy: number }
  | { kind: 'reflection'; line: Line }
  | { kind: 'rotation'; degrees: Degrees; direction: Direction; center: Pt }
  | { kind: 'dilation'; factor: number; center: Pt }

/** A number free of float noise and of −0, so 0.1 + 0.2 lands on 0.3 and a point on the grid stays on it. */
const clean = (v: number) => {
  const n = Number(v.toFixed(9))
  return Object.is(n, -0) ? 0 : n
}
const point = (x: number, y: number): Pt => ({ x: clean(x), y: clean(y) })

function reflect(line: Line, { x, y }: Pt): Pt {
  if (line.kind === 'vertical') return point(2 * line.c - x, y)
  if (line.kind === 'horizontal') return point(x, 2 * line.c - y)
  // Over y = x + b: (x, y) → (y − b, x + b). Over y = −x + b: (x, y) → (b − y, b − x).
  return line.slope === 1 ? point(y - line.b, x + line.b) : point(line.b - y, line.b - x)
}

function rotate(degrees: Degrees, direction: Direction, c: Pt, p: Pt): Pt {
  // Quarter turns counterclockwise: a clockwise turn is the rest of the circle.
  const quarters = ((direction === 'ccw' ? degrees : 360 - degrees) / 90) % 4
  let dx = p.x - c.x
  let dy = p.y - c.y
  for (let k = 0; k < quarters; k++) [dx, dy] = [-dy, dx]
  return point(c.x + dx, c.y + dy)
}

/** Where one transformation sends a point. */
export function apply(step: Step, p: Pt): Pt {
  switch (step.kind) {
    case 'translation':
      return point(p.x + step.dx, p.y + step.dy)
    case 'reflection':
      return reflect(step.line, p)
    case 'rotation':
      return rotate(step.degrees, step.direction, step.center, p)
    case 'dilation':
      return point(step.center.x + step.factor * (p.x - step.center.x), step.center.y + step.factor * (p.y - step.center.y))
  }
}

/** The images a composition makes of the preimage, one per step, each made from the one before. */
export function imagesOf(preimage: Pt[], steps: Step[]): Pt[][] {
  const out: Pt[][] = []
  let last = preimage
  for (const step of steps) {
    last = last.map((p) => apply(step, p))
    out.push(last)
  }
  return out
}

/** The three rotations about a center that land somewhere new: a quarter turn counterclockwise, a half turn, and a quarter turn clockwise. */
export function rotationChoices(center: Pt): Step[] {
  return [
    { kind: 'rotation', degrees: 90, direction: 'ccw', center },
    { kind: 'rotation', degrees: 180, direction: 'ccw', center },
    { kind: 'rotation', degrees: 90, direction: 'cw', center },
  ]
}

const EPS = 1e-9

/** The indexes of the points outside the grid's edges. */
export function offGrid(pts: Pt[], box: { x0: number; x1: number; y0: number; y1: number }): number[] {
  const out: number[] = []
  pts.forEach((p, i) => {
    if (p.x < box.x0 - EPS || p.x > box.x1 + EPS || p.y < box.y0 - EPS || p.y > box.y1 + EPS) out.push(i)
  })
  return out
}

/** The indexes of the points that don't land where two grid lines cross. */
export function offLattice(pts: Pt[], axes: { x: { start: number; step: number }; y: { start: number; step: number } }): number[] {
  const onLine = (v: number, a: { start: number; step: number }) => {
    const k = (v - a.start) / a.step
    return Math.abs(k - Math.round(k)) < 1e-6
  }
  const out: number[] = []
  pts.forEach((p, i) => {
    if (!onLine(p.x, axes.x) || !onLine(p.y, axes.y)) out.push(i)
  })
  return out
}

type Axis = { start: number; step: number; blocks: number }
/** An axis's range as From, To and the step it counts by. */
type Range = { from: number; to: number; step: number }
/** The most blocks an axis can have (as readAxes allows), and the steps a widened grid tries, as multiples of its own. */
const MAX_BLOCKS = 50
const NICE = [1, 2, 5, 10, 20, 50, 100]

/** The indexes of the points past the grid's edges or less than a block inside them, where their labels may be cut off. */
export function tooClose(pts: Pt[], grid: { x: Axis; y: Axis }): number[] {
  const near = (v: number, a: Axis) => v < a.start + a.step - EPS || v > a.start + (a.blocks - 1) * a.step + EPS
  const out: number[] = []
  pts.forEach((p, i) => {
    if (near(p.x, grid.x) || near(p.y, grid.y)) out.push(i)
  })
  return out
}

/**
 * The grid widened so every point is at least a block inside every edge,
 * without where the grid stops giving away where an image is. A grid with
 * all four quadrants comes out balanced: the same number of blocks from the
 * origin every way, as many as the farthest point (or edge) needs. A grid off
 * to one side of the origin grows the same number of blocks on every side.
 * Each axis keeps its step (so the grid lines stay where they were) unless
 * that would take more than 50 blocks; then it counts by 2, 5, 10… times it.
 * Null when nothing needs to change.
 */
export function widenGrid(grid: { x: Axis; y: Axis }, pts: Pt[]): { x: Range; y: Range } | null {
  if (!pts.length) return null
  const axes = [[grid.x, pts.map((p) => p.x)], [grid.y, pts.map((p) => p.y)]] as const
  const end = (a: Axis) => a.start + a.blocks * a.step
  const same = (a: Axis, r: Range) => Math.abs(a.start - r.from) < EPS && Math.abs(end(a) - r.to) < EPS && Math.abs(a.step - r.step) < EPS
  const fourQuadrants = axes.every(([a]) => a.start < -EPS && end(a) > EPS)
  let out: { x: Range; y: Range } | null = null
  // Counting by the axis's own step if that fits in MAX_BLOCKS, otherwise by 2, 5, 10… times it.
  for (const k of NICE) {
    if (fourQuadrants) {
      // Blocks from the origin to the farthest of each edge and each point, with a block to spare past the points.
      let n = 0
      for (const [a, values] of axes) {
        const step = a.step * k
        const reach = Math.max(-a.start, end(a), ...values.map((v) => Math.abs(v) + step))
        n = Math.max(n, Math.ceil(reach / step - EPS))
      }
      const around = (a: Axis): Range => ({ from: clean(-n * a.step * k), to: clean(n * a.step * k), step: clean(a.step * k) })
      out = { x: around(grid.x), y: around(grid.y) }
      if (2 * n <= MAX_BLOCKS) break
    } else {
      let blocks = 0
      for (const [a, values] of axes) {
        const low = Math.ceil((a.start - (Math.min(...values) - a.step)) / a.step - EPS)
        const high = Math.ceil((Math.max(...values) + a.step - end(a)) / a.step - EPS)
        blocks = Math.max(blocks, low, high)
      }
      if (blocks <= 0) return null
      const grow = (a: Axis): Range => {
        const step = a.step * k
        return { from: clean(Math.floor((a.start - blocks * a.step) / step + EPS) * step), to: clean(Math.ceil((end(a) + blocks * a.step) / step - EPS) * step), step: clean(step) }
      }
      out = { x: grow(grid.x), y: grow(grid.y) }
      if ([out.x, out.y].every((r) => (r.to - r.from) / r.step <= MAX_BLOCKS + EPS)) break
    }
  }
  return !out || (same(grid.x, out.x) && same(grid.y, out.y)) ? null : out
}

/** The lines of reflection offered on the grid: the axes and the two diagonals through the origin. Any other is set in its step. */
export const COMMON_LINES: Line[] = [
  { kind: 'horizontal', c: 0 },
  { kind: 'vertical', c: 0 },
  { kind: 'diagonal', slope: 1, b: 0 },
  { kind: 'diagonal', slope: -1, b: 0 },
]

/** How far a spot (in the axes' numbers) is from a line, in blocks. */
function distance(p: Pt, line: Line, steps: { x: number; y: number }): number {
  if (line.kind === 'vertical') return Math.abs(p.x - line.c) / steps.x
  if (line.kind === 'horizontal') return Math.abs(p.y - line.c) / steps.y
  return Math.abs(p.y - line.slope * p.x - line.b) / Math.SQRT2 / steps.y
}

/** Of the common lines of reflection, the one nearest a spot. */
export function nearestLine(p: Pt, steps: { x: number; y: number }, lines: Line[] = COMMON_LINES): Line {
  return lines.reduce((best, line) => (distance(p, line, steps) < distance(p, best, steps) - EPS ? line : best))
}

/** A number as a teacher writes it, a fraction when it is one: "−2", "1/2", "2.5". */
export function numberText(v: number): string {
  const label = numberLabel(v, 'fraction')
  return label.text ?? `${label.sign}${label.num}/${label.den}`
}

const coords = (p: Pt) => `(${fmt(p.x)}, ${fmt(p.y)})`
const isOrigin = (p: Pt) => Math.abs(p.x) < EPS && Math.abs(p.y) < EPS

/** A line of reflection the way a textbook writes it: "the x-axis", "x = −2", "y = −x + 2". */
export function lineName(line: Line): string {
  if (line.kind === 'vertical') return line.c === 0 ? 'the y-axis' : `x = ${fmt(line.c)}`
  if (line.kind === 'horizontal') return line.c === 0 ? 'the x-axis' : `y = ${fmt(line.c)}`
  const x = line.slope === 1 ? 'x' : '−x'
  if (line.b === 0) return `y = ${x}`
  return `y = ${x} ${line.b > 0 ? '+' : '−'} ${fmt(Math.abs(line.b))}`
}

/** A step in words, for the step list: "Rotate 90° clockwise about the origin". */
export function describeStep(step: Step): string {
  switch (step.kind) {
    case 'translation':
      return `Translate ⟨${fmt(step.dx)}, ${fmt(step.dy)}⟩`
    case 'reflection':
      return `Reflect over ${lineName(step.line)}`
    case 'rotation': {
      const way = step.degrees === 180 ? '' : step.direction === 'cw' ? ' clockwise' : ' counterclockwise'
      return `Rotate ${step.degrees}°${way} about ${isOrigin(step.center) ? 'the origin' : coords(step.center)}`
    }
    case 'dilation':
      return `Dilate by ${numberText(step.factor)} from ${isOrigin(step.center) ? 'the origin' : coords(step.center)}`
  }
}

/** The point label a preimage's vertex starts with: A, B, C… */
export const vertexName = (i: number) => String.fromCharCode(65 + (i % 26))

const PRIMES = ['', '′', '″', '‴']

/** A point label with `n` more primes: A → A′ → A″. A label that already has primes gets more. */
export function primed(label: string, n: number): string {
  if (!label) return ''
  const m = /^(.*?)((?:′|″|‴|')*)$/.exec(label)!
  const had = [...m[2]].reduce((sum, ch) => sum + (ch === '″' ? 2 : ch === '‴' ? 3 : 1), 0)
  const total = had + n
  return m[1] + (PRIMES[total] ?? '′'.repeat(total))
}
