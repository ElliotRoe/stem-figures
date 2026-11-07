// Every generator on the site. Their names, addresses and search words are
// in the STEM Figures catalog ($shared/catalog), with every other site's;
// here each gets the component drawing its directory preview. Page titles,
// the sitemap and the top bar read GENERATORS.

import type { Component } from 'svelte'
import { generatorsOn } from '$shared/catalog/index.js'
import { SITE_ID } from '$lib/site/config.js'
import AnglesPreview from './angles/Preview.svelte'
import BarGraphPreview from './bar-graph/Preview.svelte'
import TwoWayTablePreview from './two-way-table/Preview.svelte'
import BoxPlotPreview from './box-plot/Preview.svelte'
import CirclePreview from './circle/Preview.svelte'
import CumulativeFrequencyPreview from './cumulative-frequency/Preview.svelte'
import CompositeShapePreview from '$lib/editors/composite-shape/Preview.svelte'
import TransformationsPreview from '$lib/editors/transformations/Preview.svelte'
import ConePreview from './cone/Preview.svelte'
import CoordinateGridPreview from './coordinate-grid/Preview.svelte'
import CylinderPreview from './cylinder/Preview.svelte'
import HistogramPreview from './histogram/Preview.svelte'
import KitePreview from './kite/Preview.svelte'
import LengthReadingPreview from './length-reading/Preview.svelte'
import MappingDiagramPreview from './mapping-diagram/Preview.svelte'
import NumberLinePreview from './number-line/Preview.svelte'
import ParallelLinesPreview from './parallel-lines/Preview.svelte'
import ParallelogramPreview from './parallelogram/Preview.svelte'
import PieChartPreview from './pie-chart/Preview.svelte'
import PrismPreview from './prism/Preview.svelte'
import PyramidPreview from './pyramid/Preview.svelte'
import RectanglePreview from './rectangle/Preview.svelte'
import RegularPolygonPreview from './regular-polygon/Preview.svelte'
import SpherePreview from './sphere/Preview.svelte'
import StemAndLeafPreview from './stem-and-leaf/Preview.svelte'
import TrapezoidPreview from './trapezoid/Preview.svelte'
import TrianglePreview from './triangle/Preview.svelte'
import VennDiagramPreview from './venn-diagram/Preview.svelte'

/** Each generator's directory preview, by id. */
export const PREVIEWS: Record<string, Component> = {
  'coordinate-grid': CoordinateGridPreview,
  'number-line': NumberLinePreview,
  'triangle': TrianglePreview,
  'rectangle': RectanglePreview,
  'parallelogram': ParallelogramPreview,
  'trapezoid': TrapezoidPreview,
  'kite': KitePreview,
  'regular-polygon': RegularPolygonPreview,
  'angles': AnglesPreview,
  'parallel-lines': ParallelLinesPreview,
  'circle': CirclePreview,
  'prism': PrismPreview,
  'cylinder': CylinderPreview,
  'pyramid': PyramidPreview,
  'cone': ConePreview,
  'sphere': SpherePreview,
  'box-plot': BoxPlotPreview,
  'bar-graph': BarGraphPreview,
  'stem-and-leaf': StemAndLeafPreview,
  'cumulative-frequency': CumulativeFrequencyPreview,
  'two-way-table': TwoWayTablePreview,
  'histogram': HistogramPreview,
  'venn-diagram': VennDiagramPreview,
  'pie-chart': PieChartPreview,
  'mapping-diagram': MappingDiagramPreview,
  'length-reading': LengthReadingPreview,
  'composite-shape': CompositeShapePreview,
  transformations: TransformationsPreview,
}

export const GENERATORS = generatorsOn(SITE_ID, PREVIEWS)

export type Generator = (typeof GENERATORS)[number]

export const findGenerator = (path: string) => GENERATORS.find((g) => g.path === path)
