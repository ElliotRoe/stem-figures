import { describe, expect, it } from 'vitest'
import { addRing, BOND, emptyStructure, swingHydrogen, type Atom, type Bond, type OrganicStructure } from './structure'
import { drawView, type Drawn, type ViewSettings } from './view'

const atom = (id: string, x: number, y: number, element: Atom['element'] = 'C'): Atom => ({ id, element, x, y })
const bond = (a: string, b: string, order: Bond['order'] = 1): Bond => ({ id: `${a}-${b}`, a, b, order })
const settings = (view: ViewSettings['view'], more: Partial<ViewSettings> = {}): ViewSettings => ({
  view, labelEnds: false, labelRings: true, acids: false, reverseLeft: true, numbering: false, flip: false, caption: '', ...more,
})

const dx = BOND * Math.cos(Math.PI / 6)
const dy = BOND / 2
/** A zigzag of atoms from (300, 300), going up then down. */
function zigzag(elements: Atom['element'][], orders: Bond['order'][] = []): OrganicStructure {
  const atoms = elements.map((e, i) => atom(`a${i + 1}`, 300 + i * dx, i % 2 ? 300 - dy : 300, e))
  const bonds = atoms.slice(1).map((a, i) => bond(atoms[i].id, a.id, orders[i] ?? 1))
  return { atoms, bonds }
}
/** A straight line of atoms across the page. */
function straight(elements: Atom['element'][]): OrganicStructure {
  const atoms = elements.map((e, i) => atom(`a${i + 1}`, 200 + i * BOND, 300, e))
  return { atoms, bonds: atoms.slice(1).map((a, i) => bond(atoms[i].id, a.id)) }
}
const ethanol = zigzag(['C', 'C', 'O'])

const labelOf = (d: Drawn, id: string) => d.labels.find((l) => l.atomId === id)?.text
const labelTexts = (d: Drawn) => d.labels.filter((l) => l.atomId).map((l) => l.text)
/** The added hydrogens' centers. */
const hydrogens = (d: Drawn) => d.labels.filter((l) => !l.atomId).map((l) => ({ x: l.box.x + l.box.width / 2, y: l.box.y + l.box.height / 2 }))
const numberOf = (d: Drawn, id: string) => d.numbers.find((n) => n.atomId === id)?.n
const numbered = (d: Drawn, ids: string[]) => ids.map((id) => numberOf(d, id) ?? 0)

describe('the carbon skeleton', () => {
  it('labels every carbon C, and other atoms with their hydrogens', () => {
    expect(labelTexts(drawView(ethanol, settings('carbons')))).toEqual(['C', 'C', 'OH'])
  })

  it('draws a bond’s lines short of its atoms’ labels', () => {
    const d = drawView(ethanol, settings('carbons'))
    const [line] = d.bonds[0].lines
    expect(line.x1).toBeGreaterThan(300)
    expect(line.x2).toBeLessThan(300 + dx)
  })

  it('marks an overbonded atom, gives it no hydrogens, and keeps the mark out of the crop', () => {
    const s = zigzag(['C', 'O', 'C'], [2, 1])
    const d = drawView(s, settings('carbons'))
    expect(d.overbonded).toEqual(['a2'])
    expect(labelOf(d, 'a2')).toBe('O')
  })

  it('crops to the labels, with a margin', () => {
    const d = drawView(ethanol, settings('carbons'))
    expect(d.crop!.x).toBeLessThan(300 - 8)
    expect(d.crop!.x + d.crop!.width).toBeGreaterThan(300 + 2 * dx + 20)
    expect(drawView(emptyStructure(), settings('carbons')).crop).toBeNull()
  })
})

