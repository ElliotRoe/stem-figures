<script lang="ts">
  // The Transformations Editor. It has as many settings as a generator, so
  // it's laid out like one, under the site's top bar: settings down the left, the figure card filling the rest. The teacher clicks a
  // preimage out on the coordinate grid (one point, a path, or a polygon,
  // closed by clicking its first point again), then
  // adds transformations one after another, each acting on the image the one
  // before made. Each is placed on the grid with a preview: a translation
  // where the pointer is, a reflection over the axis or diagonal nearest it
  // (any other line is set in its card), a rotation
  // about the center clicked (then whichever of its three turns is picked),
  // a dilation from the center clicked. Its numbers can then be typed or
  // dragged. The grid has the same settings as the Coordinate Grid
  // Generator's ($lib/grid) and always fits the card; clicks snap to where
  // grid lines cross. Every part can be hidden, so one figure makes the
  // version students transform, the version where they name the
  // transformation, and the answer key.
  // Like every editor, the drawing is kept in this browser rather than the
  // page address, so there's no link to share; it has undo and redo of its own.
  import { Expand, Plus, RotateCcw, Settings2, Trash2 } from '@lucide/svelte'
  import { onMount } from 'svelte'
  import { CELL, clipPath, pathOf } from '$shared/graph/grid'
  import { COLORS } from '$shared/graph/colors'
  import FigureCanvas from '$shared/FigureCanvas.svelte'
  import GridSettingsPanel from '$lib/grid/GridSettingsPanel.svelte'
  import { plain } from '$lib/grid/settings.js'
  import Figure from './Figure.svelte'
  import LookFields from './LookFields.svelte'
  import NumberField from './NumberField.svelte'
  import StepCard from './StepCard.svelte'
  import {
    INKS, MAX_VERTICES, STEP_KINDS, VERSIONS, emptyDrawing, hasPreimage, imageLook, newStep, starterDrawing, tidyDrawing, versionOf, withInk, withoutSide, withoutVertex, type Drawing, type Ink, type Show,
    type StepKind, type Version,
  } from './drawing.js'
  import { buildFigure, shapesOf } from './figure.js'
  import {
    COMMON_LINES, apply, describeStep, lineName, nearestLine, offGrid, rotationChoices, tooClose, vertexName, widenGrid,
    type Line, type Pt, type Step,
  } from './transform.js'

  const NAME = 'Transformations Editor'
  const STORAGE_KEY = 'math-transformations'
  const HISTORY_LIMIT = 100

  let d = $state<Drawing>(emptyDrawing())
  let loaded = false
  let svg = $state<SVGSVGElement>()

  const f = $derived(buildFigure(d))
  const shapes = $derived(shapesOf(d))
  const done = $derived(hasPreimage(d))
  const empty = $derived(!d.vertices.length)

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      d = saved ? tidyDrawing(saved) : starterDrawing()
    } catch {
      /* nothing saved, or storage blocked */
    }
    current = JSON.stringify(d)
    loaded = true
  })

  // Kept in this browser after every change.
  $effect(() => {
    const data = live
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, data)
    } catch {
      /* storage blocked or full: the drawing lasts until the page closes */
    }
  })

  // ----- History: a change is recorded once the drawing has been still for a
  // moment (so typing a label is one step), or when a drag ends.

  let past = $state.raw<string[]>([])
  let future = $state.raw<string[]>([])
  let current = ''
  let holding = $state(false)
  const live = $derived(JSON.stringify(d))
  let timer: ReturnType<typeof setTimeout> | undefined

  function record() {
    clearTimeout(timer)
    if (!loaded || live === current) return
    past = [...past, current].slice(-HISTORY_LIMIT)
    future = []
    current = live
  }
  $effect(() => {
    live
    if (holding) return
    clearTimeout(timer)
    timer = setTimeout(record, 400)
    return () => clearTimeout(timer)
  })
  /** Before a change that should be a step of its own: whatever was being typed becomes one first. */
  const act = () => record()
  /** A drag (on the grid, or across a number) is one step: nothing is recorded until it ends. */
  function hold(on: boolean) {
    if (on) record()
    holding = on
    if (!on) record()
  }
  function go(to: string) {
    current = to
    d = tidyDrawing(JSON.parse(to))
    placing = null
    selected = null
  }
  function undo() {
    record()
    if (!past.length) return
    future = [current, ...future]
    go(past.at(-1)!)
    past = past.slice(0, -1)
  }
  function redo() {
    record()
    if (!future.length) return
    past = [...past, current]
    go(future[0])
    future = future.slice(1)
  }
  /** For the figure card's undo and redo buttons, and Cmd/Ctrl+Z outside text boxes (they keep their own undo). */
  const history = {
    get canUndo() {
      return past.length > 0 || live !== current
    },
    get canRedo() {
      return future.length > 0
    },
    undo,
    redo,
    onkeydown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      const target = event.target as Element | null
      if (target?.matches?.('input[type=text], textarea') && !target.closest('.caret-field')) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) undo()
      else if ((key === 'z' && event.shiftKey) || key === 'y') redo()
      else return
      event.preventDefault()
    },
  }

  // ----- The preimage

  function addVertex(p: Pt) {
    if (d.closed || d.vertices.length >= MAX_VERTICES) return
    d.vertices.push(p)
    d.names.push(vertexName(d.vertices.length - 1))
  }
  function removeVertex(i: number) {
    act()
    d.vertices.splice(i, 1)
    d.names.splice(i, 1)
    if (d.vertices.length < 3) d.closed = false
  }
  /** A typed vertex goes one block right of the last one. */
  function typeVertex() {
    act()
    const last = d.vertices.at(-1)
    addVertex(last ? { x: last.x + f.axes.x.step, y: last.y } : { x: 0, y: 0 })
  }
  const canClose = $derived(!d.closed && d.vertices.length >= 3)
  function setClosed(closed: boolean) {
    act()
    d.closed = closed && d.vertices.length >= 3
  }
  function clearPreimage() {
    act()
    d.vertices = []
    d.names = []
    d.closed = false
    d.moved = {}
    placing = null
    selected = null
  }

  // ----- Transformations, placed on the grid

  let addOpen = $state(false)
  /** A transformation being placed: a new one, or one already in the list (`replace`), and a rotation's center once clicked. */
  let placing = $state<{ kind: StepKind; replace: string | null; center?: Pt } | null>(null)

  function startPlacing(kind: StepKind, replace: string | null = null) {
    if (!done) return
    addOpen = false
    placing = placing && placing.replace === replace && placing.kind === kind ? null : { kind, replace }
  }
  /** Back to a blank grid with every setting as it starts: preimage, transformations, grid, what shows and color. */
  function resetAll() {
    act()
    d = emptyDrawing()
    placing = null
    selected = null
    addOpen = false
  }
  /** Every transformation gone, leaving the preimage. */
  function clearSteps() {
    act()
    d.steps = []
    placing = null
  }
  function removeStep(i: number) {
    act()
    const id = d.steps[i].id
    d.steps.splice(i, 1)
    if (placing?.replace === id) placing = null
  }

  /** The figure the transformation being placed acts on: the preimage, or the image before it. */
  const base = $derived.by(() => {
    if (!placing) return null
    const i = placing.replace ? d.steps.findIndex((s) => s.id === placing!.replace) : d.steps.length
    return i >= 0 ? (shapes[i] ?? null) : null
  })
  const replacing = $derived(placing?.replace ? (d.steps.find((s) => s.id === placing!.replace) ?? null) : null)
  const placingLook = $derived(replacing?.look ?? imageLook(d.steps.length, d.ink))

  /** Where the pointer is over the grid, in the axes' numbers, and the grid point nearest it. */
  let at = $state<Pt | null>(null)
  let hover = $state<Pt | null>(null)

  /** A rotation's three turns about its center, once that's clicked. */
  const turns = $derived(placing?.kind === 'rotation' && placing.center ? rotationChoices(placing.center) : [])
  /** The transformation a click would place now, with the pointer where it is. */
  const candidate = $derived.by((): Step | null => {
    if (!placing || !base?.pts.length) return null
    const step = replacing?.step
    switch (placing.kind) {
      case 'translation':
        return hover ? { kind: 'translation', dx: hover.x - base.pts[0].x, dy: hover.y - base.pts[0].y } : null
      case 'reflection':
        return at ? { kind: 'reflection', line: nearestLine(at, { x: f.axes.x.step, y: f.axes.y.step }) } : null
      case 'dilation':
        return hover ? { kind: 'dilation', factor: step?.kind === 'dilation' ? step.factor : 2, center: hover } : null
      case 'rotation': {
        if (!turns.length || !at) return null
        // The turn whose image's middle is nearest the pointer.
        const middle = (pts: Pt[]) => pts.reduce((m, p) => ({ x: m.x + p.x / pts.length, y: m.y + p.y / pts.length }), { x: 0, y: 0 })
        const dist = (s: Step) => {
          const m = middle(base.pts.map((p) => apply(s, p)))
          return Math.hypot(m.x - at!.x, m.y - at!.y)
        }
        return turns.reduce((best, s) => (dist(s) < dist(best) ? s : best))
      }
    }
  })

  function place(p: Pt | null) {
    if (!placing || !base) return
    if (placing.kind === 'rotation' && !placing.center) {
      if (p) placing = { ...placing, center: p }
      return
    }
    const step = candidate
    if (!step) return
    act()
    if (replacing) replacing.step = step
    else d.steps.push(newStep(step, d.steps.length, d.ink))
    placing = null
  }

  /** Whether any figure has a point off the grid (red), or only at its edge where labels get cut off (yellow), for the widen button's dot. */
  const gridAlert = $derived.by((): 'off' | 'edge' | null => {
    const pts = shapes.flatMap((s) => s.pts)
    if (offGrid(pts, f.box).length) return 'off'
    return tooClose(pts, f.axes).length ? 'edge' : null
  })
  const canWiden = $derived(!!widenGrid(f.axes, shapes.flatMap((s) => s.pts)))

  /** Widen the grid the same number of blocks on every side, so every figure is a block clear of every edge. */
  function widen() {
    const wider = widenGrid(f.axes, shapes.flatMap((s) => s.pts))
    if (!wider) return
    act()
    Object.assign(d.grid, {
      xFrom: plain(wider.x.from), xTo: plain(wider.x.to), xStep: plain(wider.x.step),
      yFrom: plain(wider.y.from), yTo: plain(wider.y.to), yStep: plain(wider.y.step),
    })
  }

  // ----- The grid: clicks snap to where grid lines cross

  /** A spot on the screen, in the figure's own units. */
  function toFigure(e: PointerEvent): { x: number; y: number } | null {
    const m = svg?.getScreenCTM()
    if (!m) return null
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return { x: p.x, y: p.y }
  }
  /** A spot on the figure in the axes' numbers, or null well off the grid. */
  function toGraph(spot: { x: number; y: number } | null): Pt | null {
    if (!spot) return null
    const { x, y } = f.axes
    const i = (spot.x - f.grid.x) / CELL
    const j = (f.grid.y + f.grid.h - spot.y) / CELL
    if (i < -0.5 || i > x.blocks + 0.5 || j < -0.5 || j > y.blocks + 0.5) return null
    return { x: x.start + i * x.step, y: y.start + j * y.step }
  }
  /** The grid point nearest a spot on the figure, or null off the grid. */
  function snap(spot: { x: number; y: number } | null): Pt | null {
    if (!spot) return null
    const { x, y } = f.axes
    const i = Math.round((spot.x - f.grid.x) / CELL)
    const j = Math.round((f.grid.y + f.grid.h - spot.y) / CELL)
    if (i < 0 || i > x.blocks || j < 0 || j > y.blocks) return null
    return { x: Number((x.start + i * x.step).toFixed(9)), y: Number((y.start + j * y.step).toFixed(9)) }
  }

  /** A vertex or side of the preimage, picked on the grid to delete. */
  let selected = $state<{ kind: 'vertex' | 'side'; i: number } | null>(null)
  function deleteSelected() {
    if (!selected) return
    act()
    const o = selected.kind === 'vertex' ? withoutVertex(d, selected.i) : withoutSide(d, selected.i)
    Object.assign(d, o)
    // Its labels' places were by vertex, which have moved.
    d.moved = {}
    selected = null
  }

  /** A preimage vertex or a point label being dragged. */
  let drag = $state.raw<
    | { kind: 'vertex'; i: number; pointerId: number; moved: boolean }
    | { kind: 'label'; key: string; pointerId: number; start: { x: number; y: number }; from: { dx: number; dy: number } }
    | null
  >(null)

  /** Whether a click on the grid adds a vertex: until the preimage is closed or has as many as it can. */
  const drawing = $derived(!placing && !d.closed && d.vertices.length < MAX_VERTICES)
  const clicking = $derived(!!placing || drawing)

  function pointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    // Out of any settings box, so Cmd/Ctrl+Z undoes what's done on the grid rather than the box's typing.
    const focused = document.activeElement as HTMLElement | null
    if (focused?.closest?.('.settings-side')) focused.blur()
    const target = e.target as Element
    const spot = toFigure(e)
    if (placing) {
      place(snap(spot))
      return
    }
    const label = target.closest('[data-label]')?.getAttribute('data-label')
    const vertex = target.closest('[data-vertex]')?.getAttribute('data-vertex')
    const side = target.closest('[data-side]')?.getAttribute('data-side')
    if (side !== null && side !== undefined && !label && (vertex === null || vertex === undefined)) {
      selected = { kind: 'side', i: Number(side) }
      return
    }
    if (label && spot) {
      drag = { kind: 'label', key: label, pointerId: e.pointerId, start: spot, from: d.moved[label] ?? { dx: 0, dy: 0 } }
    } else if (vertex !== null && vertex !== undefined) {
      const i = Number(vertex)
      // Clicking the first vertex again closes the path into a polygon.
      if (canClose && i === 0) {
        setClosed(true)
        return
      }
      drag = { kind: 'vertex', i, pointerId: e.pointerId, moved: false }
    } else {
      selected = null
      const p = snap(spot)
      if (p && drawing) {
        act()
        addVertex(p)
      }
      return
    }
    hold(true)
    svg?.setPointerCapture(e.pointerId)
    e.preventDefault()
  }
  function pointerMove(e: PointerEvent) {
    const spot = toFigure(e)
    at = clicking ? toGraph(spot) : null
    hover = clicking ? snap(spot) : null
    if (!drag || e.pointerId !== drag.pointerId || !spot) return
    if (drag.kind === 'label') {
      d.moved[drag.key] = { dx: Math.round(drag.from.dx + spot.x - drag.start.x), dy: Math.round(drag.from.dy + spot.y - drag.start.y) }
    } else {
      const p = snap(spot)
      const was = d.vertices[drag.i]
      if (p && was && (p.x !== was.x || p.y !== was.y)) {
        d.vertices[drag.i] = p
        if (!drag.moved) drag = { ...drag, moved: true }
      }
    }
  }
  function pointerUp(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.pointerId) return
    // A vertex pressed and let go without moving is picked, to delete.
    if (drag.kind === 'vertex' && !drag.moved) selected = { kind: 'vertex', i: drag.i }
    drag = null
    hold(false)
  }

  // ----- Keys (undo and redo are the figure card's)

  function keydown(event: KeyboardEvent) {
    const target = event.target as Element | null
    if (target?.closest?.('input, textarea, select, .caret-field, [contenteditable]') || event.metaKey || event.ctrlKey) return
    if (event.key === 'Escape') {
      selected = null
      placing = null
      addOpen = false
      showOpen = false
    } else if (event.key === 'Enter' && canClose) {
      event.preventDefault()
      setClosed(true)
    } else if ((event.key === 'Backspace' || event.key === 'Delete') && selected) {
      event.preventDefault()
      deleteSelected()
    } else if ((event.key === 'Backspace' || event.key === 'Delete') && !d.closed && d.vertices.length) {
      event.preventDefault()
      removeVertex(d.vertices.length - 1)
    }
  }

  // What a transformation being placed asks for, in its row in the step list.
  const firstName = $derived(base?.names[0] || 'the first vertex')
  const prompt = $derived(
    placing?.kind === 'translation' ? `click where ${firstName} goes.`
    : placing?.kind === 'reflection' ? 'click an axis or a diagonal.'
    : placing?.kind === 'rotation' ? (placing.center ? 'click the turn you want.' : 'click the center.')
    : placing?.kind === 'dilation' ? 'click the center.'
    : '',
  )

  const SHOW_NAMES: [keyof Show, string][] = [
    ['preimage', 'Preimage'], ['images', 'Images'], ['between', 'In-between images'], ['lines', 'Lines of reflection'], ['centers', 'Centers'],
    ['arrows', 'Translation arrows'], ['labels', 'Point labels'], ['coords', 'Coordinates'],
  ]
  const hasKind = (kinds: string[]) => d.steps.some((s) => kinds.includes(s.step.kind))

  // The three versions, each with a little picture of what it shows, and the full list of what shows behind the gear.
  const version = $derived(versionOf(d.show))
  let showOpen = $state(false)
  let showButton = $state<HTMLButtonElement>()
  let showPanel = $state<HTMLElement>()
  function closeShow(e: PointerEvent) {
    if (showOpen && !showPanel?.contains(e.target as Node) && !showButton?.contains(e.target as Node)) showOpen = false
  }

  // ----- Previews while placing

  /** A figure's outline on the drawing, closed for a polygon. */
  const outline = (pts: Pt[]) => (pts.length > 1 ? pathOf(pts.map(f.px)) + (d.closed ? 'Z' : '') : '')
  /** A line of reflection across the grid, on the drawing. */
  function across(line: Line) {
    const { x0, x1, y0, y1 } = f.box
    const far = (x1 - x0 + y1 - y0) * 2
    const ends: Pt[] =
      line.kind === 'vertical' ? [{ x: line.c, y: y0 - far }, { x: line.c, y: y1 + far }]
      : line.kind === 'horizontal' ? [{ x: x0 - far, y: line.c }, { x: x1 + far, y: line.c }]
      : [{ x: x0 - far, y: line.slope * (x0 - far) + line.b }, { x: x1 + far, y: line.slope * (x1 + far) + line.b }]
    const [run] = clipPath(ends, f.box)
    return run ? pathOf(run.map(f.px)) : ''
  }
  const ghost = $derived(candidate && base ? base.pts.map((p) => apply(candidate, p)) : null)
  const ghostInk = $derived(COLORS[placingLook.color])
