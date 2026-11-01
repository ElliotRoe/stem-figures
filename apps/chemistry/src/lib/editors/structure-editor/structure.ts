// An organic structure drawn in the Organic Structure Editor: its carbons and
// other atoms (a hydrogen only where the teacher dragged one in), the bonds
// between them, and where each atom sits on the page. There is no grid: bonds
// are drawn a fixed length at 30° steps, and Move can then stretch them or
// move an atom anywhere. How each view draws the structure,
// added hydrogens included, is view.ts's. Everything here is plain data and
// arithmetic, so the page (StructureEditor.svelte) only handles pointers.

export const ELEMENTS = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'X', 'R'] as const
export type ElementSymbol = (typeof ELEMENTS)[number]

/** The tray's big cards; the rest are under "Show more". */
export const MAIN_ELEMENTS: { symbol: ElementSymbol; name: string }[] = [
  { symbol: 'C', name: 'Carbon' },
  { symbol: 'H', name: 'Hydrogen' },
  { symbol: 'O', name: 'Oxygen' },
]
export const MORE_ELEMENTS = ELEMENTS.filter((e) => !MAIN_ELEMENTS.some((m) => m.symbol === e))

export const RINGS = [
  { kind: 'cyclopentane', name: 'Cyclopentane', size: 5, aromatic: false },
  { kind: 'cyclohexane', name: 'Cyclohexane', size: 6, aromatic: false },
  { kind: 'benzene', name: 'Benzene', size: 6, aromatic: true },
] as const
export type RingKind = (typeof RINGS)[number]['kind']

export type BondOrder = 1 | 2 | 3
export interface Atom {
  id: string
  element: ElementSymbol
  x: number
  y: number
  /** Where the full structural formula draws this atom's added hydrogens,
   *  from the atom, once the teacher has dragged one; set aside while the
   *  atom has a different number of them. */
  hydrogens?: Point[]
  /** marked as a chiral center, drawn with an asterisk (*CH) */
  chiral?: boolean
}
export interface Bond { id: string; a: string; b: string; order: BondOrder }
export interface OrganicStructure { atoms: Atom[]; bonds: Bond[] }
export interface Point { x: number; y: number }

/** The drawing page, in SVG units. Atoms stay a margin in from its edges. */
export const WIDTH = 1040
export const HEIGHT = 660
export const MARGIN = 30
/** Every bond the editor draws is this long. */
export const BOND = 70
/** A drawn C–H (or O–H, N–H) bond in the full structural formula, a little shorter than the rest. */
export const H_BOND = BOND * 0.8
/** How near a new atom must come to an existing one to land on it instead. */
const MERGE = BOND * 0.3

/** Each element's usual valence, which added hydrogens fill, and the most
 *  bonds it can have before it's overbonded (S and P can expand theirs). R
 *  and X, any group, take one bond and never get hydrogens. */
const VALENCE: Record<ElementSymbol, { usual: number; most: number }> = {
  C: { usual: 4, most: 4 }, H: { usual: 1, most: 1 }, O: { usual: 2, most: 2 }, N: { usual: 3, most: 3 },
  S: { usual: 2, most: 6 }, P: { usual: 3, most: 5 }, F: { usual: 1, most: 1 }, Cl: { usual: 1, most: 1 },
  Br: { usual: 1, most: 1 }, I: { usual: 1, most: 1 }, X: { usual: 0, most: 1 }, R: { usual: 0, most: 1 },
}

export const emptyStructure = (): OrganicStructure => ({ atoms: [], bonds: [] })

export const nextOrder = (order: BondOrder): BondOrder => (order === 3 ? 1 : ((order + 1) as BondOrder))
export const BOND_NAMES: Record<BondOrder, string> = { 1: 'single', 2: 'double', 3: 'triple' }

const newId = () => crypto.randomUUID()
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const RAD = Math.PI / 180

/** A point moved onto the page, a margin in from its edges. */
export const onPage = (p: Point): Point => ({ x: clamp(p.x, MARGIN, WIDTH - MARGIN), y: clamp(p.y, MARGIN, HEIGHT - MARGIN) })