describe('the condensed formula', () => {
  it('labels each carbon with its hydrogens', () => {
    expect(labelTexts(drawView(ethanol, settings('condensed')))).toEqual(['H3C', 'CH2', 'OH'])
  })

  it('reads backward when the bonds all come from the right', () => {
    const d = drawView(zigzag(['O', 'C', 'C']), settings('condensed'))
    expect(labelTexts(d)).toEqual(['HO', 'CH2', 'CH3'])
    expect(labelTexts(drawView(zigzag(['C', 'C', 'C']), settings('condensed')))[0]).toBe('H3C')
  })

  it('reads forward everywhere when left labels aren’t reversed', () => {
    const d = drawView(zigzag(['O', 'C', 'C']), settings('condensed', { reverseLeft: false }))
    expect(labelTexts(d)).toEqual(['OH', 'CH2', 'CH3'])
    expect(d.leftLabels).toBe(true)
    expect(drawView(zigzag(['C', 'C', 'O']), settings('condensed')).leftLabels).toBe(true)
    expect(drawView(zigzag(['C', 'C', 'C']), settings('skeletal')).leftLabels).toBe(false)
  })

  it('writes the counts as subscripts', () => {
    const d = drawView(ethanol, settings('condensed'))
    expect(d.labels[1].runs).toEqual([{ text: 'C', sub: false }, { text: 'H', sub: false }, { text: '2', sub: true }])
  })

  it('meets the C of a CH₂ with a bond from above', () => {
    const s: OrganicStructure = {
      atoms: [atom('top', 400, 300 - BOND), atom('mid', 400, 300), atom('left', 400 - BOND, 300), atom('right', 400 + BOND, 300, 'O')],
      bonds: [bond('top', 'mid'), bond('left', 'mid'), bond('mid', 'right')],
    }
    const d = drawView(s, settings('condensed'))
    expect(labelOf(d, 'mid')).toBe('CH')
    const [line] = d.bonds[0].lines
    expect(line.x2).toBeCloseTo(400)
    expect(line.y2).toBeLessThan(300 - 8)
  })
})

describe('chiral centers and acid groups', () => {
  const chiral = (s: OrganicStructure, id: string): OrganicStructure => ({ ...s, atoms: s.atoms.map((a) => (a.id === id ? { ...a, chiral: true } : a)) })
  /** Butanoic acid drawn left to right, its =O above the acid carbon. */
  const butanoic = (() => {
    const s = zigzag(['C', 'C', 'C', 'C', 'O'])
    s.atoms.push(atom('o2', 300 + 3 * dx, 300 - dy - BOND, 'O'))
    s.bonds.push(bond('a4', 'o2', 2))
    return s
  })()

  it('writes a chiral center’s asterisk in its label, or beside a bare corner', () => {
    const s = chiral(zigzag(['C', 'C', 'C']), 'a2')
    expect(labelTexts(drawView(s, settings('condensed')))).toEqual(['H3C', '*CH2', 'CH3'])
    const d = drawView(s, settings('skeletal'))
    expect(labelTexts(d)).toEqual([])
    expect(d.stars).toHaveLength(1)
    // Away from both bonds, so above the corner.
    expect(d.stars[0].y).toBeLessThan(300 - dy)
  })

  it('writes an acid group as CO₂H in the condensed formula and carbon skeleton when asked', () => {
    const d = drawView(butanoic, settings('condensed', { acids: true }))
    expect(labelTexts(d)).toEqual(['H3C', 'CH2', 'CH2', 'CO2H'])
    expect(d.bonds).toHaveLength(3)
    expect(d.labels[3].runs.map((r) => r.sub)).toEqual([false, false, true, false])
    expect(labelTexts(drawView(butanoic, settings('carbons', { acids: true })))).toEqual(['C', 'C', 'C', 'CO2H'])
    expect(labelTexts(drawView(butanoic, settings('condensed')))).toContain('OH')
    expect(labelTexts(drawView(butanoic, settings('full', { acids: true })))).toContain('O')
  })

  it('writes an acid group facing left as HO₂C', () => {
    const s = zigzag(['O', 'C', 'C'])
    s.atoms.push(atom('o2', 300 + dx, 300 - dy - BOND, 'O'))
    s.bonds.push(bond('a2', 'o2', 2))
    expect(labelTexts(drawView(s, settings('condensed', { acids: true })))).toEqual(['HO2C', 'CH3'])
  })
})

