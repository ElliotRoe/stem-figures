import { describe, expect, it } from 'vitest'
import {
  addAtom, addedHydrogens, addRing, atomsIn, BOND, bondAtoms, bondBetween, connectedTo, cycleBond, dropAtom, dropSpot, emptyStructure,
  freeSpot, growFrom, ringRoom, HEIGHT, MARGIN, moveAtom, moveAtoms, nextOrder, openAngle, overbonded, setElement, snapAngle, startChain,
  swingEnd, swingHydrogen, H_BOND, tidyStructure, toggleChiral, WIDTH, withoutAtoms, withoutBond, type Atom, type Bond, type OrganicStructure,
} from './structure'

const atom = (id: string, x: number, y: number, element: Atom['element'] = 'C'): Atom => ({ id, element, x, y })
const bond = (a: string, b: string, order: Bond['order'] = 1): Bond => ({ id: `${a}${b}`, a, b, order })
const length = (s: OrganicStructure, b: Bond) => {
  const [p, q] = [s.atoms.find((a) => a.id === b.a)!, s.atoms.find((a) => a.id === b.b)!]
  return Math.hypot(q.x - p.x, q.y - p.y)
}
const dx = BOND * Math.cos(Math.PI / 6)
const dy = BOND / 2
/** Ethanol as the teacher draws it: C–C–O, no hydrogens. */
const ethanol: OrganicStructure = {
  atoms: [atom('c1', 300, 300), atom('c2', 300 + dx, 300 - dy), atom('o', 300 + 2 * dx, 300, 'O')],
  bonds: [bond('c1', 'c2'), bond('c2', 'o')],
}

describe('snapping', () => {
  it('snaps a drag to the nearest 30° step, 0° to the right and 90° down the page', () => {
    expect(snapAngle(1, 0)).toBe(0)
    expect(snapAngle(1, 0.5)).toBe(30)
    expect(snapAngle(0, 1)).toBe(90)
    expect(snapAngle(-1, -0.1)).toBe(180)
    expect(snapAngle(1, -0.6)).toBe(330)
  })
})

describe('drawing', () => {
  it('adds a bonded carbon a bond’s length away at the snapped angle', () => {
    const { structure, id } = growFrom(ethanol, 'o', 330)
    const added = structure.atoms.find((a) => a.id === id)!
    expect(added.element).toBe('C')
    expect(added.x).toBeCloseTo(300 + 3 * dx)
    expect(added.y).toBeCloseTo(300 - dy)
    expect(bondBetween(structure, 'o', id)?.order).toBe(1)
  })

  it('bonds to an atom already where the new carbon would go, closing a ring', () => {
    const s: OrganicStructure = { atoms: [atom('a', 300, 300), atom('b', 300 + BOND, 300)], bonds: [] }
    const { structure, id } = growFrom(s, 'a', 0)
    expect(id).toBe('b')
    expect(structure.atoms).toHaveLength(2)
    expect(bondBetween(structure, 'a', 'b')).toBeTruthy()
  })

  it('starts a chain as two bonded carbons', () => {
    const s = startChain(emptyStructure(), { x: 400, y: 300 }, 30)
    expect(s.atoms.map((a) => a.element)).toEqual(['C', 'C'])
    expect(s.bonds).toHaveLength(1)
    expect(length(s, s.bonds[0])).toBeCloseTo(BOND)
  })

  it('bonds two atoms once, and never an atom to itself', () => {
    const s = bondAtoms(ethanol, 'c1', 'o')!
    expect(bondBetween(s, 'c1', 'o')).toBeTruthy()
    expect(bondAtoms(s, 'o', 'c1')).toBeNull()
    expect(bondAtoms(s, 'o', 'o')).toBeNull()
  })

  it('cycles a bond single, double, triple, then single again', () => {
    expect([nextOrder(1), nextOrder(2), nextOrder(3)]).toEqual([2, 3, 1])
    const s = cycleBond(ethanol, ethanol.bonds[0].id)
    expect(s.bonds[0].order).toBe(2)
    expect(s.bonds[1].order).toBe(1)
  })

  it('changes only an atom’s element when a tray atom is dropped on it', () => {
    const s = setElement(ethanol, 'c1', 'Cl')
    expect(s.atoms[0]).toEqual({ ...ethanol.atoms[0], element: 'Cl' })
    expect(s.bonds).toEqual(ethanol.bonds)
  })

  it('snaps a tray atom dropped near an atom a bond’s length from it, on a 30° step, and bonds them', () => {
    const s = dropAtom(ethanol, 'Cl', { x: 300 - BOND + 10, y: 300 + 12 })
    const cl = s.atoms.find((a) => a.element === 'Cl')!
    expect(cl.x).toBeCloseTo(300 - BOND)
    expect(cl.y).toBeCloseTo(300)
    expect(bondBetween(s, 'c1', cl.id)).toBeTruthy()
  })

  it('leaves a tray atom where it was dropped when no spot is near, or the near atom is full', () => {
    expect(dropSpot(ethanol, { x: 700, y: 500 })).toEqual({ at: { x: 700, y: 500 }, hub: null })
    const full = setElement(ethanol, 'o', 'Cl')
    expect(dropSpot(full, { x: 300 + 3 * dx, y: 300 - dy }).hub).toBeNull()
  })

  it('never snaps a tray atom onto a spot crowded by another atom', () => {
    const spot = dropSpot(ethanol, { x: 300 + dx + 5, y: 300 + dy })
    expect(spot.hub).not.toBeNull()
    for (const a of ethanol.atoms) if (a.id !== spot.hub!.id) expect(Math.hypot(a.x - spot.at.x, a.y - spot.at.y)).toBeGreaterThan(BOND * 0.6)
  })

  it('places a lone atom on the page, kept off its edges', () => {
    const { structure, id } = addAtom(emptyStructure(), 'O', { x: -20, y: HEIGHT + 5 })
    expect(structure.atoms[0]).toMatchObject({ id, element: 'O', x: MARGIN, y: HEIGHT - MARGIN })
  })

  it('grows a chain as a zigzag', () => {
    expect(openAngle(ethanol, ethanol.atoms[2])).toBe(330)
    let s = startChain(emptyStructure(), { x: 300, y: 300 }, 330)
    for (let i = 0; i < 4; i++) {
      const end = s.atoms[s.atoms.length - 1]
      s = growFrom(s, end.id, openAngle(s, end)).structure
    }
    expect(s.atoms.map((a) => Math.round(a.y))).toEqual([300, 265, 300, 265, 300, 265])
  })
})

