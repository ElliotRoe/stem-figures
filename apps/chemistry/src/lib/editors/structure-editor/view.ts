// How the Organic Structure Editor shows an organic structure in each view:
// the skeletal formula, carbon skeleton, condensed formula or full structural
// formula, with its added hydrogens, carbon numbering and caption. drawView
// returns everything to draw as plain lines and text in page units, so the
// page and its exports (StructureDrawing.svelte) only render the list. Every
// view keeps the shape the teacher drew; none moves an atom (ADR 0007).
import { carbonNumbers } from './numbering'
import {
  addedHydrogens, atomById, BOND, bondAngles, bondsOf, distanceToSegment, neighbors, overbonded, parts,
  shortestPath, step, turn, type Atom, type Bond, type OrganicStructure, type Point,
} from './structure'

export const VIEWS = [
  { view: 'skeletal', name: 'Skeletal' },
  { view: 'carbons', name: 'Carbons' },
  { view: 'condensed', name: 'Condensed' },
  { view: 'full', name: 'Full' },
] as const
export type View = (typeof VIEWS)[number]['view']
export const VIEW_NAMES: Record<View, string> = {
  skeletal: 'skeletal formula',
  carbons: 'carbon skeleton',
  condensed: 'condensed formula',
  full: 'full structural formula',
}

export interface ViewSettings {
  view: View
  /** label the CH₃ ends of a skeletal formula */
  labelEnds: boolean
  numbering: boolean
  /** number each chain from its other end, or each ring the other way round */
  flip: boolean
  caption: string
}

/** Text sizes: atom symbols, their subscripts, carbon numbers and the caption. */
export const FONT = 24
export const SUB_FONT = FONT * 0.7
/** How far a subscript sits below the symbols' baseline. */
export const SUB_DROP = FONT * 0.25
export const NUMBER_FONT = 15
export const CAPTION_FONT = 20
/** A drawn C–H (or O–H, N–H) bond, a little shorter than the rest. */
const H_BOND = BOND * 0.8
/** Space between the lines of a double or triple bond. */
const LINE_GAP = 7
/** How far the second line of an off-center double bond stops short of a
 *  carbon with no label, so it doesn't run into the next bond. */
const INSET = BOND * 0.14
/** Space kept clear round a label. */
const LABEL_PAD = 3
/** White space round an exported figure. */
export const EXPORT_PAD = 14

export interface Run { text: string; sub: boolean }
export interface Rect { x: number; y: number; width: number; height: number }
export interface Line { x1: number; y1: number; x2: number; y2: number }
/** Text at an atom: its symbol and any hydrogens, in runs so counts can be
 *  subscripts. x is where the text starts; the symbol is centered on the
 *  atom, and y is the atom's (the middle of the capitals). */
export interface Label { atomId: string | null; x: number; y: number; runs: Run[]; text: string; box: Rect }
/** A bond's lines; a full structural formula's added hydrogens have no bondId. */
export interface DrawnBond { bondId: string | null; lines: Line[] }
export interface CarbonNumber { atomId: string; n: number; x: number; y: number }
export interface Drawn {
  bonds: DrawnBond[]
  /** atom labels first (atomId set), then added hydrogens */
  labels: Label[]
  numbers: CarbonNumber[]
  caption: { text: string; x: number; y: number } | null
  /** atoms to mark while editing: overbonded ones, and carbons the skeletal
   *  formula hides by drawing them in a straight line */
  overbonded: string[]
  hidden: string[]
  numberingNote: string | null
  /** what a copy or download keeps, null with nothing drawn */
  crop: Rect | null
}

/** Arial's widths, in ems, for the letters labels use; anything else is a digit. */
const EM: Record<string, number> = { C: 0.722, H: 0.722, O: 0.778, N: 0.722, S: 0.667, P: 0.667, F: 0.611, B: 0.667, I: 0.278, l: 0.222, r: 0.333 }
const runWidth = (r: Run) => [...r.text].reduce((w, c) => w + (EM[c] ?? 0.556), 0) * (r.sub ? SUB_FONT : FONT)
const CAP = FONT * 0.36