describe('the skeletal formula', () => {
  it('labels only atoms other than carbon', () => {
    const d = drawView(ethanol, settings('skeletal'))
    expect(labelTexts(d)).toEqual(['OH'])
    expect(d.hidden).toEqual([])
  })

  it('points out carbons drawn in a straight line', () => {
    expect(drawView(straight(['C', 'C', 'C', 'C']), settings('skeletal')).hidden).toEqual(['a2', 'a3'])
    expect(drawView(straight(['C', 'C', 'C', 'C']), settings('condensed')).hidden).toEqual([])
  })

  it('lets an alkyne’s carbons be straight', () => {
    const s = straight(['C', 'C', 'C', 'C'])
    s.bonds[1].order = 3
    expect(drawView(s, settings('skeletal')).hidden).toEqual([])
  })

  it('labels the CH₃ ends when asked', () => {
    const s = zigzag(['C', 'C', 'C', 'C'])
    expect(labelTexts(drawView(s, settings('skeletal', { labelEnds: true })))).toEqual(['H3C', 'CH3'])
    expect(labelTexts(drawView(s, settings('skeletal')))).toEqual([])
  })

  it('labels a carbon on its own', () => {
    expect(labelTexts(drawView({ atoms: [atom('a', 300, 300)], bonds: [] }, settings('skeletal')))).toEqual(['CH4'])
  })

  it('draws a ring’s double bonds inside the ring', () => {
    const benzene = addRing(emptyStructure(), 'benzene', { at: { x: 500, y: 300 } })
    const d = drawView(benzene, settings('skeletal'))
    for (const b of benzene.bonds.filter((b) => b.order === 2)) {
      const drawn = d.bonds.find((x) => x.bondId === b.id)!
      const [outer, inner] = drawn.lines.map((l) => Math.hypot((l.x1 + l.x2) / 2 - 500, (l.y1 + l.y2) / 2 - 300))
      expect(inner).toBeLessThan(outer)
    }
  })

  it('leaves ring carbons bare when ring labels are off, labeling the rest', () => {
    const ring = addRing(emptyStructure(), 'benzene', { at: { x: 500, y: 300 } })
    const top = ring.atoms[0]
    const picoline: OrganicStructure = {
      atoms: [...ring.atoms.map((a, i) => (i === 3 ? { ...a, element: 'N' as const } : a)), atom('me', top.x, top.y - BOND)],
      bonds: [...ring.bonds, bond(top.id, 'me')],
    }
    const off = { labelRings: false }
    expect(labelTexts(drawView(picoline, settings('condensed', off)))).toEqual(['N', 'CH3'])
    expect(labelTexts(drawView(picoline, settings('carbons', off)))).toEqual(['N', 'C'])
    expect(hydrogens(drawView(picoline, settings('full', off)))).toHaveLength(3)
    expect(labelTexts(drawView(picoline, settings('condensed')))).toHaveLength(7)
  })

  it('draws a chain’s double bond on the side of its neighbors, and a C=O centered', () => {
    const propene = zigzag(['C', 'C', 'C'], [2, 1])
    const [axis, offset] = drawView(propene, settings('skeletal')).bonds[0].lines
    expect(axis.x1).toBeCloseTo(300)
    // The third carbon is below the double bond's line, so the second line is too.
    expect(offset.y1 + offset.y2).toBeGreaterThan(axis.y1 + axis.y2)
    const ketone: OrganicStructure = {
      atoms: [...propene.atoms, atom('o', 300 + dx, 300 - dy - BOND, 'O')],
      bonds: [bond('a1', 'a2'), bond('a2', 'a3'), bond('a2', 'o', 2)],
    }
    const [l1, l2] = drawView(ketone, settings('skeletal')).bonds[2].lines
    expect((l1.x1 + l2.x1) / 2).toBeCloseTo(300 + dx)
  })
})

