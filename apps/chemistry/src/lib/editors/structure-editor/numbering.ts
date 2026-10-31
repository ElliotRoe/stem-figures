// Carbon numbering: small numbers beside the carbons of each organic
// structure's chain or ring, so students can see which carbon is which when
// naming. It follows the naming rules high school uses, without being IUPAC
// naming: a ring is numbered round from its substituents; otherwise the
// chain through the principal group (C=O, then a carbon bonded to O or N) or
// the longest chain, from the end nearest the C=O, the O or N, a double or
// triple bond, then a branch. Two rings, or a ring with N or O in it, aren't
// numbered.
import { atomById, bondBetween, bondsOf, neighbors, otherEnd, parts, shortestPath, type OrganicStructure } from './structure'

export const NUMBERING_NOTE = 'Numbering isn’t worked out for two rings, or a ring with N or O in it.'

/** Lists compared from the front, the lower first difference winning. */
function compareLocants(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}

export function carbonNumbers(s: OrganicStructure, flip: boolean) {
  const numbers = new Map<string, number>()
  let note: string | null = null
  const element = (id: string) => atomById(s, id)!.element
  const isCarbonyl = (id: string) => bondsOf(s, id).some((b) => b.order === 2 && element(otherEnd(b, id)) === 'O')
  const toOorN = (id: string) => neighbors(s, id).some((n) => n.element === 'O' || n.element === 'N')

  /** The positions, from 1, of what each rule looks at along an order. */
  function locants(order: string[], closed: boolean, aromatic: boolean) {
    const along = new Set(order)
    const at = (test: (id: string) => boolean) => order.flatMap((id, i) => (test(id) ? [i + 1] : []))
    const multiple = aromatic
      ? []
      : order.flatMap((id, i) => {
          const next = order[i + 1] ?? (closed ? order[0] : undefined)
          return next && (bondBetween(s, id, next)?.order ?? 1) > 1 ? [i + 1] : []
        })
    const branches = order.flatMap((id, i) => neighbors(s, id).filter((n) => !along.has(n.id) && n.element !== 'H').map(() => i + 1))
    return [at(isCarbonyl), at(toOorN), multiple, branches]
  }
  const better = (a: number[][], b: number[][]) => {
    for (let i = 0; i < a.length; i++) {
      const c = compareLocants(a[i], b[i])
      if (c) return c < 0
    }
    return false
  }

  function chain(part: string[]) {
    const carbons = part.filter((id) => element(id) === 'C')
    const carbonNeighbors = (id: string) => neighbors(s, id).filter((n) => n.element === 'C').map((n) => n.id)
    const ends = carbons.filter((id) => carbonNeighbors(id).length <= 1)
    const pathBetween = (from: string, to: string) => shortestPath(s, from, to, (_, next) => element(next) === 'C')
    const paths: string[][] = []
    for (let i = 0; i < ends.length; i++)
      for (let j = i; j < ends.length; j++) {
        if (i === j && carbonNeighbors(ends[i]).length) continue
        const path = pathBetween(ends[i], ends[j])
        if (path) paths.push(path)
      }
    const rank = (path: string[]) => {
      const [carbonyl, oOrN, multiple, branches] = locants(path, false, false)
      return [+!!carbonyl.length, +!!oOrN.length, path.length, multiple.length, branches.length]
    }
    const best = paths.reduce((p, q) => (compareLocants(rank(q), rank(p)) > 0 ? q : p))
    const back = [...best].reverse()
    return better(locants(back, false, false), locants(best, false, false)) ? back : best
  }

  function ring(cycle: string[]) {
    const n = cycle.length
    const aromatic = n === 6 && cycle.filter((id, i) => bondBetween(s, id, cycle[(i + 1) % n])?.order === 2).length === 3
    // Start at the top atom and go clockwise round the page, so an
    // unsubstituted ring numbers the same way every time.
    const points = cycle.map((id) => atomById(s, id)!)
    const area = points.reduce((sum, p, i) => sum + p.x * points[(i + 1) % n].y - points[(i + 1) % n].x * p.y, 0)
    const round = area > 0 ? cycle : [...cycle].reverse()
    const top = round.reduce((best, id, i) => {
      const [p, q] = [atomById(s, id)!, atomById(s, round[best])!]
      return p.y < q.y - 0.5 || (Math.abs(p.y - q.y) <= 0.5 && p.x < q.x) ? i : best
    }, 0)
    let best: string[] | null = null
    for (const dir of [1, -1])
      for (let k = 0; k < n; k++) {
        const order = Array.from({ length: n }, (_, i) => round[(((top + k + dir * i) % n) + n) % n])
        if (!best || better(locants(order, true, aromatic), locants(best, true, aromatic))) best = order
      }
    return best!
  }

  for (const part of parts(s)) {
    if (!part.some((id) => element(id) === 'C')) continue
    const inPart = new Set(part)
    const rings = s.bonds.filter((b) => inPart.has(b.a)).length - part.length + 1
    let order: string[]
    if (rings >= 2) {
      note = NUMBERING_NOTE
      continue
    } else if (rings === 1) {
      const cycle = cycleOf(s, part)
      if (cycle.some((id) => element(id) !== 'C')) {
        note = NUMBERING_NOTE
        continue
      }
      order = ring(cycle)
      if (flip) order = [order[0], ...order.slice(1).reverse()]
    } else {
      order = chain(part)
      if (flip) order = [...order].reverse()
    }
    order.forEach((id, i) => numbers.set(id, i + 1))
  }
  return { numbers, note }
}

/** The atoms of a part's one ring, in order round it: what's left after
 *  pruning every chain back to the ring. */
function cycleOf(s: OrganicStructure, part: string[]) {
  const degree = new Map(part.map((id) => [id, bondsOf(s, id).length]))
  const left = new Set(part)
  const queue = part.filter((id) => degree.get(id)! <= 1)
  while (queue.length) {
    const id = queue.pop()!
    if (!left.delete(id)) continue
    for (const n of neighbors(s, id))
      if (left.has(n.id)) {
        degree.set(n.id, degree.get(n.id)! - 1)
        if (degree.get(n.id)! <= 1) queue.push(n.id)
      }
  }
  const [first] = left
  const cycle = [first]
  for (let prev: string | null = null; ; ) {
    const at = cycle[cycle.length - 1]
    const next = neighbors(s, at).find((n) => left.has(n.id) && n.id !== prev && n.id !== first)
    if (!next) break
    prev = at
    cycle.push(next.id)
  }
  return cycle
}
