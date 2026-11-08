import { describe, expect, test } from 'vitest'
import { VERSIONS, emptyDrawing, imageLook, newStep, tidyDrawing, versionOf, withInk, starterDrawing, withoutSide, withoutVertex, type Drawing } from './drawing.js'
import type { Step } from './transform.js'

const O = { x: 0, y: 0 }
const STEPS: Record<string, Step> = {
  translation: { kind: 'translation', dx: 3, dy: -2 },
  reflection: { kind: 'reflection', line: { kind: 'vertical', c: 0 } },
  rotation: { kind: 'rotation', degrees: 90, direction: 'ccw', center: O },
  dilation: { kind: 'dilation', factor: 2, center: O },
}
const newSteps = (kind: string, at: number) => [newStep(STEPS[kind], at)]
import { buildFigure, shapesOf, shownShapes } from './figure.js'

const triangle = (): Drawing => ({
  ...emptyDrawing(),
  vertices: [{ x: 1, y: 2 }, { x: 4, y: 2 }, { x: 1, y: 6 }],
  names: ['A', 'B', 'C'],
  closed: true,
})

describe('tidyDrawing', () => {
  test('nothing stored is an empty drawing on a four-quadrant grid', () => {
    const d = tidyDrawing(null)
    expect(d).toEqual(emptyDrawing())
    expect([d.grid.xFrom, d.grid.xTo, d.grid.yFrom, d.grid.yTo]).toEqual(['-10', '10', '-10', '10'])
  })
  test('a drawing survives being stored', () => {
    const d = triangle()
    d.steps = [...newSteps('rotation', 0), ...newSteps('reflection', 1), ...newSteps('translation', 2)]
    d.moved = { 'pre:0': { dx: 3, dy: -2 } }
    expect(tidyDrawing(JSON.parse(JSON.stringify(d)))).toEqual(d)
  })
  test('bad values are dropped or fixed', () => {
    const d = tidyDrawing({
      vertices: [{ x: 1, y: 1 }, { x: 'a', y: 2 }, { x: 2, y: 2 }],
      closed: true,
      steps: [{ step: { kind: 'shear' } }, { step: { kind: 'dilation', factor: -2 } }, { step: { kind: 'rotation', degrees: 45 } }],
      grid: { xTo: 12, gridlines: 'neon' },
    })
    expect(d.vertices).toEqual([{ x: 1, y: 1 }, { x: 2, y: 2 }])
    expect(d.closed).toBe(false) // two vertices don't close a polygon
    expect(d.steps.map((s) => s.step)).toEqual([
      { kind: 'dilation', factor: 2, center: { x: 0, y: 0 } },
      { kind: 'rotation', degrees: 90, direction: 'ccw', center: { x: 0, y: 0 } },
    ])
    expect(d.grid.xTo).toBe('12')
    expect(d.grid.gridlines).toBe('standard')
  })
})

describe('the figures', () => {
  test('each image is labeled with one more prime', () => {
    const d = triangle()
    d.steps = [...newSteps('translation', 0), ...newSteps('reflection', 1)]
    d.names[2] = 'Z'
    expect(shapesOf(d).map((s) => s.names)).toEqual([
      ['A', 'B', 'Z'],
      ['A′', 'B′', 'Z′'],
      ['A″', 'B″', 'Z″'],
    ])
  })
  test('no preimage, no images', () => {
    const d = { ...triangle(), vertices: [], names: [] }
    d.steps = newSteps('translation', 0)
    expect(shapesOf(d)).toHaveLength(1)
  })
  test('an open path or a lone point is transformed as it is', () => {
    const path = { ...triangle(), closed: false }
    path.steps = newSteps('translation', 0)
    expect(shapesOf(path).map((s) => s.closed)).toEqual([false, false])
    const point = { ...triangle(), vertices: [{ x: 1, y: 2 }], names: ['P'], closed: false }
    point.steps = newSteps('translation', 0)
    expect(shapesOf(point)[1]).toMatchObject({ pts: [{ x: 4, y: 0 }], names: ['P′'] })
  })
  test('a polygon finished in an older version comes back closed', () => {
    expect(tidyDrawing({ kind: 'polygon', done: true, vertices: triangle().vertices }).closed).toBe(true)
  })
  test('with in-between images off, only the preimage and the last image show', () => {
    const d = triangle()
    d.steps = [...newSteps('translation', 0), ...newSteps('rotation', 1), ...newSteps('dilation', 2)]
    d.show.between = false
    expect(shownShapes(d).map((s) => s.key)).toEqual(['pre', d.steps[2].id])
    d.steps[2].shown = false
    expect(shownShapes(d).map((s) => s.key)).toEqual(['pre'])
  })
  test('a reflection draws its line, a rotation its center, a translation its arrow', () => {
    const d = triangle()
    d.steps = [...newSteps('translation', 0), ...newSteps('reflection', 1), ...newSteps('rotation', 2)]
    const f = buildFigure(d)
    expect(f.arrows).toHaveLength(1)
    expect(f.lines).toHaveLength(1)
    expect(f.centers).toHaveLength(1)
    d.show = { ...d.show, lines: false, centers: false, arrows: false }
    const g = buildFigure(d)
    expect([g.arrows.length, g.lines.length, g.centers.length]).toEqual([0, 0, 0])
  })
  test('labels go where they were dragged', () => {
    const d = triangle()
    const at = buildFigure(d).pointLabels.find((l) => l.key === 'pre:0')!
    d.moved = { 'pre:0': { dx: 10, dy: -5 } }
    const moved = buildFigure(d).pointLabels.find((l) => l.key === 'pre:0')!
    expect([moved.x - at.x, moved.y - at.y]).toEqual([10, -5])
  })
  test('labels sit away from their figure and clear of each other', () => {
    const f = buildFigure(triangle())
    const [a, b, c] = f.pointLabels
    // A is the bottom-left corner: its label is left of it or below it.
    expect(a.x < a.at.x || a.y > a.at.y).toBe(true)
    expect(new Set([a, b, c].map((l) => `${l.x},${l.y}`)).size).toBe(3)
  })
  test('coordinates are written beside the label when asked', () => {
    const d = triangle()
    d.show.coords = true
    expect(buildFigure(d).pointLabels[0]).toMatchObject({ name: 'A', coords: '(1, 2)' })
  })
})

