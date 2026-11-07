import { describe, expect, test } from 'vitest'
import {
  apply, describeStep, imagesOf, lineName, nearestLine, offGrid, offLattice, primed, rotationChoices, tooClose, vertexName, widenGrid,
  type Line, type Pt, type Step,
} from './transform.js'

const tri: Pt[] = [{ x: 1, y: 2 }, { x: 4, y: 2 }, { x: 1, y: 6 }]
const at = (step: Step, p: Pt) => apply(step, p)

describe('translation', () => {
  test('slides every point by ⟨a, b⟩', () => {
    expect(at({ kind: 'translation', dx: 3, dy: -2 }, { x: 1, y: 2 })).toEqual({ x: 4, y: 0 })
  })
})

describe('reflection', () => {
  const reflect = (line: Line, p: Pt) => at({ kind: 'reflection', line }, p)
  test('over the x-axis and the y-axis', () => {
    expect(reflect({ kind: 'horizontal', c: 0 }, { x: 2, y: 3 })).toEqual({ x: 2, y: -3 })
    expect(reflect({ kind: 'vertical', c: 0 }, { x: 2, y: 3 })).toEqual({ x: -2, y: 3 })
  })
  test('over x = c and y = c', () => {
    expect(reflect({ kind: 'vertical', c: 2 }, { x: 5, y: 1 })).toEqual({ x: -1, y: 1 })
    expect(reflect({ kind: 'horizontal', c: -1 }, { x: 5, y: 1 })).toEqual({ x: 5, y: -3 })
  })
  test('over y = x and y = −x', () => {
    expect(reflect({ kind: 'diagonal', slope: 1, b: 0 }, { x: 2, y: 5 })).toEqual({ x: 5, y: 2 })
    expect(reflect({ kind: 'diagonal', slope: -1, b: 0 }, { x: 2, y: 5 })).toEqual({ x: -5, y: -2 })
  })
  test('over y = x + b and y = −x + b', () => {
    expect(reflect({ kind: 'diagonal', slope: 1, b: 2 }, { x: 0, y: 0 })).toEqual({ x: -2, y: 2 })
    expect(reflect({ kind: 'diagonal', slope: -1, b: 4 }, { x: 0, y: 0 })).toEqual({ x: 4, y: 4 })
  })
  test('a point on the line stays put', () => {
    expect(reflect({ kind: 'diagonal', slope: 1, b: 1 }, { x: 2, y: 3 })).toEqual({ x: 2, y: 3 })
  })
})

describe('rotation', () => {
  const O = { x: 0, y: 0 }
  test('90° counterclockwise about the origin', () => {
    expect(at({ kind: 'rotation', degrees: 90, direction: 'ccw', center: O }, { x: 3, y: 1 })).toEqual({ x: -1, y: 3 })
  })
  test('90° clockwise about the origin', () => {
    expect(at({ kind: 'rotation', degrees: 90, direction: 'cw', center: O }, { x: 3, y: 1 })).toEqual({ x: 1, y: -3 })
  })
  test('180° is the same either way', () => {
    const p = { x: 3, y: 1 }
    expect(at({ kind: 'rotation', degrees: 180, direction: 'cw', center: O }, p)).toEqual({ x: -3, y: -1 })
    expect(at({ kind: 'rotation', degrees: 180, direction: 'ccw', center: O }, p)).toEqual({ x: -3, y: -1 })
  })
  test('270° clockwise is 90° counterclockwise', () => {
    const p = { x: 3, y: 1 }
    expect(at({ kind: 'rotation', degrees: 270, direction: 'cw', center: O }, p)).toEqual(at({ kind: 'rotation', degrees: 90, direction: 'ccw', center: O }, p))
  })
  test('about another center', () => {
    expect(at({ kind: 'rotation', degrees: 90, direction: 'ccw', center: { x: 1, y: 1 } }, { x: 3, y: 1 })).toEqual({ x: 1, y: 3 })
  })
  test('never leaves −0 or float noise', () => {
    const p = at({ kind: 'rotation', degrees: 180, direction: 'ccw', center: { x: 0.1, y: 0.2 } }, { x: 0.1, y: 0.2 })
    expect(Object.is(p.x, -0)).toBe(false)
    expect(p).toEqual({ x: 0.1, y: 0.2 })
  })
})