describe('rings', () => {
  const doubles = (s: OrganicStructure) => s.bonds.filter((b) => b.order === 2).length

  it('places a benzene ring on its own with three double bonds, every side a bond long', () => {
    const s = addRing(emptyStructure(), 'benzene', { at: { x: 500, y: 300 } })
    expect(s.atoms).toHaveLength(6)
    expect(s.bonds).toHaveLength(6)
    expect(doubles(s)).toBe(3)
    for (const b of s.bonds) expect(length(s, b)).toBeCloseTo(BOND)
    expect(s.atoms.every((a) => !overbonded(s, a))).toBe(true)
  })

  it('attaches a ring to an atom by one new bond', () => {
    const s = addRing(ethanol, 'benzene', { atom: 'c1' })
    expect(s.atoms).toHaveLength(9)
    expect(s.bonds).toHaveLength(9)
    expect(s.bonds.filter((b) => b.a === 'c1' || b.b === 'c1')).toHaveLength(2)
  })

  it('fuses a ring along a bond, sharing its two atoms', () => {
    const s = addRing(ethanol, 'cyclohexane', { bond: ethanol.bonds[0].id })
    expect(s.atoms).toHaveLength(7)
    expect(s.bonds).toHaveLength(7)
    expect(connectedTo(s, 'c1')).toHaveLength(7)
  })

  it('fuses benzene onto benzene without giving any atom too many bonds', () => {
    const one = addRing(emptyStructure(), 'benzene', { at: { x: 500, y: 300 } })
    for (const shared of one.bonds) {
      const two = addRing(one, 'benzene', { bond: shared.id })
      expect(two.atoms).toHaveLength(10)
      expect(two.atoms.every((a) => !overbonded(two, a))).toBe(true)
      expect(doubles(two)).toBe(5)
    }
  })

  it('gives benzene fused onto a single bond three double bonds of its own', () => {
    const ring = addRing(emptyStructure(), 'cyclohexane', { at: { x: 500, y: 300 } })
    expect(doubles(addRing(ring, 'benzene', { bond: ring.bonds[0].id }))).toBe(3)
  })

  it('puts a ring added without dragging clear of the rings already there', () => {
    let s = addRing(emptyStructure(), 'benzene', { at: freeSpot(emptyStructure(), ringRoom('benzene')) })
    s = addRing(s, 'benzene', { at: freeSpot(s, ringRoom('benzene')) })
    expect(s.atoms).toHaveLength(12)
    expect(s.bonds).toHaveLength(12)
  })

  it('moves a ring placed near the page’s edge onto the page whole', () => {
    const s = addRing(emptyStructure(), 'benzene', { at: { x: WIDTH - 10, y: 300 } })
    for (const b of s.bonds) expect(length(s, b)).toBeCloseTo(BOND)
  })

  it('adds a five-membered ring', () => {
    const s = addRing(emptyStructure(), 'cyclopentane', { at: { x: 500, y: 300 } })
    expect(s.atoms).toHaveLength(5)
    expect(doubles(s)).toBe(0)
  })
})