function makeLabel(atomId: string | null, at: Point, element: string, hydrogens: number, backward: boolean): Label {
  const symbol: Run = { text: element, sub: false }
  const hs: Run[] = hydrogens === 0 ? [] : hydrogens === 1 ? [{ text: 'H', sub: false }] : [{ text: 'H', sub: false }, { text: String(hydrogens), sub: true }]
  const runs = backward ? [...hs, symbol] : [symbol, ...hs]
  const before = backward ? hs.reduce((w, r) => w + runWidth(r), 0) : 0
  const x = at.x - before - runWidth(symbol) / 2
  const width = runs.reduce((w, r) => w + runWidth(r), 0)
  const bottom = runs.some((r) => r.sub) ? SUB_DROP + SUB_FONT * 0.36 : CAP
  return {
    atomId, x, y: at.y, runs, text: runs.map((r) => r.text).join(''),
    box: { x: x - LABEL_PAD, y: at.y - CAP - LABEL_PAD, width: width + 2 * LABEL_PAD, height: CAP + bottom + 2 * LABEL_PAD },
  }
}

/** How many hydrogens an atom's label writes, or null for no label. */
function labelHydrogens(s: OrganicStructure, atom: Atom, settings: ViewSettings) {
  const { view } = settings
  if (atom.element === 'H' || view === 'full') return 0
  const hs = addedHydrogens(s, atom)
  if (atom.element !== 'C' || view === 'condensed') return hs
  if (view === 'carbons') return 0
  const bonds = bondsOf(s, atom.id)
  if (!bonds.length) return hs
  if (settings.labelEnds && bonds.length === 1 && bonds[0].order === 1 && hs === 3) return hs
  return null
}

/** Whether the skeletal formula hides a carbon: two bonds in a straight
 *  line, unless it's an alkyne's or allene's, which are meant to be straight. */
function isHidden(s: OrganicStructure, atom: Atom) {
  if (atom.element !== 'C') return false
  const bonds = bondsOf(s, atom.id)
  if (bonds.length !== 2 || bonds.some((b) => b.order === 3) || bonds.every((b) => b.order === 2)) return false
  const [a, b] = bondAngles(s, atom)
  return turn(a, b) > 175
}

/** Where a line from p toward q leaves a box p is in (p itself if it isn't). */
function leaveBox(p: Point, q: Point, box: Rect | undefined): Point {
  if (!box) return p
  const [dx, dy] = [q.x - p.x, q.y - p.y]
  let t = Infinity
  if (dx > 0) t = Math.min(t, (box.x + box.width - p.x) / dx)
  if (dx < 0) t = Math.min(t, (box.x - p.x) / dx)
  if (dy > 0) t = Math.min(t, (box.y + box.height - p.y) / dy)
  if (dy < 0) t = Math.min(t, (box.y - p.y) / dy)
  t = Math.max(0, Math.min(1, t))
  return { x: p.x + dx * t, y: p.y + dy * t }
}

/** The middle of the smallest ring a bond is in, or null if it's in none. */
function ringCenter(s: OrganicStructure, bond: Bond): Point | null {
  const ring = shortestPath(s, bond.a, bond.b, (b) => b.id !== bond.id)?.map((id) => atomById(s, id)!)
  if (!ring) return null
  return { x: ring.reduce((t, a) => t + a.x, 0) / ring.length, y: ring.reduce((t, a) => t + a.y, 0) / ring.length }
}

function bondLines(s: OrganicStructure, bond: Bond, boxes: Map<string, Rect>): Line[] {
  const [a, b] = [atomById(s, bond.a)!, atomById(s, bond.b)!]
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
  const [ux, uy] = [(b.x - a.x) / length, (b.y - a.y) / length]
  const [nx, ny] = [-uy, ux]
  const [boxA, boxB] = [boxes.get(a.id), boxes.get(b.id)]
  const line = (offset: number, inset = false): Line => {
    const p = leaveBox({ x: a.x + nx * offset, y: a.y + ny * offset }, { x: b.x + nx * offset, y: b.y + ny * offset }, boxA)
    const q = leaveBox({ x: b.x + nx * offset, y: b.y + ny * offset }, p, boxB)
    const [inA, inB] = [inset && !boxA ? INSET : 0, inset && !boxB ? INSET : 0]
    return { x1: p.x + ux * inA, y1: p.y + uy * inA, x2: q.x - ux * inB, y2: q.y - uy * inB }
  }
  if (bond.order === 1) return [line(0)]
  if (bond.order === 3) return [line(-LINE_GAP), line(0), line(LINE_GAP)]
  // A double bond between two labels is centered. Otherwise its second line
  // goes inside its ring, or toward the side with more neighbors.
  const centered = [line(-LINE_GAP / 2), line(LINE_GAP / 2)]
  if (boxA && boxB) return centered
  const sideOf = (p: Point) => Math.sign((p.x - a.x) * nx + (p.y - a.y) * ny)
  const center = ringCenter(s, bond)
  let side = center ? sideOf(center) : 0
  if (!center) {
    const others = [...neighbors(s, a.id).filter((n) => n.id !== b.id), ...neighbors(s, b.id).filter((n) => n.id !== a.id)]
    side = Math.sign(others.reduce((t, n) => t + sideOf(n), 0))
  }
  return side ? [line(0), line(side * LINE_GAP, true)] : centered
}

