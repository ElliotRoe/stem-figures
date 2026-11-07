// The grid settings: every choice about a coordinate grid itself (each axis's
// range, numbering, label and end caps, the titles, minor gridlines and how the
// gridlines are drawn), shared by every Math page that draws one, so an option
// added here reaches them all (docs/adr/0003). What's drawn on the grid is each
// page's own; so are its starting values, passed in as `defaults`.
//
// Each axis's range is kept as the text the teacher typed ("-2", "2pi", "pi/4");
// readAxes() works out what it means.

import {
  CAP_KEYS, EVERY, LABEL_MODES, MINOR, TITLE_MODES, readAxes as readRanges, type GridSettings, type LabelMode, type NumberReader,
  type RangeSettings, type TitleMode,
} from '$shared/graph/axes'
import { CAPS, type Cap } from '$shared/graph/caps'
import { GRIDLINES, type Gridlines } from '$shared/graph/grid'
import { cleanLabelSize } from '$shared/labelSize'
import { parseNumber } from '$lib/shared/math.js'

/** Settings as they may arrive: from a form, a link, or a preset stored by an older version. */
export type RawSettings = Record<string, any>

export type GridOptions = RangeSettings & GridSettings & { gridlines: Gridlines }

/** The Coordinate Grid Generator's starting grid; other pages override what they start differently. */
export const GRID_DEFAULTS: GridOptions = {
  xFrom: '0',
  xTo: '15',
  xStep: '1',
  yFrom: '0',
  yTo: '15',
  yStep: '1',
  xEvery: 1,
  yEvery: 1,
  title: '',
  titleMode: 'none',
  xTitle: '', // runs along the axis, e.g. "Time (hours)"
  xTitleMode: 'none',
  yTitle: '',
  yTitleMode: 'none',
  xLabel: 'x', // sits at the arrow tip
  xLabelMode: 'text',
  yLabel: 'y',
  yLabelMode: 'text',
  xStartCap: 'triangle', // left end
  xEndCap: 'triangle', // right end
  yStartCap: 'triangle', // bottom end
  yEndCap: 'triangle', // top end
  minor: 0, // minor gridlines per block
  gridlines: 'standard', // light, standard, bold or none
  labelSize: 'medium', // how big the text is (see labelSize.ts)
}

export const GRID_KEYS = Object.keys(GRID_DEFAULTS) as (keyof GridOptions)[]

/** A page's starting grid: the generator's, with what this page starts differently. */
export const gridDefaults = (overrides: Partial<GridOptions> = {}): GridOptions => ({ ...GRID_DEFAULTS, ...overrides })

const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)
const text = (v: unknown, fallback: string) => (v === undefined || v === null ? fallback : String(v))
const titleMode = (v: any, fallback: TitleMode): TitleMode => (TITLE_MODES.includes(v) ? v : fallback)
const labelMode = (v: any, fallback: LabelMode): LabelMode => (LABEL_MODES.includes(v) ? v : fallback)
const cap = (v: any, fallback: Cap): Cap => (v in CAPS ? v : fallback)

/** A number as range text, the way the address writes it: "-2", "0.5". */
export const plain = (v: number) => String(Number(v.toFixed(10)))

/** Older links and presets: an axis label could be a blank line (now an axis
 *  title), arrows were one on/off switch for every end, and a range was a start
 *  and a number of blocks rather than From and To. */
export function upgradeGrid(s: RawSettings): RawSettings {
  const out = { ...s }
  for (const axis of ['x', 'y'] as const) {
    if (s[`${axis}LabelMode`] === 'blank') Object.assign(out, { [`${axis}LabelMode`]: 'none', [`${axis}TitleMode`]: 'blank' })
    const [blocks, start] = [s[`${axis}Blocks`], s[`${axis}Start`]]
    if (s[`${axis}From`] === undefined && (blocks !== undefined || start !== undefined)) {
      const step = parseNumber(String(s[`${axis}Step`] ?? 1)) ?? 1
      const from = num(start, 0)
      const to = from + Math.max(1, Math.round(num(blocks, 15))) * (step > 0 ? step : 1)
      Object.assign(out, { [`${axis}From`]: plain(from), [`${axis}To`]: plain(to), [`${axis}Step`]: plain(step > 0 ? step : 1) })
    }
    delete out[`${axis}Blocks`]
    delete out[`${axis}Start`]
  }
  if (s.arrows === false && CAP_KEYS.every((k) => s[k] === undefined)) for (const k of CAP_KEYS) out[k] = 'none'
  delete out.arrows
  delete out.light
  delete out.xNumbering // now follows how the range is typed
  delete out.yNumbering
  return out
}