describe('hydrogens', () => {
  it('fills each atom’s usual valence after its bonds', () => {
    expect(ethanol.atoms.map((a) => addedHydrogens(ethanol, a))).toEqual([3, 2, 1])
  })

  it('counts a hydrogen the teacher drew toward its neighbor', () => {
    const s: OrganicStructure = { atoms: [...ethanol.atoms, atom('h', 400, 400, 'H')], bonds: [...ethanol.bonds, bond('o', 'h')] }
    expect(addedHydrogens(s, s.atoms[2])).toBe(0)
    expect(addedHydrogens(s, s.atoms[3])).toBe(0)
  })

  it('gives an overbonded atom none', () => {
    const s = cycleBond(cycleBond(ethanol, ethanol.bonds[1].id), ethanol.bonds[1].id)
    const o = s.atoms[2]
    expect(overbonded(s, o)).toBe(true)
    expect(addedHydrogens(s, o)).toBe(0)
  })

  it('gives an R group none, alone or bonded, and lets it take one bond', () => {
    const r = setElement(ethanol, 'o', 'R')
    expect(r.atoms.map((a) => addedHydrogens(r, a))).toEqual([3, 2, 0])
    expect(addedHydrogens(r, atom('lone', 0, 0, 'R'))).toBe(0)
    const double = cycleBond(r, r.bonds[1].id)
    expect(overbonded(double, double.atoms[2])).toBe(true)
  })

  it('treats X like R: one bond, and no hydrogens even on its own', () => {
    const x = setElement(ethanol, 'o', 'X')
    expect(x.atoms.map((a) => addedHydrogens(x, a))).toEqual([3, 2, 0])
    expect(addedHydrogens(x, atom('lone', 0, 0, 'X'))).toBe(0)
    const double = cycleBond(x, x.bonds[1].id)
    expect(overbonded(double, double.atoms[2])).toBe(true)
  })
})