describe('the full structural formula', () => {
  it('draws every hydrogen on its own bond, O–H included', () => {
    const d = drawView(ethanol, settings('full'))
    expect(labelTexts(d)).toEqual(['C', 'C', 'O'])
    expect(hydrogens(d)).toHaveLength(6)
    expect(d.bonds.filter((b) => !b.bondId)).toHaveLength(6)
  })

  it('puts a straight chain’s hydrogens straight above and below', () => {
    const d = drawView(straight(['C', 'C', 'C']), settings('full'))
    const middle = hydrogens(d).filter((h) => Math.abs(h.x - 200 - BOND) < 1)
    expect(middle).toHaveLength(2)
    expect(middle.map((h) => Math.sign(h.y - 300)).sort()).toEqual([-1, 1])
  })

  it('gives methane four and an overbonded carbon none', () => {
    expect(hydrogens(drawView({ atoms: [atom('a', 300, 300)], bonds: [] }, settings('full')))).toHaveLength(4)
    const s = zigzag(['C', 'C'], [3])
    s.atoms.push(atom('x', 300, 300 + BOND), atom('y', 300 - BOND, 300))
    s.bonds.push(bond('a1', 'x'), bond('a1', 'y'))
    const d = drawView(s, settings('full'))
    expect(hydrogens(d)).toHaveLength(1 + 3 + 3)
  })

  it('draws a dragged hydrogen where it was swung, until its atom’s count changes', () => {
    const d = drawView(ethanol, settings('full'))
    const drawnAt = d.hydrogens.filter((h) => h.atomId === 'a3').map(({ x, y }) => ({ x, y }))
    const s = swingHydrogen(ethanol, 'a3', drawnAt, 0, { x: 300 + 2 * dx, y: 300 + 2 * BOND })
    const moved = drawView(s, settings('full')).hydrogens.find((h) => h.atomId === 'a3')!
    expect(moved.x).toBeCloseTo(300 + 2 * dx)
    expect(moved.y).toBeCloseTo(300 + 2 * BOND)
    // It moves with its atom, and is placed afresh once the O has no hydrogen.
    const shifted = { ...s, atoms: s.atoms.map((a) => (a.id === 'a3' ? { ...a, x: a.x + 10 } : a)) }
    expect(drawView(shifted, settings('full')).hydrogens.find((h) => h.atomId === 'a3')!.x).toBeCloseTo(300 + 2 * dx + 10)
    const bonded: OrganicStructure = { atoms: [...s.atoms, atom('me', 300 + 3 * dx, 300 - dy)], bonds: [...s.bonds, bond('a3', 'me')] }
    expect(drawView(bonded, settings('full')).hydrogens.filter((h) => h.atomId === 'a3')).toHaveLength(0)
  })

  it('crops to include every hydrogen', () => {
    const d = drawView(straight(['C', 'C']), settings('full'))
    const top = Math.min(...hydrogens(d).map((h) => h.y))
    expect(d.crop!.y).toBeLessThan(top - 8)
  })
})