/** A direction in whole degrees from 0 to 359: 0° to the right, 90° down the page. */
export const degrees = (dx: number, dy: number) => ((Math.round(Math.atan2(dy, dx) / RAD) % 360) + 360) % 360
/** The nearest 30° step to a direction. */
export const snapAngle = (dx: number, dy: number) => (Math.round(degrees(dx, dy) / 30) * 30) % 360
/** The point a distance from another in a direction. */
export const step = (p: Point, angle: number, length = BOND): Point => ({
  x: p.x + length * Math.cos(angle * RAD),
  y: p.y + length * Math.sin(angle * RAD),
})
/** How far apart two directions are, from 0 to 180. */
export const turn = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

export const atomById = (s: OrganicStructure, id: string) => s.atoms.find((a) => a.id === id)

export const bondBetween = (s: OrganicStructure, a: string, b: string) =>
  s.bonds.find((bond) => (bond.a === a && bond.b === b) || (bond.a === b && bond.b === a))

export const bondsOf = (s: OrganicStructure, id: string) => s.bonds.filter((b) => b.a === id || b.b === id)

export const otherEnd = (bond: Bond, id: string) => (bond.a === id ? bond.b : bond.a)

export const neighbors = (s: OrganicStructure, id: string) =>
  bondsOf(s, id).map((b) => atomById(s, otherEnd(b, id))).filter((a): a is Atom => !!a)

/** The directions an atom's bonds leave it in. */
export const bondAngles = (s: OrganicStructure, atom: Atom) => neighbors(s, atom.id).map((n) => degrees(n.x - atom.x, n.y - atom.y))

/** The atom nearest a point, if one is within a radius of it. */
export function atomAt(s: OrganicStructure, p: Point, radius = MERGE) {
  let best: Atom | undefined
  let bestD = radius
  for (const a of s.atoms) {
    const d = Math.hypot(a.x - p.x, a.y - p.y)
    if (d <= bestD) [best, bestD] = [a, d]
  }
  return best
}

const bondSum = (s: OrganicStructure, id: string) => bondsOf(s, id).reduce((n, b) => n + b.order, 0)

/** Whether an atom has more bonds than its element can have. */
export const overbonded = (s: OrganicStructure, atom: Atom) => bondSum(s, atom.id) > VALENCE[atom.element].most

/** The hydrogens the editor adds to an atom: its usual valence less its
 *  bonds (a hydrogen the teacher drew counts as one), never below none. */
export function addedHydrogens(s: OrganicStructure, atom: Atom) {
  if (atom.element === 'H') return 0
  return Math.max(0, VALENCE[atom.element].usual - bondSum(s, atom.id))
}

/** How far a point is from the segment between two points. */
export function distanceToSegment(p: Point, a: Point, b: Point) {
  const [dx, dy] = [b.x - a.x, b.y - a.y]
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1)
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

/** How close a point comes to anything drawn, ignoring some atoms. */
function crowding(s: OrganicStructure, p: Point, ignore: string[] = []) {
  let nearest = Infinity
  for (const a of s.atoms) if (!ignore.includes(a.id)) nearest = Math.min(nearest, Math.hypot(a.x - p.x, a.y - p.y))
  return nearest
}

/** Which way a path turns at its middle point: 1 one way, -1 the other, 0 straight on. */
const turnSign = (a: Point, b: Point, c: Point) => Math.sign(Math.round((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)))

/** The 30° direction from an atom with the most room for a new bond. A
 *  chain end grows 120° round from its bond, turning the other way from the
 *  chain's last turn so it zigzags (the more level way for a chain's second
 *  bond); a lone atom grows up to the right. */
