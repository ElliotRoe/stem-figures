// What the Transformations Editor keeps: the grid settings, the preimage the
// teacher clicked out, the composition of transformations done to it, how each
// figure is drawn, and what's shown. It's plain JSON, kept in this browser
// (never in the page address), and tidyDrawing() turns whatever was stored
// into a usable drawing.

import { COLORS, type Color } from '$shared/graph/colors'
import { cleanGrid, gridDefaults, upgradeGrid, type GridOptions } from '$lib/grid/settings.js'
import { LINE_STYLES, THICKNESSES, type LineStyle, type Thickness } from '$lib/shared/rowStyle.js'
import { vertexName, type Direction, type Line, type Pt, type Step } from './transform.js'

/** How a figure's sides are drawn, with the same choices as a coordinate grid row. */
export type Look = { color: Color; line: LineStyle; width: Thickness }

/** One transformation in the composition, with how its image is drawn and labeled. */
export type StepEntry = {
  id: string
  step: Step
  look: Look
  /** Whether its image is shown. Its point labels are the preimage's, with a prime more for each step. */
  shown: boolean
}

/** What the figure shows. Turning parts off makes a version for students: no image to draw one, no line to find it. */
export type Show = {
  preimage: boolean
  /** The transformations' images at all: off for students to draw them. */
  images: boolean
  /** Images before the last one, in a composition. */
  between: boolean
  /** Each reflection's line of reflection. */
  lines: boolean
  /** Each rotation's and dilation's center. */
  centers: boolean
  /** Each translation's arrow. */
  arrows: boolean
  labels: boolean
  coords: boolean
}

export type Drawing = {
  grid: GridOptions
  /** The preimage's vertices, in the order clicked: one is a point, more a path. */
  vertices: Pt[]
  /** Whether the last vertex joins back to the first, making the path a polygon (three vertices or more). */
  closed: boolean
  names: string[]
  look: Look
  /** Whether new steps' images are drawn in color or black and white. */
  ink: Ink
  steps: StepEntry[]
  show: Show
  /** Labels the teacher dragged, by figure ("pre", or a step's id) and vertex, in drawing units from where they'd go. */
  moved: Record<string, { dx: number; dy: number }>
}

/** At most this many vertices on a polygon or path. */
export const MAX_VERTICES = 10

/** The Transformations Editor's grid starts with all four quadrants. */
export const GRID_START = gridDefaults({ xFrom: '-10', xTo: '10', yFrom: '-10', yTo: '10' })

export const PREIMAGE_LOOK: Look = { color: 'black', line: 'solid', width: 'medium' }
/** Whether the figure is drawn in color, or all in black for a black-and-white copier, its images told apart by their lines. */
export type Ink = 'color' | 'bw'
export const INKS: Record<Ink, string> = { color: 'Color', bw: 'Black and white' }

// Images take these in turn, so each reads as its own figure in color and in black and white.
const IMAGE_LOOKS: Look[] = [
  { color: 'blue', line: 'dashed', width: 'medium' },
  { color: 'red', line: 'dotted', width: 'medium' },
  { color: 'green', line: 'dashed', width: 'medium' },
  { color: 'purple', line: 'dotted', width: 'medium' },
  { color: 'orange', line: 'dashed', width: 'medium' },
]
// In black and white, by their lines alone.
const BW_LOOKS: Look[] = [
  { color: 'black', line: 'dashed', width: 'medium' },
  { color: 'black', line: 'dotted', width: 'medium' },
  { color: 'black', line: 'dashed', width: 'thick' },
  { color: 'black', line: 'dotted', width: 'thick' },
  { color: 'black', line: 'solid', width: 'thin' },
]
export const imageLook = (i: number, ink: Ink = 'color'): Look => {
  const looks = ink === 'bw' ? BW_LOOKS : IMAGE_LOOKS
  return { ...looks[i % looks.length] }
}

/** The drawing switched to color or black and white: every figure takes that mode's look, and later steps follow it. */
export function withInk(d: Drawing, ink: Ink): Drawing {
  return { ...d, ink, look: { ...PREIMAGE_LOOK }, steps: d.steps.map((s, i) => ({ ...s, look: imageLook(i, ink) })) }
}