/** The directions for an atom's added hydrogens, on 30° steps: spread as
 *  evenly as they can be among its bonds, so a straight chain's go straight
 *  up and down, and away from anything else drawn where there's a choice. */
function hydrogenAngles(taken: number[], count: number, crowded: (angle: number) => boolean) {
  const open = Array.from({ length: 12 }, (_, i) => i * 30).filter((a) => taken.every((t) => turn(t, a) > 1))
  const gaps = (angles: number[]) => {
    const sorted = [...angles].sort((p, q) => p - q)
    return sorted.map((a, i) => (i + 1 < sorted.length ? sorted[i + 1] - a : sorted[0] + 360 - a)).sort((p, q) => p - q)
  }
  // Fewest crowded hydrogens first, then the most even spread.
  const busy = new Set(open.filter(crowded))
  const score = (picked: number[]) => [-picked.filter((a) => busy.has(a)).length, ...gaps([...taken, ...picked])]
  let best: number[] = []
  let bestScore: number[] | null = null
  const choose = (from: number, picked: number[]) => {
    if (picked.length === count) {
      const g = score(picked)
      const i = bestScore ? g.findIndex((x, k) => x !== bestScore![k]) : 0
      if (!bestScore || (i >= 0 && g[i] > bestScore[i])) [best, bestScore] = [picked, g]
      return
    }
    for (let k = from; k < open.length; k++) choose(k + 1, [...picked, open[k]])
  }
  choose(0, [])
  return best
}

const union = (rects: Rect[]): Rect | null => {
  if (!rects.length) return null
  const left = Math.min(...rects.map((r) => r.x))
  const top = Math.min(...rects.map((r) => r.y))
  const right = Math.max(...rects.map((r) => r.x + r.width))
  const bottom = Math.max(...rects.map((r) => r.y + r.height))
  return { x: left, y: top, width: right - left, height: bottom - top }
}
const overlaps = (p: Rect, q: Rect) => p.x < q.x + q.width && q.x < p.x + p.width && p.y < q.y + q.height && q.y < p.y + p.height