export function openAngle(s: OrganicStructure, atom: Atom) {
  const taken = bondAngles(s, atom)
  if (!taken.length) return 330
  const room = (angle: number) => crowding(s, step(atom, angle), [atom.id]) > BOND * 0.6
  if (taken.length === 1) {
    const [back] = neighbors(s, atom.id)
    const before = neighbors(s, back.id).find((n) => n.id !== atom.id)
    const ways = [(taken[0] + 120) % 360, (taken[0] + 240) % 360]
    const ranked = before
      ? ways.sort((p, q) => +(turnSign(back, atom, step(atom, p)) === turnSign(before, back, atom)) - +(turnSign(back, atom, step(atom, q)) === turnSign(before, back, atom)))
      : ways.sort((p, q) => Math.abs(Math.sin(p * RAD)) - Math.abs(Math.sin(q * RAD)))
    return ranked.find(room) ?? ranked[0]
  }
  return Array.from({ length: 12 }, (_, i) => i * 30)
    .map((angle) => ({ angle, room: crowding(s, step(atom, angle), [atom.id]), gap: Math.min(...taken.map((t) => turn(t, angle))) }))
    .sort((p, q) => q.gap - p.gap || q.room - p.room)[0].angle
}

export function addAtom(s: OrganicStructure, element: ElementSymbol, at: Point) {
  const id = newId()
  return { structure: { ...s, atoms: [...s.atoms, { id, element, ...onPage(at) }] }, id }
}

/** How near a snapping spot a tray atom must be dropped to land on it. */
const DROP_SNAP = BOND * 0.45

/** Where a tray atom dropped at a point lands: the nearest spot a bond's
 *  length from an atom with room for another bond, at a 30° step clear of
 *  other atoms, bonded to that atom (the hub); with no spot near the point,
 *  the point itself. */
export function dropSpot(s: OrganicStructure, at: Point): { at: Point; hub: Atom | null } {
  let best: { at: Point; hub: Atom | null } = { at, hub: null }
  let bestD = DROP_SNAP
  for (const a of s.atoms) {
    if (Math.hypot(a.x - at.x, a.y - at.y) > BOND + DROP_SNAP || bondSum(s, a.id) >= VALENCE[a.element].most) continue
    for (let k = 0; k < 12; k++) {
      const p = step(a, k * 30)
      const d = Math.hypot(p.x - at.x, p.y - at.y)
      const page = onPage(p)
      if (d < bestD && page.x === p.x && page.y === p.y && crowding(s, p, [a.id]) >= BOND * 0.6) [best, bestD] = [{ at: p, hub: a }, d]
    }
  }
  return best
}

/** Adds a tray atom where it was dropped, snapped and bonded as dropSpot says. */
export function dropAtom(s: OrganicStructure, element: ElementSymbol, at: Point) {
  const spot = dropSpot(s, at)
  const added = addAtom(s, element, spot.at)
  return spot.hub ? bondAtoms(added.structure, spot.hub.id, added.id)! : added.structure
}

/** Joins two atoms with a single bond: null if they're the same atom or
 *  already bonded. */
export function bondAtoms(s: OrganicStructure, a: string, b: string, order: BondOrder = 1): OrganicStructure | null {
  if (a === b || bondBetween(s, a, b)) return null
  return { ...s, bonds: [...s.bonds, { id: newId(), a, b, order }] }
}

/** Adds a carbon a bond's length from an atom in a direction, bonded to it.
 *  If an atom is already there, the bond goes to that atom instead, which is
 *  how a ring closes. */
export function growFrom(s: OrganicStructure, fromId: string, angle: number) {
  const from = atomById(s, fromId)!
  const at = step(from, angle)
  const there = atomAt(s, at)
  if (there && there.id !== fromId) return { structure: bondAtoms(s, fromId, there.id) ?? s, id: there.id }
  const added = addAtom(s, 'C', at)
  return { structure: bondAtoms(added.structure, fromId, added.id)!, id: added.id }
}

/** Two bonded carbons, the first at a point and the second a bond's length
 *  away in a direction. */
export function startChain(s: OrganicStructure, at: Point, angle: number) {
  const first = addAtom(s, 'C', at)
  return growFrom(first.structure, first.id, angle).structure
}

export const cycleBond = (s: OrganicStructure, bondId: string): OrganicStructure => ({
  ...s,
  bonds: s.bonds.map((b) => (b.id === bondId ? { ...b, order: nextOrder(b.order) } : b)),
})