export const SHOW_ALL: Show = { preimage: true, images: true, between: true, lines: true, centers: true, arrows: true, labels: true, coords: false }

/**
 * The three versions of one figure a teacher makes: for students to draw the
 * image (the preimage, and the line or center to work from), for them to name
 * the transformation (the preimage and the final image, nothing that gives
 * it away), and the answer key (everything). Labels and coordinates are the
 * teacher's choice in each.
 */
export const VERSIONS = {
  student: { name: 'Student', hint: 'The preimage and its line or center, for students to draw the image', show: { preimage: true, images: false, between: false, lines: true, centers: true, arrows: false } },
  question: { name: 'Question', hint: 'The preimage and the final image, for students to name the transformation', show: { preimage: true, images: true, between: false, lines: false, centers: false, arrows: false } },
  key: { name: 'Answer key', hint: 'Everything', show: { preimage: true, images: true, between: true, lines: true, centers: true, arrows: true } },
} satisfies Record<string, { name: string; hint: string; show: Partial<Show> }>
export type Version = keyof typeof VERSIONS

/** Which version a drawing's choices of what to show make, or null for a mix of the teacher's own. */
export function versionOf(show: Show): Version | null {
  for (const [key, v] of Object.entries(VERSIONS) as [Version, (typeof VERSIONS)[Version]][]) {
    if (Object.entries(v.show).every(([k, on]) => show[k as keyof Show] === on)) return key
  }
  return null
}

export function emptyDrawing(): Drawing {
  return {
    grid: { ...GRID_START },
    vertices: [],
    closed: false,
    names: [],
    look: { ...PREIMAGE_LOOK },
    ink: 'color',
    steps: [],
    show: { ...SHOW_ALL },
    moved: {},
  }
}

export const newId = () => Math.random().toString(36).slice(2, 9)

/** The transformations the teacher can add, as the add menu lists them. */
export const STEP_KINDS = {
  translation: 'Translation',
  reflection: 'Reflection',
  rotation: 'Rotation',
  dilation: 'Dilation',
} as const
export type StepKind = keyof typeof STEP_KINDS

/** A new transformation of this kind, before it's placed on the grid, with the look its image takes. */
export function newStep(step: Step, at: number, ink: Ink = 'color'): StepEntry {
  return { id: newId(), step, look: imageLook(at, ink), shown: true }
}

// ----- Tidying what was stored

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const num = (v: unknown, fallback: number) => (isNum(v) ? v : fallback)
const ORIGIN = { x: 0, y: 0 }
const pt = (v: any, fallback: Pt = ORIGIN): Pt => ({ x: num(v?.x, fallback.x), y: num(v?.y, fallback.y) })

function tidyLook(v: any, fallback: Look): Look {
  return {
    color: v?.color in COLORS ? v.color : fallback.color,
    line: v?.line in LINE_STYLES ? v.line : fallback.line,
    width: v?.width in THICKNESSES ? v.width : fallback.width,
  }
}

function tidyLine(v: any): Line {
  if (v?.kind === 'vertical' || v?.kind === 'horizontal') return { kind: v.kind, c: num(v.c, 0) }
  if (v?.kind === 'diagonal') return { kind: 'diagonal', slope: v.slope === -1 ? -1 : 1, b: num(v.b, 0) }
  return { kind: 'vertical', c: 0 }
}

function tidyStep(v: any): Step | null {
  switch (v?.kind) {
    case 'translation':
      return { kind: 'translation', dx: num(v.dx, 0), dy: num(v.dy, 0) }
    case 'reflection':
      return { kind: 'reflection', line: tidyLine(v.line) }
    case 'rotation':
      return {
        kind: 'rotation',
        degrees: [90, 180, 270].includes(v.degrees) ? v.degrees : 90,
        direction: (v.direction === 'cw' ? 'cw' : 'ccw') as Direction,
        center: pt(v.center),
      }
    case 'dilation':
      return { kind: 'dilation', factor: isNum(v.factor) && v.factor > 0 ? v.factor : 2, center: pt(v.center) }
    default:
      return null
  }
}