export function drawView(s: OrganicStructure, settings: ViewSettings): Drawn {
  const labels: Label[] = []
  const boxes = new Map<string, Rect>()
  for (const atom of s.atoms) {
    const hs = labelHydrogens(s, atom, settings)
    if (hs === null) continue
    const near = neighbors(s, atom.id)
    const backward = near.length > 0 && near.every((n) => n.x > atom.x + 1)
    const label = makeLabel(atom.id, atom, atom.element, hs, backward)
    labels.push(label)
    boxes.set(atom.id, label.box)
  }
  const bonds: DrawnBond[] = s.bonds.map((b) => ({ bondId: b.id, lines: bondLines(s, b, boxes) }))

  // The full structural formula draws each added hydrogen as an atom.
  const hydrogenTurns = new Map<string, number[]>()
  if (settings.view === 'full') {
    const placed: Point[] = []
    const byId = new Map(s.atoms.map((a) => [a.id, a]))
    for (const atom of s.atoms) {
      const count = addedHydrogens(s, atom)
      if (!count) continue
      const crowded = (angle: number) => {
        const end = step(atom, angle, H_BOND)
        return (
          s.atoms.some((a) => a.id !== atom.id && Math.hypot(a.x - end.x, a.y - end.y) < BOND * 0.6) ||
          placed.some((p) => Math.hypot(p.x - end.x, p.y - end.y) < BOND * 0.5) ||
          s.bonds.some((b) => b.a !== atom.id && b.b !== atom.id && distanceToSegment(end, byId.get(b.a)!, byId.get(b.b)!) < BOND * 0.3)
        )
      }
      const angles = hydrogenAngles(bondAngles(s, atom), count, crowded)
      hydrogenTurns.set(atom.id, angles)
      for (const angle of angles) {
        const end = step(atom, angle, H_BOND)
        placed.push(end)
        const h = makeLabel(null, end, 'H', 0, false)
        labels.push(h)
        const p = leaveBox(atom, end, boxes.get(atom.id))
        const q = leaveBox(end, atom, h.box)
        bonds.push({ bondId: null, lines: [{ x1: p.x, y1: p.y, x2: q.x, y2: q.y }] })
      }
    }
  }

  const numbers: CarbonNumber[] = []
  let numberingNote: string | null = null
  if (settings.numbering) {
    const found = carbonNumbers(s, settings.flip)
    numberingNote = found.note
    for (const [atomId, n] of found.numbers) {
      const atom = atomById(s, atomId)!
      const taken = [...bondAngles(s, atom), ...(hydrogenTurns.get(atomId) ?? [])]
      const angles = Array.from({ length: 24 }, (_, i) => i * 15)
      const angle = taken.length ? angles.reduce((p, q) => (Math.min(...taken.map((t) => turn(t, q))) > Math.min(...taken.map((t) => turn(t, p))) ? q : p)) : 45
      const box = boxes.get(atomId)
      let d = 13
      while (box && d < 60 && overlaps(numberBox({ ...step(atom, angle, d), n }), box)) d += 2
      numbers.push({ atomId, n, ...step(atom, angle, d) })
    }
  }

  const drawn = union([
    ...labels.map((l) => l.box),
    ...bonds.flatMap((b) => b.lines.flatMap((l) => [{ x: l.x1, y: l.y1, width: 0, height: 0 }, { x: l.x2, y: l.y2, width: 0, height: 0 }])),
    ...numbers.map(numberBox),
  ])
  const text = settings.caption.trim()
  const caption = drawn && text ? { text, x: drawn.x + drawn.width / 2, y: drawn.y + drawn.height + 12 + CAPTION_FONT * 0.72 } : null
  const captionBox = caption && { x: caption.x - (text.length * CAPTION_FONT * 0.56) / 2, y: caption.y - CAPTION_FONT * 0.75, width: text.length * CAPTION_FONT * 0.56, height: CAPTION_FONT * 0.95 }
  const all = drawn && union(captionBox ? [drawn, captionBox] : [drawn])
  return {
    bonds,
    labels,
    numbers,
    caption,
    overbonded: s.atoms.filter((a) => overbonded(s, a)).map((a) => a.id),
    hidden: settings.view === 'skeletal' ? s.atoms.filter((a) => isHidden(s, a)).map((a) => a.id) : [],
    numberingNote,
    crop: all && { x: all.x - EXPORT_PAD, y: all.y - EXPORT_PAD, width: all.width + 2 * EXPORT_PAD, height: all.height + 2 * EXPORT_PAD },
  }
}

function numberBox(n: { x: number; y: number; n: number }): Rect {
  const width = String(n.n).length * NUMBER_FONT * 0.556
  const height = NUMBER_FONT * 0.72
  return { x: n.x - width / 2, y: n.y - height / 2, width, height }
}

/** A few words saying what is drawn, for screen readers and the image's label. */
export function describe(s: OrganicStructure, view: View) {
  if (!s.atoms.length) return 'An empty page'
  const count = parts(s).length
  const counts = new Map<string, number>()
  for (const a of s.atoms) counts.set(a.element, (counts.get(a.element) ?? 0) + 1)
  const atoms = [...counts].map(([e, n]) => `${n} ${e}`).join(', ')
  const what = count === 1 ? 'an organic structure' : `${count} organic structures`
  return `The ${VIEW_NAMES[view]} of ${what} (${atoms}, ${s.bonds.length} bond${s.bonds.length === 1 ? '' : 's'})`
}