export const setElement = (s: OrganicStructure, atomId: string, element: ElementSymbol): OrganicStructure => ({
  ...s,
  atoms: s.atoms.map((a) => (a.id === atomId ? { ...a, element } : a)),
})

/** Marks atoms as chiral centers, or unmarks them if they all are already. */
export function toggleChiral(s: OrganicStructure, ids: string[]): OrganicStructure {
  const all = ids.every((id) => atomById(s, id)?.chiral)
  return {
    ...s,
    atoms: s.atoms.map((a) => {
      if (!ids.includes(a.id)) return a
      const { chiral: _, ...rest } = a
      return all ? rest : { ...a, chiral: true }
    }),
  }
}

export type RingTarget = { atom: string } | { bond: string } | { at: Point }

/** How far a ring's corners are from its center. */
const ringRadius = (size: number) => BOND / (2 * Math.sin(Math.PI / size))

/** A ring's corners, the first at an angle from its center, going round one way or the other. */
const ringCorners = (center: Point, size: number, first: number, sweep = 1) =>
  Array.from({ length: size }, (_, k) => step(center, first + (sweep * k * 360) / size, ringRadius(size)))

/** How much room a ring needs round its center, for freeSpot. */
export const ringRoom = (kind: RingKind) => ringRadius(RINGS.find((r) => r.kind === kind)!.size) + BOND

/** Adds a ring: on its own around a point, attached to an atom by a new
 *  bond, or fused along a bond so it shares that bond's two atoms. A corner
 *  landing on an existing atom uses it. Benzene's double bonds alternate,
 *  matched to a shared bond so no atom gets too many. */
export function addRing(s: OrganicStructure, kind: RingKind, target: RingTarget): OrganicStructure {
  const ring = RINGS.find((r) => r.kind === kind)!
  const n = ring.size
  const radius = ringRadius(n)
  let corners: Point[]
  let ids: (string | null)[] = Array(n).fill(null)
  let linkTo: string | null = null

  if ('bond' in target) {
    const shared = s.bonds.find((b) => b.id === target.bond)!
    const [a, b] = [atomById(s, shared.a)!, atomById(s, shared.b)!]
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const along = degrees(b.x - a.x, b.y - a.y)
    const apothem = BOND / (2 * Math.tan(Math.PI / n))
    // The side whose new corners land clear of other atoms, then the one
    // with fewer atoms nearby.
    const sides = [along + 90, along - 90].map((side) => {
      const center = step(mid, side, apothem)
      const fromA = degrees(a.x - center.x, a.y - center.y)
      const sweep = turn(fromA + 360 / n, degrees(b.x - center.x, b.y - center.y)) < 1 ? 1 : -1
      const corners = ringCorners(center, n, fromA, sweep)
      const others = s.atoms.filter((x) => x.id !== a.id && x.id !== b.id)
      const landed = corners.slice(2).filter((c) => others.some((x) => Math.hypot(x.x - c.x, x.y - c.y) < BOND * 0.6)).length
      const busy = others.filter((x) => Math.hypot(x.x - center.x, x.y - center.y) < radius * 1.6).length
      return { corners, landed, busy }
    })
    corners = sides.sort((p, q) => p.landed - q.landed || p.busy - q.busy)[0].corners
    ids[0] = a.id
    ids[1] = b.id
  } else if ('atom' in target) {
    const from = atomById(s, target.atom)!
    const angle = openAngle(s, from)
    const center = step(from, angle, BOND + radius)
    corners = ringCorners(center, n, angle + 180)
    linkTo = from.id
  } else {
    // A ring on its own moves onto the page whole rather than being squashed.
    corners = ringCorners(target.at, n, -90)
    const shift = (lo: number, hi: number, lowest: number, highest: number) => Math.max(lo - lowest, 0) + Math.min(hi - highest, 0)
    const sx = shift(MARGIN, WIDTH - MARGIN, Math.min(...corners.map((c) => c.x)), Math.max(...corners.map((c) => c.x)))
    const sy = shift(MARGIN, HEIGHT - MARGIN, Math.min(...corners.map((c) => c.y)), Math.max(...corners.map((c) => c.y)))
    corners = corners.map((c) => ({ x: c.x + sx, y: c.y + sy }))
  }

  let next = s
  ids = ids.map((id, k) => {
    if (id) return id
    const there = atomAt(next, corners[k])
    if (there) return there.id
    const added = addAtom(next, 'C', corners[k])
    next = added.structure
    return added.id
  })
  if (linkTo) next = bondAtoms(next, linkTo, ids[0]!) ?? next

  // Bond j joins corners j and j + 1. Benzene alternates: doubles on the
  // odd bonds when it's fused onto a single bond (so it still has three of
  // its own), on the even ones otherwise, unless that overbonds more atoms.
  const shared = 'bond' in target ? s.bonds.find((b) => b.id === target.bond)! : null
  const preferred = shared && shared.order === 1 ? 1 : 0
  const ways = ring.aromatic ? [preferred, 1 - preferred] : [-1]
  const built = ways.map((odd) => {
    let r = next
    for (let j = 0; j < n; j++) r = bondAtoms(r, ids[j]!, ids[(j + 1) % n]!, j % 2 === odd ? 2 : 1) ?? r
    return r
  })
  const over = (r: OrganicStructure) => r.atoms.filter((a) => overbonded(r, a)).length
  return built.reduce((best, r) => (over(r) < over(best) ? r : best))
}