</script>

<svelte:window onkeydown={keydown} onpointerdown={closeShow} />

{#snippet versionIcon(key: Version)}
  <!-- A tiny grid with a triangle at the top left: Student adds the line to reflect it over, Question the image, Answer key both. -->
  <svg class="icon" class:bw={d.ink === 'bw'} viewBox="0 0 48 36" aria-hidden="true">
    {#each [8, 16, 32, 40] as x}<line x1={x} y1="2" x2={x} y2="34" class="cell" />{/each}
    {#each [10, 26] as y}<line x1="2" y1={y} x2="46" y2={y} class="cell" />{/each}
    <line x1="2" y1="18" x2="46" y2="18" class="axis" />
    <path d="M6,5 L18,5 L6,15 Z" class="pre" />
    {#if key !== 'question'}<line x1="24" y1="1" x2="24" y2="35" class="mirror" />{:else}<line x1="24" y1="2" x2="24" y2="34" class="axis" />{/if}
    {#if key !== 'student'}<path d="M42,5 L30,5 L42,15 Z" class="img" />{/if}
  </svg>
{/snippet}

<div class="generator">
  <div class="figure-side">
    <FigureCanvas {svg} filename="transformations" {history} share={false} bind:labelSize={d.grid.labelSize}>
      {#snippet tools()}
        <button class="icon-btn widen" aria-label="Widen the grid" disabled={!canWiden} onclick={widen}
          data-tip={gridAlert === 'off' ? 'Widen the grid: a point is off it' : gridAlert === 'edge' ? 'Widen the grid: a point is at its edge' : 'Widen the grid'}>
          <Expand size={19} />
          {#if gridAlert}<span class="dot {gridAlert}" aria-hidden="true"></span>{/if}
        </button>
        {#if selected}
          <button class="icon-btn" aria-label="Delete the selected {selected.kind}" data-tip="Delete the selected {selected.kind}" onclick={deleteSelected}><Trash2 size={19} /></button>
        {/if}
      {/snippet}
      {#snippet end()}
        <button type="button" class="reset" aria-label="Reset everything" data-tip="Reset all" onclick={resetAll}>Reset</button>
      {/snippet}
      <div
        class="board" class:clicking class:dragging={!!drag} role="application"
        aria-label="Coordinate grid. {d.steps.map((s) => describeStep(s.step)).join('. ')}"
        onpointerdown={pointerDown} onpointermove={pointerMove} onpointerup={pointerUp} onpointercancel={pointerUp}
        onpointerleave={() => ((hover = null), (at = null))}
      >
        <Figure {f} settings={d.grid} bind:svg label={d.grid.title || 'Transformations on a coordinate grid'}>
          {#snippet overlay()}
            <g data-no-export>
              {#if placing?.kind === 'reflection'}
                <!-- The axes and diagonals, faintly, and the one nearest the pointer, strongly; any other line is set in the step's card. -->
                {#each COMMON_LINES as line}<path d={across(line)} class="option-line" />{/each}
                {#if candidate?.kind === 'reflection'}
                  <path d={across(candidate.line)} stroke={ghostInk} class="chosen-line" />
                {/if}
              {/if}
              {#each turns as turn}
                {@const pts = base?.pts.map((p) => apply(turn, p)) ?? []}
                <path d={outline(pts)} fill={ghostInk} fill-opacity="0.05" stroke={ghostInk} class="ghost-faint" />
              {/each}
              {#if ghost}
                <path d={outline(ghost)} fill={ghostInk} fill-opacity="0.08" stroke={ghostInk} class="ghost-shape" />
                {#each ghost as p}{@const q = f.px(p)}<circle cx={q.x} cy={q.y} r="4" fill={ghostInk} opacity="0.7" />{/each}
                {#if candidate?.kind === 'translation' && base}
                  {@const a = f.px(base.pts[0])}
                  {@const b = f.px(ghost[0])}
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ghostInk} class="ghost-line" />
                {/if}
              {/if}
              {#if placing?.center}
                {@const c = f.px(placing.center)}
                <circle cx={c.x} cy={c.y} r="6" class="picked" />
              {/if}
              {#if drawing && hover && d.vertices.length}
                {@const a = f.px(d.vertices.at(-1)!)}
                {@const b = f.px(hover)}
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2563eb" class="ghost-line" />
              {/if}
              {#if hover && clicking && placing?.kind !== 'reflection' && !(placing?.kind === 'rotation' && placing.center)}
                {@const p = f.px(hover)}
                <circle cx={p.x} cy={p.y} r="6" class="ghost" />
              {/if}
              {#if candidate?.kind === 'reflection' && at}
                {@const p = f.px(at)}
                <text x={p.x + 12} y={p.y - 12} fill={ghostInk} class="line-name">{lineName(candidate.line)}</text>
              {/if}
              {#if !placing && d.vertices.length > 1}
                <!-- Each side of the preimage, to pick and delete. -->
                {#each d.vertices.slice(0, d.closed ? undefined : -1) as v, i}
                  {@const a = f.px(v)}
                  {@const b = f.px(d.vertices[(i + 1) % d.vertices.length])}
                  {#if selected?.kind === 'side' && selected.i === i}<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="picked-side" />{/if}
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="side-hit" data-side={i}><title>Click to pick this side, then Delete</title></line>
                {/each}
              {/if}
              {#if selected?.kind === 'vertex' && d.vertices[selected.i]}
                {@const p = f.px(d.vertices[selected.i])}
                <circle cx={p.x} cy={p.y} r="10" class="picked-vertex" />
              {/if}
              {#if !placing}
                {#each d.vertices as v, i}
                  {@const p = f.px(v)}
                  {@const closer = canClose && i === 0}
                  <circle cx={p.x} cy={p.y} r="11" class="handle" class:closer data-vertex={i}>
                    <title>{closer ? 'Close the polygon' : `Drag ${d.names[i] || 'this vertex'}, or click it then Delete`}</title>
                  </circle>
                {/each}
              {/if}
            </g>
          {/snippet}
        </Figure>
      </div>
    </FigureCanvas>
  </div>

  <aside class="settings-side no-print">
    <!-- The top bar shows the name; this keeps the page's heading for screen readers. -->
    <h1 class="visually-hidden">{NAME}</h1>
    <section class="card pad show-card">
      <div class="card-top">
        <h2 class="card-head">Show</h2>
        <button bind:this={showButton} type="button" class="icon-btn" class:on={showOpen} aria-label="Choose exactly what shows" aria-expanded={showOpen}
          data-tip="Choose exactly what shows" onclick={() => (showOpen = !showOpen)}><Settings2 size={18} /></button>
      </div>
      <div class="versions" role="radiogroup" aria-label="Version">
        {#each Object.entries(VERSIONS) as [key, v] (key)}
          <button type="button" role="radio" class="version" class:on={version === key} aria-checked={version === key} title={v.hint}
            onclick={() => { act(); d.show = { ...d.show, ...v.show } }}>
            {@render versionIcon(key as Version)}
            <span class="version-name">{v.name}</span>
          </button>
        {/each}
      </div>
      <div class="segmented" role="radiogroup" aria-label="Color or black and white">
        {#each Object.entries(INKS) as [k, label]}
          <button type="button" role="radio" aria-checked={d.ink === k} class:on={d.ink === k}
            title={k === 'bw' ? 'Every figure in black, told apart by dashed and dotted lines, for a black-and-white copier' : 'Each image in its own color'}
            onclick={() => { if (d.ink === k) return; act(); d = withInk(d, k as Ink) }}>{label}</button>
        {/each}
      </div>
      {#if showOpen}
        <div bind:this={showPanel} class="show-panel" role="dialog" aria-label="What shows">
          {#each SHOW_NAMES as [key, label]}
            {@const relevant =
              key === 'images' ? d.steps.length > 0
              : key === 'between' ? d.steps.length > 1
              : key === 'lines' ? hasKind(['reflection'])
              : key === 'centers' ? hasKind(['rotation', 'dilation'])
              : key === 'arrows' ? hasKind(['translation'])
              : true}
            {#if relevant}
              <label class="check"><input type="checkbox" checked={d.show[key]} onchange={(e) => { act(); d.show[key] = e.currentTarget.checked }} /> {label}</label>
            {/if}
          {/each}
        </div>
      {/if}
    </section>
    <section class="card pad">
      <div class="card-top">
        <h2 class="card-head">Preimage</h2>
        <button class="icon-btn" aria-label="Start the preimage over" data-tip="Start over" disabled={empty} onclick={clearPreimage}><RotateCcw size={17} /></button>
      </div>
      {#if d.vertices.length}
        <ol class="vertices">
          {#each d.vertices as v, i}
            <li>
              <input class="name" aria-label="Label of vertex {i + 1}" maxlength="4" bind:value={d.names[i]} />
              <span>(</span>
              <NumberField onhold={hold} label="Vertex {i + 1} x" value={v.x} onchange={(x) => (d.vertices[i] = { ...d.vertices[i], x })} />
              <span>,</span>
              <NumberField onhold={hold} label="Vertex {i + 1} y" value={v.y} onchange={(y) => (d.vertices[i] = { ...d.vertices[i], y })} />
              <span>)</span>
              <button class="icon-btn" aria-label="Remove vertex {i + 1}" data-tip="Remove" onclick={() => removeVertex(i)}><Trash2 size={16} /></button>
            </li>
          {/each}
        </ol>
      {:else}
        <p class="help">Click grid points on the figure, or type them: one for a point, more for a path, then the first again for a polygon.</p>
      {/if}
      <div class="buttons">
        {#if !d.closed && d.vertices.length < MAX_VERTICES}
          <button type="button" class="add" onclick={typeVertex}><Plus size={15} aria-hidden="true" /> Type a point</button>
        {/if}
        {#if canClose}
          <button type="button" class="add" onclick={() => setClosed(true)}>Close the polygon</button>
        {/if}
      </div>
      <hr />
      <LookFields bind:look={d.look} id="preimage-look" {act} />
    </section>

    <section class="card pad">
      <div class="card-top">
        <h2 class="card-head">Transformations</h2>
        <button class="icon-btn" aria-label="Remove every transformation" data-tip="Start over" disabled={!d.steps.length} onclick={clearSteps}><RotateCcw size={17} /></button>
      </div>
      {#if !done}
        <p class="help">Draw the preimage first, then transform it.</p>
      {/if}
      {#if d.steps.length}
        <ol class="steps">
          {#each d.steps as entry, i (entry.id)}
            <StepCard
              bind:entry={d.steps[i]} index={i}
              placing={placing?.replace === entry.id}
              onplace={() => startPlacing(entry.step.kind, entry.id)}
              onhold={hold}
              onremove={() => removeStep(i)}
              {act}
            />
          {/each}
        </ol>
      {/if}
      {#if placing && !placing.replace}
        <div class="pending" role="status">
          <span><strong>{STEP_KINDS[placing.kind]}</strong>: {prompt}</span>
          <button type="button" class="link" onclick={() => (placing = null)}>Cancel</button>
        </div>
      {:else}
        <div class="add-menu">
          <button type="button" class="add" disabled={!done} aria-expanded={addOpen} onclick={() => (addOpen = !addOpen)}>
            <Plus size={15} aria-hidden="true" /> Add a transformation
          </button>
          {#if addOpen && done}
            <div class="menu" role="menu">
              {#each Object.entries(STEP_KINDS) as [k, label]}
                <button type="button" role="menuitem" onclick={() => startPlacing(k as StepKind)}>{label}</button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </section>


    <div class="card">
      <GridSettingsPanel bind:s={d.grid} placeholders={{ title: 'Reflect triangle ABC', xTitle: '', yTitle: '' }} />
    </div>
  </aside>
</div>

<style>
  /* The layout every generator has (see $shared/GeneratorPage.svelte): settings on the left, the figure card filling the rest. */
  .generator { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
  .settings-side { display: flex; flex-direction: column; gap: 1rem; }
  @media (min-width: 861px) and (min-height: 560px) {
    .generator {
      display: grid;
      grid-template-columns: 26rem minmax(0, 1fr);
      height: calc(100vh - var(--topbar-h));
      padding: 1.25rem;
      gap: 1.25rem;
    }
    .settings-side { grid-column: 1; grid-row: 1; min-height: 0; overflow-y: auto; padding: 0.15rem 0.25rem 4rem 0.15rem; }
    .figure-side { grid-column: 2; grid-row: 1; display: flex; min-height: 0; }
    .figure-side > :global(.canvas) { width: 100%; }
  }
  @media print { .generator { padding: 0; } }

  .pad { display: flex; flex-direction: column; gap: 0.55rem; padding: 1rem 1.1rem; }
  .card-top { display: flex; align-items: center; justify-content: space-between; }
  .card-head { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
  .help { margin: 0; color: var(--muted); font-size: 0.86rem; }
  .vertices { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; }
  .vertices li { display: flex; align-items: center; gap: 0.25rem; font-size: 0.9rem; }
  .name { width: 2.6rem; padding: 0.3rem 0.35rem; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Times New Roman', Times, serif; font-style: italic; font-weight: 700; text-align: center; }
  .name:focus { outline: none; border-color: var(--blue); }
  .buttons { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem 0.6rem; }
  .add {
    align-self: flex-start; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.65rem;
    border: 1.5px dashed var(--border); border-radius: 999px; background: none; color: var(--blue-dark); font-weight: 700; font-size: 0.85rem;
  }
  .add:hover:not(:disabled) { background: var(--blue-soft); }
  .add:disabled { color: #9aa0aa; cursor: default; }
  .link { padding: 0; border: 0; background: none; color: var(--muted); font-size: 0.84rem; font-weight: 600; text-decoration: underline; }
  .add-menu { position: relative; }
  .menu {
    position: absolute; z-index: 5; top: calc(100% + 4px); left: 0; display: flex; flex-direction: column; min-width: 12rem; padding: 4px;
    border: 1px solid var(--border); border-radius: 12px; background: #fff; box-shadow: 0 10px 28px -10px rgb(17 24 39 / 35%);
  }
  .menu button { padding: 0.45rem 0.7rem; border: 0; border-radius: 8px; background: none; text-align: left; font-weight: 600; font-size: 0.9rem; }
  .menu button:hover, .menu button:focus-visible { background: var(--blue-soft); color: var(--blue-dark); }
  .pending {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.55rem 0.7rem;
    border: 1.5px dashed var(--blue-border); border-radius: 12px; background: var(--blue-soft); color: var(--blue-dark); font-size: 0.86rem;
  }
  .show-card { position: relative; }
  .show-card .segmented button { flex: 1; }
  .versions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .version {
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem; padding: 0.4rem 0.3rem 0.35rem;
    border: 1.5px solid var(--border); border-radius: 11px; background: #fff; color: var(--ink); font-size: 0.82rem; font-weight: 700;
  }
  .version:hover { border-color: var(--blue-border); }
  .version.on { border-color: var(--blue); background: var(--blue-soft); color: var(--blue-dark); box-shadow: 0 0 0 1px var(--blue); }
  .icon { width: 3.4rem; height: auto; overflow: visible; pointer-events: none; }
  .icon .cell { stroke: #d6dae1; stroke-width: 0.8; }
  .icon .axis { stroke: var(--muted); stroke-width: 1.2; }
  .icon .pre { fill: rgb(17 24 39 / 8%); stroke: var(--ink); stroke-width: 1.6; stroke-linejoin: round; }
  .icon .img { fill: rgb(37 99 235 / 12%); stroke: #2563eb; stroke-width: 1.6; stroke-dasharray: 3 2; stroke-linejoin: round; }
  .icon .mirror { stroke: #dc2626; stroke-width: 1.6; stroke-dasharray: 3 2.5; }
  /* In black and white, as the figure will be: told apart by their dashes. */
  .icon.bw .img { fill: rgb(17 24 39 / 6%); stroke: var(--ink); }
  .icon.bw .mirror { stroke: var(--ink); stroke-dasharray: 1.2 2; }
  .show-panel {
    position: absolute; z-index: 6; top: 3rem; right: 0.8rem; display: flex; flex-direction: column; gap: 0.45rem; min-width: 13rem; padding: 0.75rem 0.9rem;
    border: 1px solid var(--border); border-radius: 12px; background: #fff; box-shadow: 0 10px 28px -10px rgb(17 24 39 / 35%);
  }
  .check { display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; font-weight: 600; }
  hr { margin: 0.2rem 0; border: 0; border-top: 1px solid var(--border); }
  /* Reset: red, outlined, so it reads as starting over. */
  .reset {
    height: 2.1rem; padding: 0 0.75rem; border: 1.5px solid var(--red); border-radius: 10px; background: #fff;
    color: var(--red); font-size: 0.85rem; font-weight: 700; cursor: pointer;
  }
  .reset:hover, .reset:focus-visible { background: var(--red-soft); }
  /* The widen button's dot: red when a point is off the grid, yellow when one is at its edge. */
  .widen { position: relative; }
  .dot { position: absolute; top: 0.3rem; right: 0.3rem; width: 0.55rem; height: 0.55rem; border: 1.5px solid #fff; border-radius: 50%; }
  .dot.off { background: var(--red); }
  .dot.edge { background: #f5b301; }

  /* The figure, filling the card; clicks on it snap to the grid. */
  .board { position: relative; width: 100%; height: 100%; touch-action: none; user-select: none; -webkit-user-select: none; }
  .board :global(svg) { display: block; width: 100%; height: 100%; }
  .board.clicking :global(svg) { cursor: crosshair; }
  .board :global([data-label]) { cursor: move; }
  .board.dragging :global(svg), .board.dragging :global(*) { cursor: grabbing !important; }
  .handle { fill: transparent; stroke: transparent; stroke-width: 2; cursor: grab; }
  .handle:hover { fill: rgb(37 99 235 / 12%); stroke: #2563eb; }
  .handle.closer { fill: rgb(37 99 235 / 12%); stroke: #2563eb; stroke-dasharray: 3 2; cursor: pointer; }
  .ghost { fill: rgb(37 99 235 / 25%); stroke: #2563eb; stroke-width: 1.5; pointer-events: none; }
  .ghost-line { stroke-width: 2; stroke-dasharray: 6 5; pointer-events: none; }
  .ghost-shape { stroke-width: 2.5; stroke-dasharray: 7 5; pointer-events: none; }
  .ghost-faint { stroke-width: 2; stroke-dasharray: 4 5; opacity: 0.6; pointer-events: none; }
  .option-line { fill: none; stroke: #2563eb; stroke-width: 1.5; stroke-dasharray: 3 6; opacity: 0.45; pointer-events: none; }
  .chosen-line { fill: none; stroke-width: 3; stroke-dasharray: 10 6; pointer-events: none; }
  .line-name { font: 700 15px system-ui, sans-serif; paint-order: stroke; stroke: #fff; stroke-width: 4; pointer-events: none; }
  .picked { fill: #2563eb; pointer-events: none; }
  .side-hit { stroke: transparent; stroke-width: 12; stroke-linecap: round; cursor: pointer; }
  .side-hit:hover { stroke: rgb(37 99 235 / 18%); }
  .picked-side { stroke: rgb(37 99 235 / 45%); stroke-width: 9; stroke-linecap: round; pointer-events: none; }
  .picked-vertex { fill: rgb(37 99 235 / 18%); stroke: #2563eb; stroke-width: 2; pointer-events: none; }
</style>