describe('dilation', () => {
  test('by a scale factor from the origin', () => {
    expect(at({ kind: 'dilation', factor: 2, center: { x: 0, y: 0 } }, { x: 1, y: -3 })).toEqual({ x: 2, y: -6 })
    expect(at({ kind: 'dilation', factor: 0.5, center: { x: 0, y: 0 } }, { x: -1, y: 3 })).toEqual({ x: -0.5, y: 1.5 })
  })
  test('from another center', () => {
    expect(at({ kind: 'dilation', factor: 3, center: { x: 1, y: 1 } }, { x: 2, y: 3 })).toEqual({ x: 4, y: 7 })
  })
  test('the center stays put', () => {
    expect(at({ kind: 'dilation', factor: 1 / 3, center: { x: 2, y: 2 } }, { x: 2, y: 2 })).toEqual({ x: 2, y: 2 })
  })
})

describe('composition', () => {
  test('each step acts on the image the step before made', () => {
    const images = imagesOf(tri, [
      { kind: 'dilation', factor: 0.5, center: { x: 0, y: 0 } },
      { kind: 'reflection', line: { kind: 'diagonal', slope: 1, b: 0 } },
    ])
    expect(images).toHaveLength(2)
    expect(images[0]).toEqual([{ x: 0.5, y: 1 }, { x: 2, y: 1 }, { x: 0.5, y: 3 }])
    expect(images[1]).toEqual([{ x: 1, y: 0.5 }, { x: 1, y: 2 }, { x: 3, y: 0.5 }])
  })
  test('no steps, no images', () => {
    expect(imagesOf(tri, [])).toEqual([])
  })
})

describe('the grid', () => {
  const box = { x0: -5, x1: 5, y0: -5, y1: 5 }
  test('finds points off the grid', () => {
    expect(offGrid([{ x: 5, y: -5 }, { x: 6, y: 0 }, { x: 0, y: -5.5 }], box)).toEqual([1, 2])
  })
  test('finds points between grid lines', () => {
    const axes = { x: { start: -5, step: 1 }, y: { start: -5, step: 0.5 } }
    expect(offLattice([{ x: 1, y: 1.5 }, { x: 0.5, y: 1 }, { x: 2, y: 1.25 }], axes)).toEqual([1, 2])
  })
  const grid = { x: { start: -10, step: 1, blocks: 20 }, y: { start: -10, step: 1, blocks: 20 } }
  test('finds points closer than a block to the edge, or past it', () => {
    expect(tooClose([{ x: 0, y: 0 }, { x: 9, y: -9 }, { x: -12, y: 10 }, { x: 3, y: 10 }], grid)).toEqual([2, 3])
  })
  test('a four-quadrant grid widens to the same distance from the origin every way, a block past every point', () => {
    // (−12, 10) needs the grid out to −13 on the left, so every side goes out to 13.
    expect(widenGrid(grid, [{ x: -12, y: 10 }, { x: 0, y: 0 }])).toEqual({ x: { from: -13, to: 13, step: 1 }, y: { from: -13, to: 13, step: 1 } })
  })
  test('a lopsided four-quadrant grid comes out even', () => {
    const lopsided = { x: { start: -13, step: 1, blocks: 23 }, y: { start: -10, step: 1, blocks: 20 } } // x −13 to 10, y −10 to 10
    expect(widenGrid(lopsided, [{ x: 4, y: 10 }])).toEqual({ x: { from: -13, to: 13, step: 1 }, y: { from: -13, to: 13, step: 1 } })
  })
  test('a grid off to one side of the origin grows the same number of blocks on every side, keeping each axis step', () => {
    const g = { x: { start: 0, step: 2, blocks: 5 }, y: { start: -5, step: 1, blocks: 10 } }
    // x: 11 is past 10, so 2 blocks of 2 make room with one to spare; every side then grows by 2 blocks.
    expect(widenGrid(g, [{ x: 11, y: 0 }])).toEqual({ x: { from: -4, to: 14, step: 2 }, y: { from: -7, to: 7, step: 1 } })
  })
  test('a point too far for 50 blocks makes the grid count by a bigger step', () => {
    const w = widenGrid(grid, [{ x: 0, y: 100 }])!
    expect(w.y.step).toBe(5)
    expect(w.y).toEqual({ from: -105, to: 105, step: 5 })
    expect((w.x.to - w.x.from) / w.x.step).toBeLessThanOrEqual(50)
  })
  test('a grid with room everywhere is left alone', () => {
    expect(widenGrid(grid, [{ x: -9, y: 9 }, { x: 9, y: -9 }])).toBeNull()
  })
})