/** The shortest bond a teacher can stretch or squash one to. */
export const SHORTEST_BOND = BOND * 0.5
/** How near the usual length a stretched bond must come to settle on it. */
const SETTLE = 8

/** Swings an end atom (one with a single bond) round its neighbor toward a
 *  point: the nearest 30° step, as far out as the point (never shorter than
 *  SHORTEST_BOND, and settling on the usual length near it). Any other atom
 *  is left as it is. */
export function swingEnd(s: OrganicStructure, atomId: string, toward: Point) {
  const atom = atomById(s, atomId)
  const [link] = atom ? bondsOf(s, atomId) : []
  if (!atom || !link || bondsOf(s, atomId).length !== 1) return s
  const hub = atomById(s, otherEnd(link, atomId))!
  const to = onPage(swing(hub, toward, BOND))
  return { ...s, atoms: s.atoms.map((a) => (a.id === atomId ? { ...a, ...to } : a)) }
}

/** Where a bond from a hub toward a point ends: the nearest 30° step, as
 *  far out as the point, never shorter than SHORTEST_BOND and settling on
 *  the usual length near it. */
function swing(hub: Point, toward: Point, usual: number): Point {
  const reach = Math.max(SHORTEST_BOND, Math.hypot(toward.x - hub.x, toward.y - hub.y))
  return step(hub, snapAngle(toward.x - hub.x, toward.y - hub.y), Math.abs(reach - usual) < SETTLE ? usual : reach)
}

/** Swings one of an atom's added hydrogens round it toward a point, as an
 *  end atom swings (stretching from H_BOND). The atom keeps where all its
 *  hydrogens are, from where they were drawn. */
export function swingHydrogen(s: OrganicStructure, atomId: string, drawnAt: Point[], index: number, toward: Point): OrganicStructure {
  const atom = atomById(s, atomId)
  if (!atom || !drawnAt[index]) return s
  const end = onPage(swing(atom, toward, H_BOND))
  const hydrogens = drawnAt.map((p, i) => (i === index ? { x: end.x - atom.x, y: end.y - atom.y } : { x: p.x - atom.x, y: p.y - atom.y }))
  return { ...s, atoms: s.atoms.map((a) => (a.id === atomId ? { ...a, hydrogens } : a)) }
}

/** How near a snapping spot an atom being moved must come to land on it. */
const SNAP = BOND * 0.25

/** Moves one atom toward a point. Near a spot where all its bonds would be
 *  the usual length, or one of them the usual length at a 30° step, it
 *  snaps there (the first kind winning); elsewhere, or without snapping, it
 *  goes where it's put. */