describe('versions', () => {
  const withSteps = () => {
    const d = triangle()
    d.steps = [...newSteps('reflection', 0), ...newSteps('rotation', 1)]
    return d
  }
  test('student: the preimage and its line and center, no images', () => {
    const d = withSteps()
    d.show = { ...d.show, ...VERSIONS.student.show }
    expect(shownShapes(d).map((s) => s.key)).toEqual(['pre'])
    const f = buildFigure(d)
    expect([f.lines.length, f.centers.length]).toEqual([1, 1])
  })
  test('question: the preimage and the final image, nothing that gives the answer away', () => {
    const d = withSteps()
    d.show = { ...d.show, ...VERSIONS.question.show }
    expect(shownShapes(d).map((s) => s.key)).toEqual(['pre', d.steps[1].id])
    const f = buildFigure(d)
    expect([f.lines.length, f.centers.length, f.arrows.length]).toEqual([0, 0, 0])
  })
  test('answer key: everything', () => {
    const d = withSteps()
    d.show = { ...d.show, ...VERSIONS.key.show }
    expect(shownShapes(d)).toHaveLength(3)
  })
  test('which version the drawing shows, if any, whatever its labels', () => {
    const d = withSteps()
    expect(versionOf(d.show)).toBe('key')
    expect(versionOf({ ...d.show, ...VERSIONS.question.show, coords: true })).toBe('question')
    expect(versionOf({ ...d.show, lines: false })).toBeNull()
  })
})

describe('color and black and white', () => {
  test('in color, images take colors in turn; in black and white, all black, told apart by their lines', () => {
    expect([0, 1].map((i) => imageLook(i, 'color').color)).toEqual(['blue', 'red'])
    const bw = [0, 1, 2, 3].map((i) => imageLook(i, 'bw'))
    expect(bw.every((l) => l.color === 'black')).toBe(true)
    expect(new Set(bw.map((l) => `${l.line} ${l.width}`)).size).toBe(4)
  })
  test('switching resets every figure to that mode, and later steps follow it', () => {
    const d = triangle()
    d.steps = [...newSteps('translation', 0), ...newSteps('reflection', 1)]
    d.look = { color: 'purple', line: 'dotted', width: 'thick' }
    const bw = withInk(d, 'bw')
    expect(bw.ink).toBe('bw')
    expect(bw.look).toEqual({ color: 'black', line: 'solid', width: 'medium' })
    expect(bw.steps.map((s) => s.look)).toEqual([imageLook(0, 'bw'), imageLook(1, 'bw')])
    expect(newStep(STEPS.translation, 2, bw.ink).look).toEqual(imageLook(2, 'bw'))
  })
  test('a drawing is in color unless stored in black and white', () => {
    expect(tidyDrawing({}).ink).toBe('color')
    expect(tidyDrawing({ ink: 'bw' }).ink).toBe('bw')
  })
})

describe('deleting part of the preimage', () => {
  const P = (...xs: number[]) => xs.map((x) => ({ x, y: 0 }))
  const square = { vertices: P(0, 1, 2, 3), names: ['A', 'B', 'C', 'D'], closed: true }
  test('a side of a polygon opens it there', () => {
    // Side 1 joins B and C: the path now runs from C round to B.
    expect(withoutSide(square, 1)).toEqual({ vertices: P(2, 3, 0, 1), names: ['C', 'D', 'A', 'B'], closed: false })
    // Side 3 joins D back to A.
    expect(withoutSide(square, 3)).toEqual({ vertices: P(0, 1, 2, 3), names: ['A', 'B', 'C', 'D'], closed: false })
  })
  const path = { vertices: P(0, 1, 2, 3, 4), names: ['A', 'B', 'C', 'D', 'E'], closed: false }
  test('an end side of a path drops its end point', () => {
    expect(withoutSide(path, 0).names).toEqual(['B', 'C', 'D', 'E'])
    expect(withoutSide(path, 3).names).toEqual(['A', 'B', 'C', 'D'])
  })
  test('a middle side of a path keeps the longer piece', () => {
    expect(withoutSide(path, 1).names).toEqual(['C', 'D', 'E'])
    expect(withoutSide(path, 2).names).toEqual(['A', 'B', 'C'])
  })
  test('a vertex goes, and a polygon left with two opens', () => {
    expect(withoutVertex(square, 0)).toEqual({ vertices: P(1, 2, 3), names: ['B', 'C', 'D'], closed: true })
    expect(withoutVertex({ vertices: P(0, 1, 2), names: ['A', 'B', 'C'], closed: true }, 2)).toEqual({ vertices: P(0, 1), names: ['A', 'B'], closed: false })
  })
})

test('the first time, a triangle reflected over the y-axis', () => {
  const d = starterDrawing()
  expect([d.vertices.length, d.closed]).toEqual([3, true])
  // In the top left, like the rest of the editor's examples, its image in the top right.
  expect(d.vertices.every((p) => p.x < 0 && p.y > 0)).toBe(true)
  expect(shapesOf(d)[1].pts.map((p) => p.x)).toEqual(d.vertices.map((p) => -p.x))
  expect(tidyDrawing(JSON.parse(JSON.stringify(d)))).toEqual(d)
})