describe('carbon numbering', () => {
  const on = (more: Partial<ViewSettings> = {}) => settings('skeletal', { numbering: true, ...more })

  it('numbers butan-2-ol from the end nearer the OH', () => {
    const s = zigzag(['C', 'C', 'C', 'C'])
    s.atoms.push(atom('o', 300 + 2 * dx, 300 + BOND, 'O'))
    s.bonds.push(bond('a3', 'o'))
    expect(numbered(drawView(s, on()), ['a1', 'a2', 'a3', 'a4'])).toEqual([4, 3, 2, 1])
  })

  it('numbers butanoic acid’s C=O carbon 1', () => {
    const s = zigzag(['C', 'C', 'C', 'C', 'O'])
    s.atoms.push(atom('o2', 300 + 3 * dx, 300 - dy - BOND, 'O'))
    s.bonds.push(bond('a4', 'o2', 2))
    expect(numbered(drawView(s, on()), ['a1', 'a2', 'a3', 'a4'])).toEqual([4, 3, 2, 1])
  })

  it('numbers but-1-ene from the double bond', () => {
    expect(numbered(drawView(zigzag(['C', 'C', 'C', 'C'], [1, 1, 2]), on()), ['a1', 'a2', 'a3', 'a4'])).toEqual([4, 3, 2, 1])
  })

  it('numbers the longest chain of 2-methylpentane, nearer the branch, and leaves the branch out', () => {
    const s = zigzag(['C', 'C', 'C', 'C', 'C'])
    s.atoms.push(atom('me', 300 + 3 * dx, 300 - dy - BOND))
    s.bonds.push(bond('a4', 'me'))
    const d = drawView(s, on())
    expect(numbered(d, ['a1', 'a2', 'a3', 'a4', 'a5', 'me'])).toEqual([5, 4, 3, 2, 1, 0])
  })

  it('flips the other way', () => {
    const s = zigzag(['C', 'C', 'C', 'C'], [1, 1, 2])
    expect(numbered(drawView(s, on({ flip: true })), ['a1', 'a2', 'a3', 'a4'])).toEqual([1, 2, 3, 4])
  })

  it('numbers a ring from its substituent', () => {
    const ring = addRing(emptyStructure(), 'cyclohexane', { at: { x: 500, y: 300 } })
    const top = ring.atoms[0]
    const s: OrganicStructure = { atoms: [...ring.atoms, atom('me', top.x, top.y - BOND)], bonds: [...ring.bonds, bond(top.id, 'me')] }
    const d = drawView(s, on())
    expect(numberOf(d, top.id)).toBe(1)
    expect(numberOf(d, 'me')).toBeUndefined()
    expect(ring.atoms.map((a) => numberOf(d, a.id)).sort()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('numbers each organic structure on the page by itself', () => {
    const one = zigzag(['C', 'C'])
    const two: OrganicStructure = { atoms: [atom('b1', 700, 300), atom('b2', 700 + dx, 300 - dy)], bonds: [bond('b1', 'b2')] }
    const d = drawView({ atoms: [...one.atoms, ...two.atoms], bonds: [...one.bonds, ...two.bonds] }, on())
    expect(d.numbers.map((n) => n.n).sort()).toEqual([1, 1, 2, 2])
  })

  it('doesn’t number two rings or a ring with N or O, and says so', () => {
    const benzene = addRing(emptyStructure(), 'benzene', { at: { x: 500, y: 300 } })
    const naphthalene = addRing(benzene, 'benzene', { bond: benzene.bonds[0].id })
    const d = drawView(naphthalene, on())
    expect(d.numbers).toEqual([])
    expect(d.numberingNote).toBeTruthy()
    const pyridine = { ...benzene, atoms: benzene.atoms.map((a, i) => (i ? a : { ...a, element: 'N' as const })) }
    expect(drawView(pyridine, on()).numbers).toEqual([])
    expect(drawView(benzene, on()).numberingNote).toBeNull()
  })

  it('places numbers clear of the full structural formula’s hydrogens', () => {
    const d = drawView(straight(['C', 'C', 'C']), settings('full', { numbering: true }))
    for (const n of d.numbers)
      for (const h of hydrogens(d)) expect(Math.hypot(n.x - h.x, n.y - h.y)).toBeGreaterThan(12)
  })

  it('draws no numbers when it’s off', () => {
    expect(drawView(ethanol, settings('skeletal')).numbers).toEqual([])
  })
})

describe('the caption', () => {
  it('sits under the drawing, inside the crop', () => {
    const plain = drawView(ethanol, settings('skeletal'))
    const d = drawView(ethanol, settings('skeletal', { caption: 'Ethanol' }))
    expect(d.caption!.text).toBe('Ethanol')
    expect(d.caption!.y).toBeGreaterThan(300)
    expect(d.crop!.y + d.crop!.height).toBeGreaterThan(plain.crop!.y + plain.crop!.height + 15)
    expect(plain.caption).toBeNull()
  })
})