export function moveAtom(s: OrganicStructure, atomId: string, toward: Point, snap = true): OrganicStructure {
  if (!atomById(s, atomId)) return s
  const near = snap ? neighbors(s, atomId) : []
  const nearest = (spots: Point[]) => {
    let best: Point | null = null
    let bestD = SNAP
    for (const p of spots) {
      const d = Math.hypot(p.x - toward.x, p.y - toward.y)
      if (d < bestD) [best, bestD] = [p, d]
    }
    return best
  }
  // Where two of its bonds would both be the usual length.
  const both = near.flatMap((a, i) =>
    near.slice(i + 1).flatMap((b) => {
      const d = Math.hypot(b.x - a.x, b.y - a.y)
      if (!d || d > 2 * BOND) return []
      const h = Math.sqrt(BOND * BOND - (d / 2) ** 2)
      const [mx, my, nx, ny] = [(a.x + b.x) / 2, (a.y + b.y) / 2, -(b.y - a.y) / d, (b.x - a.x) / d]
      return [{ x: mx + nx * h, y: my + ny * h }, { x: mx - nx * h, y: my - ny * h }]
    }),
  )
  const one = near.flatMap((n) => Array.from({ length: 12 }, (_, k) => step(n, k * 30)))
  const to = onPage(nearest(both) ?? nearest(one) ?? toward)
  return { ...s, atoms: s.atoms.map((a) => (a.id === atomId ? { ...a, ...to } : a)) }
}

/** Moves a group of atoms from where they started by (dx, dy), stopping
 *  where the first would leave the page. */
export function moveAtoms(s: OrganicStructure, origins: Map<string, Point>, dx: number, dy: number): OrganicStructure {
  const starts = [...origins.values()]
  if (!starts.length) return s
  const sx = clamp(dx, MARGIN - Math.min(...starts.map((p) => p.x)), WIDTH - MARGIN - Math.max(...starts.map((p) => p.x)))
  const sy = clamp(dy, MARGIN - Math.min(...starts.map((p) => p.y)), HEIGHT - MARGIN - Math.max(...starts.map((p) => p.y)))
  return {
    ...s,
    atoms: s.atoms.map((a) => {
      const o = origins.get(a.id)
      return o ? { ...a, x: o.x + sx, y: o.y + sy } : a
    }),
  }
}

/** Every atom joined to one through bonds, itself included. */
export function connectedTo(s: OrganicStructure, id: string) {
  const seen = new Set([id])
  const queue = [id]
  while (queue.length) {
    const at = queue.pop()!
    for (const b of bondsOf(s, at)) {
      const other = otherEnd(b, at)
      if (!seen.has(other)) {
        seen.add(other)
        queue.push(other)
      }
    }
  }
  return [...seen]
}

/** Each separate organic structure on the page, as its atoms' ids. */
export function parts(s: OrganicStructure) {
  const seen = new Set<string>()
  const found: string[][] = []
  for (const a of s.atoms) {
    if (seen.has(a.id)) continue
    const part = connectedTo(s, a.id)
    for (const id of part) seen.add(id)
    found.push(part)
  }
  return found
}

/** The shortest path of atoms between two, through bonds a test allows, or
 *  null if there's none. */
export function shortestPath(s: OrganicStructure, from: string, to: string, allow: (bond: Bond, next: string) => boolean = () => true) {
  const prev = new Map<string, string | null>([[from, null]])
  const queue = [from]
  while (queue.length && !prev.has(to)) {
    const at = queue.shift()!
    for (const b of bondsOf(s, at)) {
      const n = otherEnd(b, at)
      if (!prev.has(n) && allow(b, n)) {
        prev.set(n, at)
        queue.push(n)
      }
    }
  }
  if (!prev.has(to)) return null
  const path = [to]
  while (prev.get(path[0])) path.unshift(prev.get(path[0])!)
  return path
}

