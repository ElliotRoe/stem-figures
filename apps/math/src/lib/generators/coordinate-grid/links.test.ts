// Pins what links and stored presets read as, so moving the grid's own settings
// into $lib/grid can't change what an old link or preset brings back.
import { expect, test } from 'vitest'
import { DEFAULT_SETTINGS, cleanSettings, sameGraph, settingsFromParams, settingsToQuery } from './settings.js'

const LINKS = [
  '',
  'xFrom=-10&xTo=10&yFrom=-10&yTo=10',
  'xStart=-2&xBlocks=7&yStart=-1&yBlocks=14&yStep=0.5',
  'xBlocks=20',
  'arrows=0',
  'arrows=0&xEndCap=triangle',
  'xLabelMode=blank&yLabelMode=blank',
  'light=1&xNumbering=pi',
  'xFrom=0&xTo=2pi&xStep=pi%2F4&angle=degrees',
  'title=Hi&titleMode=text&xTitle=Time&xTitleMode=blank&yTitleMode=text&yTitle=km',
  'xEvery=5&yEvery=0&minor=4&gridlines=bold&labelSize=large',
  'xEvery=3&minor=7&gridlines=dark&titleMode=wat&xStartCap=moon',
  'xLabel=t&yLabelMode=none&xStartCap=circle&yEndCap=line',
  'eq=y%3D2x%2B1&eq=(1%2C2)|color=red',
]

test.each(LINKS)('link %j reads the same', (q) => {
  const s = settingsFromParams(new URLSearchParams(q))
  expect({ settings: s, query: settingsToQuery(s) }).toMatchSnapshot()
})

const PRESETS: Record<string, unknown>[] = [
  {},
  { xBlocks: 20, xStart: -10, xStep: 1, arrows: false },
  { ...DEFAULT_SETTINGS, xFrom: undefined, yLabelMode: 'blank', minor: '2', xEvery: '5', gridlines: 'nope', angle: 'degrees' },
  { xFrom: -3, xTo: 3, title: null, labelSize: 'huge', equations: [{ text: 'y=x' }] },
]

test.each(PRESETS)('preset %# cleans the same', (p) => {
  expect(cleanSettings(p)).toMatchSnapshot()
})

test('sameGraph', () => {
  const pairs: [Record<string, unknown>, Record<string, unknown>][] = [
    [{}, { ...DEFAULT_SETTINGS }],
    [{}, { xTo: '14' }],
    [{ labelSize: 'large' }, {}],
    [{ xBlocks: 20, xStart: -10 }, { xFrom: '-10', xTo: '10' }],
  ]
  expect(pairs.map(([a, b]) => sameGraph(a, b))).toMatchSnapshot()
})