describe('moving', () => {
  const c2 = ethanol.atoms[1]

  it('swings an end atom round its neighbor to the nearest 30°, settling on the usual length near it', () => {
    const s = swingEnd(ethanol, 'o', { x: c2.x + 3, y: c2.y + BOND - 5 })
    const o = s.atoms[2]
    expect(o.x).toBeCloseTo(c2.x)
    expect(o.y - c2.y).toBeCloseTo(BOND)
    expect(s.atoms.slice(0, 2)).toEqual(ethanol.atoms.slice(0, 2))
  })

  it('stretches or squashes an end atom’s bond to the pointer, but not below half a bond', () => {
    expect(swingEnd(ethanol, 'o', { x: c2.x, y: c2.y + 2 * BOND }).atoms[2].y - c2.y).toBeCloseTo(2 * BOND)
    expect(swingEnd(ethanol, 'o', { x: c2.x, y: c2.y + 3 }).atoms[2].y - c2.y).toBeCloseTo(BOND / 2)
  })

  it('swings an added hydrogen round its atom, keeping where the others were drawn', () => {
    const drawnAt = [{ x: c2.x, y: c2.y - H_BOND }, { x: c2.x, y: c2.y + H_BOND }]
    const s = swingHydrogen(ethanol, 'c2', drawnAt, 1, { x: c2.x + 2 * BOND, y: c2.y })
    expect(s.atoms[1].hydrogens![0]).toEqual({ x: 0, y: -H_BOND })
    expect(s.atoms[1].hydrogens![1].x).toBeCloseTo(2 * BOND)
    expect(s.atoms[1].hydrogens![1].y).toBeCloseTo(0)
    expect(tidyStructure(JSON.parse(JSON.stringify(s))).atoms[1].hydrogens).toEqual(s.atoms[1].hydrogens)
  })

  it('marks atoms as chiral centers, and unmarks them when they all are', () => {
    const s = toggleChiral(ethanol, ['c2'])
    expect(s.atoms[1].chiral).toBe(true)
    expect(tidyStructure(JSON.parse(JSON.stringify(s))).atoms[1].chiral).toBe(true)
    expect(toggleChiral(s, ['c2']).atoms[1].chiral).toBeUndefined()
    expect(toggleChiral(s, ['c1', 'c2']).atoms.slice(0, 2).every((a) => a.chiral)).toBe(true)
  })

  it('doesn’t swing an atom with two bonds', () => {
    expect(swingEnd(ethanol, 'c2', { x: 0, y: 0 })).toBe(ethanol)
  })

  it('snaps a moved atom where its bonds come out the usual length, or else at a 30° step', () => {
    // c2 dragged near the other spot where both its bonds are a bond long.
    const s = moveAtom(ethanol, 'c2', { x: 300 + dx + 4, y: 300 + dy - 5 })
    expect(s.atoms[1].x).toBeCloseTo(300 + dx)
    expect(s.atoms[1].y).toBeCloseTo(300 + dy)
    // Near a spot 30° from c1 only.
    const c1 = ethanol.atoms[0]
    const t = moveAtom(ethanol, 'c2', { x: c1.x + BOND + 3, y: c1.y + 2 })
    expect(t.atoms[1]).toMatchObject({ x: c1.x + BOND, y: c1.y })
    // Far from any spot, or without snapping, it goes where it's put.
    expect(moveAtom(ethanol, 'c2', { x: 500, y: 500 }).atoms[1]).toMatchObject({ x: 500, y: 500 })
    expect(moveAtom(ethanol, 'c2', { x: c1.x + BOND + 3, y: c1.y + 2 }, false).atoms[1]).toMatchObject({ x: c1.x + BOND + 3, y: c1.y + 2 })
  })

  it('moves one atom on its own, stretching its bonds', () => {
    const s = moveAtoms(ethanol, new Map([['c2', { x: c2.x, y: c2.y }]]), 0, -20)
    expect(s.atoms[1]).toMatchObject({ x: c2.x, y: c2.y - 20 })
    expect([s.atoms[0], s.atoms[2]]).toEqual([ethanol.atoms[0], ethanol.atoms[2]])
  })

  it('moves a group together, stopping at the page’s edge', () => {
    const origins = new Map(ethanol.atoms.map((a) => [a.id, { x: a.x, y: a.y }]))
    const s = moveAtoms(ethanol, origins, 10_000, -10_000)
    expect(Math.max(...s.atoms.map((a) => a.x))).toBeCloseTo(WIDTH - MARGIN)
    expect(Math.min(...s.atoms.map((a) => a.y))).toBeCloseTo(MARGIN)
    expect(length(s, s.bonds[0])).toBeCloseTo(BOND)
  })

  it('finds every atom joined to one', () => {
    const s: OrganicStructure = { ...ethanol, atoms: [...ethanol.atoms, atom('x', 800, 500)] }
    expect(connectedTo(s, 'o').sort()).toEqual(['c1', 'c2', 'o'])
  })

  it('selects the atoms inside a box dragged either way', () => {
    expect(atomsIn(ethanol, { x1: 320 + 2 * dx, y1: 200, x2: 280, y2: 310 }).sort()).toEqual(['c1', 'c2', 'o'])
    expect(atomsIn(ethanol, { x1: 290, y1: 290, x2: 310, y2: 310 })).toEqual(['c1'])
  })
})

describe('deleting', () => {
  it('removes atoms with their bonds', () => {
    const s = withoutAtoms(ethanol, ['c2'])
    expect(s.atoms.map((a) => a.id)).toEqual(['c1', 'o'])
    expect(s.bonds).toEqual([])
  })

  it('removes one bond', () => {
    expect(withoutBond(ethanol, ethanol.bonds[0].id).bonds).toEqual([ethanol.bonds[1]])
  })
})

describe('free spots', () => {
  it('uses the page’s middle when it’s free', () => {
    expect(freeSpot(emptyStructure())).toEqual({ x: WIDTH / 2, y: HEIGHT / 2 })
  })

  it('moves away from atoms and bonds already there', () => {
    const s = startChain(emptyStructure(), { x: WIDTH / 2, y: HEIGHT / 2 }, 0)
    const p = freeSpot(s)
    for (const a of s.atoms) expect(Math.hypot(a.x - p.x, a.y - p.y)).toBeGreaterThanOrEqual(BOND)
  })
})

describe('reading back from storage', () => {
  it('keeps well-formed atoms on the page and bonds between two of them, once each', () => {
    const s = tidyStructure({
      atoms: [atom('a', 300, 300), atom('b', 2000, 300), { id: 'c', element: 'Xx', x: 1, y: 1 }, { id: 'd' }],
      bonds: [bond('a', 'b'), bond('b', 'a'), bond('a', 'c'), bond('a', 'a'), { id: 'z', a: 'a', b: 'b', order: 4 }],
    })
    expect(s.atoms.map((a) => a.id)).toEqual(['a', 'b'])
    expect(s.atoms[1].x).toBe(WIDTH - MARGIN)
    expect(s.bonds.map((b) => b.id)).toEqual(['ab'])
  })

  it('starts empty from anything else', () => {
    expect(tidyStructure(null)).toEqual(emptyStructure())
    expect(tidyStructure('x')).toEqual(emptyStructure())
  })
})