/** The bond nearest a point, if one is within a distance of it. */
export function bondAt(s: OrganicStructure, p: Point, reach: number) {
  let best: Bond | undefined
  let bestD = reach
  for (const b of s.bonds) {
    const d = distanceToSegment(p, atomById(s, b.a)!, atomById(s, b.b)!)
    if (d <= bestD) [best, bestD] = [b, d]
  }
  return best
}

export interface Box { x1: number; y1: number; x2: number; y2: number }

/** The atoms whose centers are inside a box dragged either way. */
export function atomsIn(s: OrganicStructure, box: Box) {
  const [left, right] = [Math.min(box.x1, box.x2), Math.max(box.x1, box.x2)]
  const [top, bottom] = [Math.min(box.y1, box.y2), Math.max(box.y1, box.y2)]
  return s.atoms.filter((a) => a.x >= left && a.x <= right && a.y >= top && a.y <= bottom).map((a) => a.id)
}

export function withoutAtoms(s: OrganicStructure, ids: Iterable<string>): OrganicStructure {
  const gone = new Set(ids)
  return {
    atoms: s.atoms.filter((a) => !gone.has(a.id)),
    bonds: s.bonds.filter((b) => !gone.has(b.a) && !gone.has(b.b)),
  }
}

export const withoutBond = (s: OrganicStructure, bondId: string): OrganicStructure => ({ ...s, bonds: s.bonds.filter((b) => b.id !== bondId) })

/** A spot for something added without dragging it: the page's middle, or
 *  the nearest point to it with room round it (a bond's length for an atom,
 *  more for a ring, see ringRoom), working outward. */
export function freeSpot(s: OrganicStructure, room = BOND): Point {
  const byId = new Map(s.atoms.map((a) => [a.id, a]))
  const free = (p: Point) =>
    s.atoms.every((a) => Math.hypot(a.x - p.x, a.y - p.y) >= room * 1.1) &&
    s.bonds.every((b) => {
      const [a, c] = [byId.get(b.a), byId.get(b.b)]
      return !a || !c || distanceToSegment(p, a, c) >= room - BOND / 2
    })
  const mid = { x: WIDTH / 2, y: HEIGHT / 2 }
  const gap = BOND / 2
  for (let ring = 0; ring < WIDTH / gap; ring++)
    for (let dy = -ring; dy <= ring; dy++)
      for (let dx = -ring; dx <= ring; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue
        const p = { x: mid.x + dx * gap, y: mid.y + dy * gap }
        if (p.x < MARGIN || p.x > WIDTH - MARGIN || p.y < MARGIN || p.y > HEIGHT - MARGIN) continue
        if (free(p)) return p
      }
  return mid
}

/** An organic structure read back from browser storage, keeping only
 *  well-formed atoms (moved onto the page) and one bond between any two. */
export function tidyStructure(stored: unknown): OrganicStructure {
  if (!stored || typeof stored !== 'object') return emptyStructure()
  const { atoms, bonds } = stored as { atoms?: unknown; bonds?: unknown }
  const good = (Array.isArray(atoms) ? atoms : []).filter(
    (a): a is Atom =>
      !!a && typeof a.id === 'string' && ELEMENTS.includes(a.element) && Number.isFinite(a.x) && Number.isFinite(a.y),
  ).map((a) => {
    const hs = Array.isArray(a.hydrogens) && a.hydrogens.every((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y)) ? a.hydrogens : null
    return {
      id: a.id, element: a.element, ...onPage(a),
      ...(hs?.length ? { hydrogens: hs.map((p) => ({ x: p.x, y: p.y })) } : {}),
      ...(a.chiral === true ? { chiral: true } : {}),
    }
  })
  const ids = new Set(good.map((a) => a.id))
  const joined: Bond[] = []
  for (const b of Array.isArray(bonds) ? bonds : []) {
    const ok = !!b && typeof b.id === 'string' && ids.has(b.a) && ids.has(b.b) && b.a !== b.b && [1, 2, 3].includes(b.order)
    if (ok && !bondBetween({ atoms: good, bonds: joined }, b.a, b.b)) joined.push({ id: b.id, a: b.a, b: b.b, order: b.order })
  }
  return { atoms: good, bonds: joined }
}