describe('lines', () => {
  const steps = { x: 1, y: 1 }
  test('the axis or diagonal nearest a spot', () => {
    expect(nearestLine({ x: 0.3, y: 5 }, steps)).toEqual({ kind: 'vertical', c: 0 })
    expect(nearestLine({ x: -6, y: -0.4 }, steps)).toEqual({ kind: 'horizontal', c: 0 })
    expect(nearestLine({ x: 3, y: 3.6 }, steps)).toEqual({ kind: 'diagonal', slope: 1, b: 0 })
    expect(nearestLine({ x: -4, y: 3 }, steps)).toEqual({ kind: 'diagonal', slope: -1, b: 0 })
  })
  test('never offers any other line, however near', () => {
    // Right on x = 5, but that's set in the step's card: the grid offers the x-axis.
    expect(nearestLine({ x: 5, y: 1 }, steps)).toEqual({ kind: 'horizontal', c: 0 })
  })
  test('on a grid counting by 2 across, closeness is in blocks', () => {
    // 1.6 across is under a block from the y-axis (blocks are 2 wide); 1 up is a whole block from the x-axis.
    expect(nearestLine({ x: 1.6, y: 4 }, { x: 2, y: 1 })).toEqual({ kind: 'vertical', c: 0 })
  })
  test('are named the way a textbook writes them', () => {
    expect(lineName({ kind: 'horizontal', c: 0 })).toBe('the x-axis')
    expect(lineName({ kind: 'vertical', c: 0 })).toBe('the y-axis')
    expect(lineName({ kind: 'vertical', c: -2 })).toBe('x = −2')
    expect(lineName({ kind: 'horizontal', c: 1.5 })).toBe('y = 1.5')
    expect(lineName({ kind: 'diagonal', slope: 1, b: 0 })).toBe('y = x')
    expect(lineName({ kind: 'diagonal', slope: -1, b: 0 })).toBe('y = −x')
    expect(lineName({ kind: 'diagonal', slope: 1, b: -3 })).toBe('y = x − 3')
    expect(lineName({ kind: 'diagonal', slope: -1, b: 2 })).toBe('y = −x + 2')
  })
})

describe('rotation choices', () => {
  test('a quarter turn either way and a half turn about the center', () => {
    const c = { x: 1, y: -1 }
    expect(rotationChoices(c)).toEqual([
      { kind: 'rotation', degrees: 90, direction: 'ccw', center: c },
      { kind: 'rotation', degrees: 180, direction: 'ccw', center: c },
      { kind: 'rotation', degrees: 90, direction: 'cw', center: c },
    ])
  })
})

describe('describing a step', () => {
  test('in words', () => {
    expect(describeStep({ kind: 'translation', dx: 3, dy: -2 })).toBe('Translate ⟨3, −2⟩')
    expect(describeStep({ kind: 'reflection', line: { kind: 'diagonal', slope: 1, b: 0 } })).toBe('Reflect over y = x')
    expect(describeStep({ kind: 'rotation', degrees: 90, direction: 'cw', center: { x: 0, y: 0 } })).toBe('Rotate 90° clockwise about the origin')
    expect(describeStep({ kind: 'rotation', degrees: 180, direction: 'ccw', center: { x: 1, y: -2 } })).toBe('Rotate 180° about (1, −2)')
    expect(describeStep({ kind: 'dilation', factor: 0.5, center: { x: 0, y: 0 } })).toBe('Dilate by 1/2 from the origin')
    expect(describeStep({ kind: 'dilation', factor: 3, center: { x: 2, y: 1 } })).toBe('Dilate by 3 from (2, 1)')
  })
})

describe('point labels', () => {
  test('vertices are lettered in order', () => {
    expect([0, 1, 2, 9].map(vertexName)).toEqual(['A', 'B', 'C', 'J'])
  })
  test('each image adds a prime', () => {
    expect(primed('A', 0)).toBe('A')
    expect(primed('A', 1)).toBe('A′')
    expect(primed('A', 2)).toBe('A″')
    expect(primed('A', 3)).toBe('A‴')
    expect(primed('A', 4)).toBe('A′′′′')
  })
  test('a label that already has a prime gets more', () => {
    expect(primed('P′', 1)).toBe('P″')
    expect(primed('', 1)).toBe('')
  })
})