/** The grid's own settings, tidied from raw values already through upgradeGrid(). */
export function cleanGrid(s: RawSettings, d: GridOptions): GridOptions {
  return {
    xFrom: text(s.xFrom, d.xFrom),
    xTo: text(s.xTo, d.xTo),
    xStep: text(s.xStep, d.xStep),
    yFrom: text(s.yFrom, d.yFrom),
    yTo: text(s.yTo, d.yTo),
    yStep: text(s.yStep, d.yStep),
    xEvery: EVERY.includes(Number(s.xEvery)) ? Number(s.xEvery) : d.xEvery,
    yEvery: EVERY.includes(Number(s.yEvery)) ? Number(s.yEvery) : d.yEvery,
    minor: MINOR.includes(Number(s.minor)) ? Number(s.minor) : d.minor,
    gridlines: s.gridlines in GRIDLINES ? s.gridlines : d.gridlines,
    labelSize: cleanLabelSize(s.labelSize),
    title: String(s.title ?? d.title),
    xTitle: String(s.xTitle ?? d.xTitle),
    yTitle: String(s.yTitle ?? d.yTitle),
    xLabel: String(s.xLabel ?? d.xLabel),
    yLabel: String(s.yLabel ?? d.yLabel),
    titleMode: titleMode(s.titleMode, d.titleMode),
    xTitleMode: titleMode(s.xTitleMode, d.xTitleMode),
    yTitleMode: titleMode(s.yTitleMode, d.yTitleMode),
    xLabelMode: labelMode(s.xLabelMode, d.xLabelMode),
    yLabelMode: labelMode(s.yLabelMode, d.yLabelMode),
    xStartCap: cap(s.xStartCap, d.xStartCap),
    xEndCap: cap(s.xEndCap, d.xEndCap),
    yStartCap: cap(s.yStartCap, d.yStartCap),
    yEndCap: cap(s.yEndCap, d.yEndCap),
  }
}

/** Every plain (non-list) setting that differs from its default, as address params, in the defaults' order. */
export function plainParams(s: Record<string, unknown>, defaults: Record<string, unknown>, params = new URLSearchParams()) {
  for (const [key, def] of Object.entries(defaults)) {
    const v = s[key]
    if (Array.isArray(def) || v === def || v === null || v === undefined) continue
    params.set(key, typeof v === 'boolean' ? (v ? '1' : '0') : String(v))
  }
  return params
}

/**
 * Raw settings read from a page address, ready for the page's clean-up: the
 * defaults, with every plain setting the address gives. A link from before
 * From/To keeps its start and blocks, for upgradeGrid() to turn into a range,
 * and one from before end caps keeps its arrows switch.
 */
export function rawFromParams(params: URLSearchParams, defaults: Record<string, unknown>): RawSettings {
  const s: RawSettings = structuredClone(defaults)
  if (params.get('arrows') === '0' && !CAP_KEYS.some((k) => params.has(k))) for (const k of CAP_KEYS) s[k] = 'none'
  for (const axis of ['x', 'y'] as const) {
    if (params.has(`${axis}From`) || !(params.has(`${axis}Blocks`) || params.has(`${axis}Start`))) continue
    delete s[`${axis}From`]
    delete s[`${axis}To`]
    for (const key of [`${axis}Blocks`, `${axis}Start`]) if (params.has(key)) s[key] = Number(params.get(key))
  }
  for (const [key, def] of Object.entries(defaults)) {
    if (Array.isArray(def) || !params.has(key)) continue
    const raw = params.get(key)
    if (typeof def === 'number') s[key] = Number(raw)
    else if (typeof def === 'boolean') s[key] = raw === '1'
    else s[key] = raw
  }
  return s
}

// Ranges are typed in Caret, so they can be fractions and multiples of π.
const MATH_NUMBERS: NumberReader = {
  parse: parseNumber,
  examples: { From: '−10, 2.5, 1/2 or −2π', To: '10, 2.5, 1/2 or 2π', Step: '1, 0.5, 1/4 or π/6' },
}

/** Each axis's range as numbers, how to write them, and anything the teacher should fix. */
export const readAxes = (s: RangeSettings) => readRanges(s, MATH_NUMBERS)