/** Whatever was stored, as a drawing that works: anything missing or wrong is filled in from an empty one. */
export function tidyDrawing(raw: unknown): Drawing {
  const d: any = raw && typeof raw === 'object' ? raw : {}
  const empty = emptyDrawing()
  const vertices = (Array.isArray(d.vertices) ? d.vertices : []).filter((v: any) => isNum(v?.x) && isNum(v?.y)).slice(0, MAX_VERTICES).map((v: any) => pt(v))
  const names = vertices.map((_: Pt, i: number) => (typeof d.names?.[i] === 'string' ? d.names[i] : vertexName(i)))
  const ink: Ink = d.ink === 'bw' ? 'bw' : 'color'
  const steps: StepEntry[] = []
  for (const s of Array.isArray(d.steps) ? d.steps : []) {
    const step = tidyStep(s?.step)
    if (!step) continue
    steps.push({
      id: typeof s.id === 'string' && s.id ? s.id : newId(),
      step,
      look: tidyLook(s.look, imageLook(steps.length, ink)),
      shown: s.shown !== false,
    })
  }
  const show = { ...SHOW_ALL }
  for (const key of Object.keys(show) as (keyof Show)[]) if (typeof d.show?.[key] === 'boolean') show[key] = d.show[key]
  const moved: Drawing['moved'] = {}
  for (const [k, v] of Object.entries(d.moved && typeof d.moved === 'object' ? d.moved : {})) {
    if (isNum((v as any)?.dx) && isNum((v as any)?.dy)) moved[k] = { dx: (v as any).dx, dy: (v as any).dy }
  }
  return {
    grid: cleanGrid(upgradeGrid(d.grid && typeof d.grid === 'object' ? d.grid : {}), GRID_START),
    vertices,
    // Kept as `closed`, or (in a drawing from before) as a finished polygon.
    closed: vertices.length >= 3 && (d.closed === true || (d.kind === 'polygon' && d.done === true)),
    names,
    look: tidyLook(d.look, empty.look),
    ink,
    steps,
    show,
    moved,
  }
}

/** Whether there's a preimage to transform: a point at least. */
export const hasPreimage = (d: Pick<Drawing, 'vertices'>) => d.vertices.length > 0

/** The preimage's own parts: its vertices, their labels, and whether it's closed. */
type Outline = Pick<Drawing, 'vertices' | 'names' | 'closed'>

/** The preimage without vertex `i`; a polygon left with fewer than three vertices opens. */
export function withoutVertex(o: Outline, i: number): Outline {
  const vertices = o.vertices.filter((_, k) => k !== i)
  return { vertices, names: o.names.filter((_, k) => k !== i), closed: o.closed && vertices.length >= 3 }
}

/**
 * The preimage without side `i`, the one from vertex i to the next. A
 * polygon opens there, into a path from the vertex after the side round to
 * the one before it. A path loses an end side's end point, or, broken in the
 * middle, keeps its longer piece (the first, if they're even).
 */
export function withoutSide(o: Outline, i: number): Outline {
  const n = o.vertices.length
  const pick = (order: number[]): Outline => ({ vertices: order.map((k) => o.vertices[k]), names: order.map((k) => o.names[k]), closed: false })
  const run = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, k) => from + k)
  if (o.closed) return pick(Array.from({ length: n }, (_, k) => (i + 1 + k) % n))
  const before = run(0, i)
  const after = run(i + 1, n - 1)
  if (before.length === 1) return pick(after)
  if (after.length === 1) return pick(before)
  return pick(after.length > before.length ? after : before)
}

/** What the editor opens with the first time: a triangle reflected over the y-axis, to show what it does. */
export function starterDrawing(): Drawing {
  return {
    ...emptyDrawing(),
    vertices: [{ x: 2, y: 2 }, { x: 7, y: 3 }, { x: 3, y: 7 }],
    names: ['A', 'B', 'C'],
    closed: true,
    steps: [newStep({ kind: 'reflection', line: { kind: 'vertical', c: 0 } }, 0)],
  }
}
