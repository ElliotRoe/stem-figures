// Every choice the teacher makes, with its default. The page address carries
// any non-default values so a graph can be bookmarked or shared. The grid's own
// settings are $lib/grid's, shared with every page that draws a coordinate
// grid; what's graphed on it (and the angle unit trig reads) is this generator's.

import { EVERY, LABEL_MODES, MINOR, TITLE_MODES, type Axis, type AxisName, type LabelMode, type TitleMode } from '$shared/graph/axes'
import { CAPS } from '$shared/graph/caps'
import { fmt } from '$shared/graph/numbering'
import { GRID_DEFAULTS, cleanGrid, plainParams, rawFromParams, readAxes, upgradeGrid, type GridOptions, type RawSettings } from '$lib/grid/settings.js'
import { cleanRow, rowFromParam, rowToParam, type Row } from './equations.js'
import type { AngleUnit } from './evaluate.js'

export { CAPS, EVERY, MINOR, TITLE_MODES, LABEL_MODES, fmt, readAxes }
export type { Axis, AxisName, TitleMode, LabelMode, RawSettings }

export const ANGLE_UNITS = { radians: 'Radians', degrees: 'Degrees' } // what trig functions read x in

export type Settings = GridOptions & {
  angle: AngleUnit
  equations: Row[]
}

const { labelSize, ...grid } = GRID_DEFAULTS
export const DEFAULT_SETTINGS: Settings = {
  ...grid,
  angle: 'radians', // the angle unit: whether sin x reads x in radians or degrees
  labelSize,
  equations: [], // what's graphed, one row each: { text: "y=2x+1", color, line, arrows }
}

/** Settings that describe the graph itself, which is what a preset saves. */
export const GRAPH_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]

/** Tidy raw values (from a form, a link or a stored preset) into usable settings. */
export function cleanSettings(s: RawSettings): Settings {
  s = upgradeGrid(s)
  const d = DEFAULT_SETTINGS
  return {
    ...d,
    ...s,
    ...cleanGrid(s, d),
    angle: s.angle in ANGLE_UNITS ? s.angle : d.angle,
    equations: Array.isArray(s.equations) ? s.equations.map(cleanRow) : [],
  }
}

/** Do two settings draw the same graph? */
export function sameGraph(a: RawSettings, b: RawSettings): boolean {
  const ca = cleanSettings(a)
  const cb = cleanSettings(b)
  const rows = (c: Settings) => c.equations.filter((r) => r.text.trim()).map(rowToParam).join('\n')
  return GRAPH_KEYS.every((k) => (k === 'equations' ? rows(ca) === rows(cb) : ca[k] === cb[k]))
}

export function settingsToQuery(s: Settings): string {
  const params = plainParams(s, DEFAULT_SETTINGS)
  // One eq= per row that has something in it.
  for (const r of s.equations ?? []) if (r.text.trim()) params.append('eq', rowToParam(r))
  return params.toString()
}

export function settingsFromParams(params: URLSearchParams): Settings {
  const s = rawFromParams(params, DEFAULT_SETTINGS)
  s.equations = params.getAll('eq').map(rowFromParam)
  return cleanSettings(s)
}
