// How the Organic Structure Editor shows an organic structure in each view:
// the skeletal formula, carbon skeleton, condensed formula or full structural
// formula, with its added hydrogens, carbon numbering and caption. drawView
// returns everything to draw as plain lines and text in page units, so the
// page and its exports (StructureDrawing.svelte) only render the list. Every
// view keeps the shape the teacher drew; none moves an atom (ADR 0007).
import { carbonNumbers } from './numbering'
import {
  addedHydrogens, atomById, BOND, bondAngles, degrees, H_BOND, bondsOf, distanceToSegment, neighbors, overbonded, parts,
  otherEnd, shortestPath, step, turn, type Atom, type Bond, type OrganicStructure, type Point,
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
  /** label ring carbons (and draw their hydrogens) in the other views; off,
   *  rings are bare polygons as in the skeletal formula */
  labelRings: boolean
  /** write each carboxylic acid group as CO₂H (HO₂C facing left) in the
   *  condensed formula and carbon skeleton */
  acids: boolean
  /** write a label backward (H₃C, HO) when its bonds all come from the
   *  right, so its atom sits next to the bond; off, every label reads CH₃ */
  reverseLeft: boolean
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
/** A chiral center's asterisk beside an atom with no label, and how far out. */
export const STAR_FONT = FONT
const STAR_GAP = 13
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
/** A chiral center's asterisk beside an atom with no label (a label writes its own, *CH). */
export interface Star { atomId: string; x: number; y: number }
/** One of an atom's added hydrogens in the full structural formula, where it's drawn. */
export interface AddedHydrogen { atomId: string; index: number; x: number; y: number }
export interface Drawn {
  bonds: DrawnBond[]
  /** atom labels first (atomId set), then added hydrogens */
  labels: Label[]
  /** the full structural formula's added hydrogens, for dragging */
  hydrogens: AddedHydrogen[]
  numbers: CarbonNumber[]
  stars: Star[]
  caption: { text: string; x: number; y: number } | null
  /** atoms to mark while editing: overbonded ones, and carbons the skeletal
   *  formula hides by drawing them in a straight line */
  overbonded: string[]
  hidden: string[]
  numberingNote: string | null
  /** whether a label would read backward (H₃C, HO) with reverseLeft on */
  leftLabels: boolean
  /** what a copy or download keeps, null with nothing drawn */
  crop: Rect | null
}

/** Arial's widths, in ems, for the letters labels use; anything else is a digit. */
const EM: Record<string, number> = { '*': 0.389, C: 0.722, H: 0.722, O: 0.778, N: 0.722, S: 0.667, P: 0.667, F: 0.611, B: 0.667, I: 0.278, R: 0.722, X: 0.667, l: 0.222, r: 0.333 }
const runWidth = (r: Run) => [...r.text].reduce((w, c) => w + (EM[c] ?? 0.556), 0) * (r.sub ? SUB_FONT : FONT)
const CAP = FONT * 0.36

/** Text for a count: nothing for none, the letters alone for one, else with a subscript. */
const counted = (text: string, n: number): Run[] => (n === 0 ? [] : n === 1 ? [{ text, sub: false }] : [{ text, sub: false }, { text: String(n), sub: true }])
const STAR: Run = { text: '*', sub: false }
/** Runs split into groups, each letters and the subscript after them. */
const groups = (runs: Run[]) => runs.reduce<Run[][]>((g, r) => (r.sub && g.length ? g[g.length - 1].push(r) : g.push([r]), g), [])

/** An atom's label: its symbol, then what follows it (hydrogens, or O₂H for
 *  an acid group), written before it instead when it faces backward. A
 *  chiral center's asterisk goes in front (*CH), or after when backward. */
function makeLabel(atomId: string | null, at: Point, element: string, hydrogens: number, backward: boolean, chiral = false, follows = counted('H', hydrogens)): Label {
  const symbol: Run = { text: element, sub: false }
  const star = chiral ? [STAR] : []
  // Backward, the groups come in the other order, each keeping its subscript (HO₂C).
  const ahead = backward ? groups(follows).reverse().flat() : star
  const runs = backward ? [...ahead, symbol, ...star] : [...ahead, symbol, ...follows]
  const before = ahead.reduce((w, r) => w + runWidth(r), 0)
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
  if (bareRingCarbon(s, atom, settings)) return null
  if (atom.element === 'H' || view === 'full') return 0
  const hs = addedHydrogens(s, atom)
  if (atom.element !== 'C' || view === 'condensed') return hs
  if (view === 'carbons') return 0
  const bonds = bondsOf(s, atom.id)
  if (!bonds.length) return hs
  if (settings.labelEnds && bonds.length === 1 && bonds[0].order === 1 && hs === 3) return hs
  return null
}

/** Each carboxylic acid group's carbon, with its two oxygens: a carbon with
 *  three bonds, one double to an O and one single to an O, neither O bonded
 *  to anything else. */
export function acidGroups(s: OrganicStructure) {
  const found = new Map<string, string[]>()
  for (const atom of s.atoms) {
    const bonds = bondsOf(s, atom.id)
    if (atom.element !== 'C' || bonds.length !== 3) continue
    const lone = (order: number) =>
      bonds.map((b) => (b.order === order ? atomById(s, otherEnd(b, atom.id)) : undefined)).find((o) => o?.element === 'O' && bondsOf(s, o.id).length === 1)
    const [double, single] = [lone(2), lone(1)]
    if (double && single) found.set(atom.id, [double.id, single.id])
  }
  return found
}

/** Whether a carbon is in a ring: one of its bonds has another way round. */
export const inRing = (s: OrganicStructure, atom: Atom) =>
  bondsOf(s, atom.id).some((bond) => shortestPath(s, bond.a, bond.b, (b) => b.id !== bond.id))

/** Whether a view draws a carbon as a bare ring corner, as the skeletal
 *  formula does, because the teacher turned ring labels off. */
const bareRingCarbon = (s: OrganicStructure, atom: Atom, settings: ViewSettings) =>
  !settings.labelRings && settings.view !== 'skeletal' && atom.element === 'C' && inRing(s, atom)

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
  // Acid groups written CO₂H take their oxygens and those bonds into the label.
  const acids = settings.acids && (settings.view === 'condensed' || settings.view === 'carbons') ? acidGroups(s) : new Map<string, string[]>()
  const inAcid = new Set([...acids.values()].flat())
  const labels: Label[] = []
  const boxes = new Map<string, Rect>()
  let leftLabels = false
  for (const atom of s.atoms) {
    if (inAcid.has(atom.id)) continue
    const hs = labelHydrogens(s, atom, settings)
    if (hs === null) continue
    const near = neighbors(s, atom.id).filter((n) => !inAcid.has(n.id))
    const follows = acids.has(atom.id) ? [...counted('O', 2), ...counted('H', 1)] : undefined
    const facesLeft = near.length > 0 && near.every((n) => n.x > atom.x + 1)
    leftLabels ||= facesLeft && (hs > 0 || !!follows)
    const backward = facesLeft && settings.reverseLeft
    const label = makeLabel(atom.id, atom, atom.element, hs, backward, !!atom.chiral, follows)
    labels.push(label)
    boxes.set(atom.id, label.box)
  }
  const bonds: DrawnBond[] = s.bonds
    .filter((b) => !inAcid.has(b.a) && !inAcid.has(b.b))
    .map((b) => ({ bondId: b.id, lines: bondLines(s, b, boxes) }))

  // The full structural formula draws each added hydrogen as an atom: where
  // the teacher dragged them, or else spread out round the atom, clear of
  // the rest (dragged ones first, so the others keep clear of them).
  const hydrogenTurns = new Map<string, number[]>()
  const hydrogens: AddedHydrogen[] = []
  if (settings.view === 'full') {
    const byId = new Map(s.atoms.map((a) => [a.id, a]))
    const counts = new Map(s.atoms.map((a) => [a.id, bareRingCarbon(s, a, settings) ? 0 : addedHydrogens(s, a)]))
    const kept = (atom: Atom) => (atom.hydrogens && atom.hydrogens.length === counts.get(atom.id) ? atom.hydrogens : null)
    const placed: Point[] = s.atoms.flatMap((a) => (kept(a) ?? []).map((p) => ({ x: a.x + p.x, y: a.y + p.y })))
    for (const atom of s.atoms) {
      const count = counts.get(atom.id)!
      if (!count) continue
      const drawHydrogen = (end: Point, index: number) => {
        hydrogens.push({ atomId: atom.id, index, ...end })
        const h = makeLabel(null, end, 'H', 0, false)
        labels.push(h)
        const p = leaveBox(atom, end, boxes.get(atom.id))
        const q = leaveBox(end, atom, h.box)
        bonds.push({ bondId: null, lines: [{ x1: p.x, y1: p.y, x2: q.x, y2: q.y }] })
      }
      const own = kept(atom)
      if (own) {
        hydrogenTurns.set(atom.id, own.map((p) => degrees(p.x, p.y)))
        own.forEach((p, i) => drawHydrogen({ x: atom.x + p.x, y: atom.y + p.y }, i))
        continue
      }
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
      angles.forEach((angle, i) => {
        const end = step(atom, angle, H_BOND)
        placed.push(end)
        drawHydrogen(end, i)
      })
    }
  }

  // A chiral center with no label gets its asterisk in the open beside it.
  const turnsAt = (atom: Atom) => [...bondAngles(s, atom), ...(hydrogenTurns.get(atom.id) ?? [])]
  const stars: Star[] = []
  for (const atom of s.atoms) {
    if (!atom.chiral || boxes.has(atom.id) || inAcid.has(atom.id)) continue
    const angle = openTurn(turnsAt(atom))
    stars.push({ atomId: atom.id, ...step(atom, angle, STAR_GAP) })
    hydrogenTurns.set(atom.id, [...(hydrogenTurns.get(atom.id) ?? []), angle])
  }

  const numbers: CarbonNumber[] = []
  let numberingNote: string | null = null
  if (settings.numbering) {
    const found = carbonNumbers(s, settings.flip)
    numberingNote = found.note
    for (const [atomId, n] of found.numbers) {
      const atom = atomById(s, atomId)!
      const angle = openTurn(turnsAt(atom))
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
    ...stars.map(starBox),
  ])
  const text = settings.caption.trim()
  const caption = drawn && text ? { text, x: drawn.x + drawn.width / 2, y: drawn.y + drawn.height + 12 + CAPTION_FONT * 0.72 } : null
  const captionBox = caption && { x: caption.x - (text.length * CAPTION_FONT * 0.56) / 2, y: caption.y - CAPTION_FONT * 0.75, width: text.length * CAPTION_FONT * 0.56, height: CAPTION_FONT * 0.95 }
  const all = drawn && union(captionBox ? [drawn, captionBox] : [drawn])
  return {
    bonds,
    labels,
    hydrogens,
    numbers,
    stars,
    caption,
    overbonded: s.atoms.filter((a) => overbonded(s, a)).map((a) => a.id),
    hidden: settings.view === 'skeletal' ? s.atoms.filter((a) => isHidden(s, a)).map((a) => a.id) : [],
    numberingNote,
    leftLabels,
    crop: all && { x: all.x - EXPORT_PAD, y: all.y - EXPORT_PAD, width: all.width + 2 * EXPORT_PAD, height: all.height + 2 * EXPORT_PAD },
  }
}

/** The 15° direction from an atom furthest from everything leaving it. */
function openTurn(taken: number[]) {
  if (!taken.length) return 45
  const angles = Array.from({ length: 24 }, (_, i) => i * 15)
  return angles.reduce((p, q) => (Math.min(...taken.map((t) => turn(t, q))) > Math.min(...taken.map((t) => turn(t, p))) ? q : p))
}

function starBox(s: Star): Rect {
  const width = STAR_FONT * 0.389
  return { x: s.x - width / 2, y: s.y - STAR_FONT * 0.36, width, height: STAR_FONT * 0.72 }
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
