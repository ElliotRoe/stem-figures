<script lang="ts">
  // The Organic Structure Editor: unlike the generators, there are no
  // settings to turn into a figure. The teacher draws an organic structure
  // (carbons and other atoms; the editor adds the hydrogens) and shows it in
  // one of four views. Drawing has three modes:
  //   Draw:   drag from an atom to add a bonded carbon, from empty space to
  //           start a chain, or onto another atom to bond them; tap a bond
  //           for double, then triple
  //   Move:   drag a bond to move its structure, an atom to move just it
  //           (snapping where its bonds come out the usual length or at
  //           30° steps, unless Alt is held; an end atom swings round, its
  //           bond stretching, as does an added hydrogen in the full
  //           structural formula), or a box around atoms to move just those
  //   Delete: tap an atom or bond, or drag a box around atoms, to remove them
  // Atoms and rings dragged from the tray land on an atom (changing its
  // element, or attaching the ring), on a bond (fusing the ring) or on their
  // own (an atom near another snapping a bond's length from it, on a 30°
  // step, and bonding to it); the chiral mark (*) lands on an atom, marking or unmarking it. The
  // drawing and view are kept in this browser (nothing goes in the address),
  // with undo and redo, and exports are cropped to the figure.
  import { Copy, Eraser, FileDown, FlipHorizontal2, ImageDown, MousePointer2, PenLine, Redo2, Trash2, Undo2 } from '@lucide/svelte'
  import { onMount } from 'svelte'
  import HelpTip from '$lib/shared/HelpTip.svelte'
  import { copyPng, downloadPng, downloadSvg } from '$lib/shared/exporting'
  import StructureDrawing from './StructureDrawing.svelte'
  import {
    addAtom, addRing, atomAt, atomById, atomsIn, BOND, bondAt, bondAtoms, bondBetween, bondsOf, connectedTo,
    cycleBond, dropAtom, dropSpot, emptyStructure, freeSpot, growFrom, HEIGHT, MAIN_ELEMENTS, MORE_ELEMENTS, moveAtom, moveAtoms,
    openAngle, otherEnd, RINGS, ringRoom, setElement, snapAngle, startChain, step, swingEnd, swingHydrogen, tidyStructure, toggleChiral, WIDTH,
    withoutAtoms, withoutBond, type Atom, type Bond, type ElementSymbol, type OrganicStructure, type Point, type RingKind,
  } from './structure'
  import { acidGroups, describe, drawView, inRing, VIEWS, type AddedHydrogen, type View, type ViewSettings } from './view'

  interface Props {
    name: string
  }
  let { name }: Props = $props()

  type Mode = 'draw' | 'move' | 'delete'
  const MODES: { mode: Mode; label: string }[] = [
    { mode: 'draw', label: 'Draw' },
    { mode: 'move', label: 'Move' },
    { mode: 'delete', label: 'Delete' },
  ]
  const VIEW_TIPS: Record<View, string> = {
    skeletal: 'Skeletal formula: bonds alone, with labels only on atoms other than carbon',
    carbons: 'Carbon skeleton: a C at every carbon, no hydrogens on carbon',
    condensed: 'Condensed formula: every carbon with its hydrogens, like CH₃',
    full: 'Full structural formula: every atom and bond, each hydrogen on its own bond',
  }
  type TrayItem = { kind: 'atom'; element: ElementSymbol } | { kind: 'ring'; ring: RingKind } | { kind: 'chiral' }
  const STORAGE_KEY = 'chemistry-organic-structure'
  const HISTORY_LIMIT = 100
  /** How near the pointer must be, in page units, to land on an atom or bond. */
  const REACH = 22

  let structure = $state.raw<OrganicStructure>(emptyStructure())
  let past = $state.raw<OrganicStructure[]>([])
  let future = $state.raw<OrganicStructure[]>([])
  let settings = $state<ViewSettings>({ view: 'skeletal', labelEnds: false, labelRings: true, acids: false, reverseLeft: true, numbering: false, flip: false, caption: '' })
  let mode = $state<Mode>('draw')
  let selected = $state.raw<string[]>([])
  let showMore = $state(false)
  let svg = $state<SVGSVGElement>()

  const drawn = $derived(drawView(structure, settings))
  const hasRing = $derived(structure.atoms.some((a) => a.element === 'C' && inRing(structure, a)))
  const hasAcid = $derived(acidGroups(structure).size > 0)

  // The drag in progress: a bond being drawn, a box, atoms being moved or an
  // end atom swung, or something on its way from the tray.
  let drawing = $state<{ pointerId: number; from: string | null; start: Point; end: Point; moved: boolean } | null>(null)
  let box = $state<{ x1: number; y1: number; x2: number; y2: number; pointerId: number; keep: string[] } | null>(null)
  let moving = $state.raw<{ pointerId: number; x: number; y: number; origins: Map<string, Point>; before: OrganicStructure; moved: boolean; swing: string | null; keep: boolean; hydrogen: { atomId: string; index: number; drawnAt: Point[] } | null } | null>(null)
  let carrying = $state<{ item: TrayItem; pointerId: number; x: number; y: number; startX: number; startY: number } | null>(null)
  let loaded = false

  onMount(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      structure = tidyStructure(stored?.structure)
      const v = stored?.settings ?? {}
      settings = {
        view: VIEWS.some((x) => x.view === v.view) ? v.view : 'skeletal',
        labelEnds: v.labelEnds === true,
        labelRings: v.labelRings !== false,
        acids: v.acids === true,
        reverseLeft: v.reverseLeft !== false,
        numbering: v.numbering === true,
        flip: v.flip === true,
        caption: typeof v.caption === 'string' ? v.caption.slice(0, 80) : '',
      }
    } catch {
      /* nothing saved, or storage blocked */
    }
    loaded = true
  })

  $effect(() => {
    const data = JSON.stringify({ structure, settings })
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, data)
    } catch {
      /* storage blocked or full: the drawing lasts until the page closes */
    }
  })

  /** Makes a change undoable. */
  function commit(next: OrganicStructure) {
    past = [...past, structure].slice(-HISTORY_LIMIT)
    future = []
    structure = next
  }
  function undo() {
    if (!past.length) return
    future = [structure, ...future]
    structure = past.at(-1)!
    past = past.slice(0, -1)
    selected = []
  }
  function redo() {
    if (!future.length) return
    past = [...past, structure]
    structure = future[0]
    future = future.slice(1)
    selected = []
  }

  function setMode(next: Mode) {
    mode = next
    if (next === 'draw') selected = []
  }

  /** A point on the page from a pointer's place on screen. */
  function pagePoint(clientX: number, clientY: number) {
    const p = new DOMPoint(clientX, clientY).matrixTransform(svg!.getScreenCTM()!.inverse())
    return { x: Math.max(0, Math.min(WIDTH, p.x)), y: Math.max(0, Math.min(HEIGHT, p.y)) }
  }

  function deleteAtoms(ids: string[]) {
    commit(withoutAtoms(structure, ids))
    selected = selected.filter((id) => !ids.includes(id))
  }

  // ----- The tray: drag an atom or ring out, or tap one (or press Enter) to add it in a free spot

  function pickUp(event: PointerEvent, item: TrayItem) {
    if (event.button !== 0) return
    event.preventDefault()
    showMore = false
    carrying = { item, pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY }
  }
  function carry(event: PointerEvent) {
    if (!carrying || event.pointerId !== carrying.pointerId) return
    event.preventDefault()
    carrying = { ...carrying, x: event.clientX, y: event.clientY }
  }
  function drop(event: PointerEvent) {
    if (!carrying || event.pointerId !== carrying.pointerId) return
    const { item, startX, startY } = carrying
    carrying = null
    if (event.type === 'pointercancel' || !svg) return
    const r = svg.getBoundingClientRect()
    const over = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom
    const tapped = Math.hypot(event.clientX - startX, event.clientY - startY) < 6
    if (over) place(item, pagePoint(event.clientX, event.clientY))
    else if (tapped) place(item, null)
  }
  /** A keyboard press on a tray button (a pointer's is handled by pickUp and drop). */
  function trayKey(event: MouseEvent, item: TrayItem) {
    if (event.detail !== 0) return
    showMore = false
    place(item, null)
  }

  /** Puts a tray item where it was dropped: on an atom, a bond, or on its
   *  own (in a free spot when it was tapped). */
  function place(item: TrayItem, at: Point | null) {
    const onAtom = at && atomAt(structure, at, REACH)
    // The chiral mark goes on the atom it's dropped on, or on the selected
    // atoms when it's tapped; again takes it off.
    if (item.kind === 'chiral') {
      const ids = onAtom ? [onAtom.id] : at ? [] : selected
      if (ids.length) commit(toggleChiral(structure, ids))
      return
    }
    if (item.kind === 'atom') {
      if (onAtom && onAtom.element === item.element) return
      if (onAtom) return commit(setElement(structure, onAtom.id, item.element))
      return commit(at ? dropAtom(structure, item.element, at) : addAtom(structure, item.element, freeSpot(structure)).structure)
    }
    if (onAtom) return commit(addRing(structure, item.ring, { atom: onAtom.id }))
    const onBond = at && bondAt(structure, at, REACH / 2)
    if (onBond) return commit(addRing(structure, item.ring, { bond: onBond.id }))
    commit(addRing(structure, item.ring, { at: at ?? freeSpot(structure, ringRoom(item.ring)) }))
  }

  // ----- The page

  function pressAtom(event: PointerEvent, atom: Atom) {
    event.stopPropagation()
    if (event.button !== 0) return
    if (mode === 'delete') return deleteAtoms([atom.id])
    const p = pagePoint(event.clientX, event.clientY)
    if (mode === 'draw') {
      drawing = { pointerId: event.pointerId, from: atom.id, start: { x: atom.x, y: atom.y }, end: p, moved: false }
      svg!.setPointerCapture(event.pointerId)
      return
    }
    if (event.shiftKey) {
      selected = selected.includes(atom.id) ? selected.filter((id) => id !== atom.id) : [...selected, atom.id]
      return
    }
    // A selection moves together; otherwise an end atom swings round its
    // neighbor (stretching its bond) and any other atom moves on its own.
    if (selected.includes(atom.id)) return grab(event, p, selected, null, true)
    const swing = bondsOf(structure, atom.id).length === 1 ? atom.id : null
    grab(event, p, [atom.id], swing, false)
  }

  /** Starts moving atoms: a selection, which stays selected afterward, or a
   *  whole structure or one swung atom, highlighted only while dragged. */
  function grab(event: PointerEvent, p: Point, ids: string[], swing: string | null, keep: boolean) {
    const origins = new Map(structure.atoms.filter((a) => ids.includes(a.id)).map((a) => [a.id, { x: a.x, y: a.y }]))
    moving = { pointerId: event.pointerId, ...p, origins, before: structure, moved: false, swing, keep, hydrogen: null }
    selected = ids
    svg!.setPointerCapture(event.pointerId)
  }

  /** Starts swinging one of the full structural formula's added hydrogens
   *  round its atom (only in Move), from where its atom's hydrogens are drawn. */
  function pressHydrogen(event: PointerEvent, h: AddedHydrogen) {
    if (event.button !== 0 || mode !== 'move') return
    event.stopPropagation()
    const drawnAt = drawn.hydrogens.filter((x) => x.atomId === h.atomId).sort((a, b) => a.index - b.index).map(({ x, y }) => ({ x, y }))
    const p = pagePoint(event.clientX, event.clientY)
    moving = { pointerId: event.pointerId, ...p, origins: new Map(), before: structure, moved: false, swing: null, keep: false, hydrogen: { atomId: h.atomId, index: h.index, drawnAt } }
    svg!.setPointerCapture(event.pointerId)
  }

  function pressBond(event: PointerEvent, bond: Bond) {
    if (event.button !== 0) return
    event.stopPropagation()
    if (mode === 'delete') return commit(withoutBond(structure, bond.id))
    if (mode === 'move') {
      const p = pagePoint(event.clientX, event.clientY)
      const both = selected.includes(bond.a) && selected.includes(bond.b)
      return grab(event, p, both ? selected : connectedTo(structure, bond.a), null, both)
    }
    commit(cycleBond(structure, bond.id))
  }

  function pressPage(event: PointerEvent) {
    if (event.button !== 0) return
    const p = pagePoint(event.clientX, event.clientY)
    if (mode === 'draw') drawing = { pointerId: event.pointerId, from: null, start: p, end: p, moved: false }
    else {
      box = { x1: p.x, y1: p.y, x2: p.x, y2: p.y, pointerId: event.pointerId, keep: event.shiftKey ? selected : [] }
      if (!event.shiftKey) selected = []
    }
    svg!.setPointerCapture(event.pointerId)
  }

  const boxed = (b: NonNullable<typeof box>) => [...new Set([...b.keep, ...atomsIn(structure, b)])]

  /** Where the bond being drawn would end: on an atom within reach, or a
   *  bond's length from its start at the nearest 30° step. */
  function drawingTarget(d: NonNullable<typeof drawing>) {
    const onto = d.from && atomAt(structure, d.end, REACH)
    if (onto && onto.id !== d.from) return { atom: onto, at: { x: onto.x, y: onto.y } }
    return { atom: null, at: step(d.start, snapAngle(d.end.x - d.start.x, d.end.y - d.start.y), BOND) }
  }

  function movePointer(event: PointerEvent) {
    if (drawing && event.pointerId === drawing.pointerId) {
      const end = pagePoint(event.clientX, event.clientY)
      drawing = { ...drawing, end, moved: drawing.moved || Math.hypot(end.x - drawing.start.x, end.y - drawing.start.y) > BOND / 3 }
    } else if (moving && event.pointerId === moving.pointerId) {
      const p = pagePoint(event.clientX, event.clientY)
      // A swung atom or hydrogen stays where the pointer took hold of it, not at its center.
      if (moving.hydrogen) {
        const { atomId, index, drawnAt } = moving.hydrogen
        const h = drawnAt[index]
        structure = swingHydrogen(moving.before, atomId, drawnAt, index, { x: h.x + p.x - moving.x, y: h.y + p.y - moving.y })
      } else if (moving.swing) {
        const atom = moving.origins.get(moving.swing)!
        structure = swingEnd(moving.before, moving.swing, { x: atom.x + p.x - moving.x, y: atom.y + p.y - moving.y })
      } else if (!moving.keep && moving.origins.size === 1) {
        // One atom on its own snaps into place, unless Alt is held.
        const [[id, atom]] = moving.origins
        structure = moveAtom(moving.before, id, { x: atom.x + p.x - moving.x, y: atom.y + p.y - moving.y }, !event.altKey)
      } else structure = moveAtoms(moving.before, moving.origins, p.x - moving.x, p.y - moving.y)
      moving.moved ||= structure !== moving.before && Math.hypot(p.x - moving.x, p.y - moving.y) > 2
    } else if (box && event.pointerId === box.pointerId) {
      const p = pagePoint(event.clientX, event.clientY)
      box = { ...box, x2: p.x, y2: p.y }
      selected = boxed(box)
    }
  }

  function endPointer(event: PointerEvent) {
    const cancelled = event.type === 'pointercancel'
    if (drawing && event.pointerId === drawing.pointerId) {
      const d = drawing
      drawing = null
      if (!cancelled) finishDrawing(d)
    }
    if (moving && event.pointerId === moving.pointerId) {
      if (cancelled || !moving.moved) structure = moving.before
      else {
        past = [...past, moving.before].slice(-HISTORY_LIMIT)
        future = []
      }
      if (!moving.keep) selected = []
      moving = null
    }
    if (!box || event.pointerId !== box.pointerId) return
    const ids = boxed(box)
    const dragged = Math.abs(box.x2 - box.x1) > 3 || Math.abs(box.y2 - box.y1) > 3
    if (cancelled) selected = box.keep
    else if (mode === 'delete' && dragged && ids.length) deleteAtoms(ids)
    box = null
  }

  function finishDrawing(d: NonNullable<typeof drawing>) {
    if (!d.from) {
      if (!d.moved) return commit(addAtom(structure, 'C', d.start).structure)
      return commit(startChain(structure, d.start, snapAngle(d.end.x - d.start.x, d.end.y - d.start.y)))
    }
    const from = atomById(structure, d.from)!
    if (!d.moved) return commit(growFrom(structure, from.id, openAngle(structure, from)).structure)
    const target = drawingTarget(d)
    if (target.atom) {
      if (bondBetween(structure, from.id, target.atom.id)) return
      return commit(bondAtoms(structure, from.id, target.atom.id)!)
    }
    commit(growFrom(structure, from.id, snapAngle(d.end.x - d.start.x, d.end.y - d.start.y)).structure)
  }

  function keydown(event: KeyboardEvent) {
    const target = event.target as Element | null
    if (target?.matches?.('input, textarea, select')) return
    const key = event.key.toLowerCase()
    if ((event.metaKey || event.ctrlKey) && !event.altKey && (key === 'z' || key === 'y')) {
      event.preventDefault()
      if (key === 'y' || event.shiftKey) redo()
      else undo()
    } else if (event.key === 'Escape') {
      drawing = null
      selected = []
      showMore = false
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && selected.length && mode !== 'draw') {
      event.preventDefault()
      deleteAtoms(selected)
    }
  }

  function clearPage() {
    if (!confirm('Clear the whole page? You can undo this.')) return
    commit(emptyStructure())
    selected = []
  }

  // ----- Getting the figure out, cropped to just what's drawn

  /** The page as a picture of the figure alone. Targets, highlights and
   *  marks are data-no-export, and exporting leaves them out. */
  function picture() {
    const crop = drawn.crop
    if (!svg || !crop) return null
    const copy = svg.cloneNode(true) as SVGSVGElement
    copy.setAttribute('viewBox', `${crop.x} ${crop.y} ${crop.width} ${crop.height}`)
    copy.setAttribute('width', String(Math.ceil(crop.width)))
    copy.setAttribute('height', String(Math.ceil(crop.height)))
    copy.removeAttribute('class')
    copy.setAttribute('role', 'img')
    copy.setAttribute('aria-label', describe(structure, settings.view))
    return copy
  }
  async function copyImage() {
    const p = picture()
    if (!p) return
    try {
      await copyPng(p)
    } catch {
      /* the browser blocked copying */
    }
  }
  function download(kind: 'png' | 'svg') {
    const p = picture()
    if (!p) return
    const file = `organic-structure-${settings.view}.${kind}`
    if (kind === 'png') downloadPng(p, file)
    else downloadSvg(p, file)
  }

  const preview = $derived(drawing?.moved ? drawingTarget(drawing) : null)

  /** Where a tray atom being carried over the page would land and bond, if
   *  it would snap to an atom (not dropped on one). */
  const landing = $derived.by(() => {
    if (carrying?.item.kind !== 'atom' || !svg) return null
    const r = svg.getBoundingClientRect()
    if (carrying.x < r.left || carrying.x > r.right || carrying.y < r.top || carrying.y > r.bottom) return null
    const at = pagePoint(carrying.x, carrying.y)
    if (atomAt(structure, at, REACH)) return null
    const spot = dropSpot(structure, at)
    return spot.hub ? { from: spot.hub, at: spot.at } : null
  })
</script>

<svelte:window onkeydown={keydown} onpointermove={carry} onpointerup={drop} onpointercancel={drop} />

{#snippet ringIcon(kind: RingKind)}
  {@const ring = RINGS.find((r) => r.kind === kind)!}
  {@const n = ring.size}
  {@const corners = Array.from({ length: n }, (_, k) => step({ x: 20, y: 20 }, -90 + (k * 360) / n, 15))}
  <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
    <polygon points={corners.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
    {#if ring.aromatic}
      {#each [0, 2, 4] as k (k)}
        {@const [p, q] = [step({ x: 20, y: 20 }, -90 + k * 60, 10.5), step({ x: 20, y: 20 }, -30 + k * 60, 10.5)]}
        <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      {/each}
    {/if}
  </svg>
{/snippet}

<div class="editor">
  <aside class="tools card no-print" aria-label="Drawing tools">
    <h1 class="visually-hidden">{name}</h1>
    <section>
      <h2>Atoms</h2>
      <div class="tray">
        {#each MAIN_ELEMENTS as e (e.symbol)}
          <button
            type="button"
            class="element"
            aria-label="Add {e.name}"
            onpointerdown={(event) => pickUp(event, { kind: 'atom', element: e.symbol })}
            onclick={(event) => trayKey(event, { kind: 'atom', element: e.symbol })}
          >
            <strong>{e.symbol}</strong><span>{e.name}</span>
          </button>
        {/each}
      </div>
      <button type="button" class="more" aria-expanded={showMore} onclick={() => (showMore = !showMore)}>
        {showMore ? 'Show less' : 'Show more'}
      </button>
      {#if showMore}
        <div class="more-atoms">
          {#each MORE_ELEMENTS as symbol (symbol)}
            <button
              type="button"
              class="element small"
              aria-label="Add {symbol}"
              onpointerdown={(event) => pickUp(event, { kind: 'atom', element: symbol })}
              onclick={(event) => trayKey(event, { kind: 'atom', element: symbol })}
            >
              <strong>{symbol}</strong>
            </button>
          {/each}
          <button
            type="button"
            class="element small"
            aria-label="Mark a chiral center"
            title="Chiral center: drop on an atom"
            onpointerdown={(event) => pickUp(event, { kind: 'chiral' })}
            onclick={(event) => trayKey(event, { kind: 'chiral' })}
          >
            <strong>*</strong>
          </button>
        </div>
      {/if}
      <div class="tray rings">
        {#each RINGS as r (r.kind)}
          <button
            type="button"
            class="element ring"
            aria-label="Add a {r.name.toLowerCase()} ring"
            onpointerdown={(event) => pickUp(event, { kind: 'ring', ring: r.kind })}
            onclick={(event) => trayKey(event, { kind: 'ring', ring: r.kind })}
          >
            {@render ringIcon(r.kind)}<span>{r.name}</span>
          </button>
        {/each}
      </div>
    </section>

    <section>
      <h2 class="with-tip">
        Mode
        <HelpTip id="mode-tip" label="How to draw">
          Draw: drag from an atom to add a carbon, or from empty space to start a chain; drag onto an atom to bond them; tap a bond for double,
          then triple. Move: drag a bond to move its structure, an atom to move just it (it snaps into place unless you hold Alt; an end atom, or a hydrogen in Full, swings round and its bond stretches), or a box
          to move some atoms. Delete: tap an
          atom or bond, or drag a box. Shift-click adds to a selection, Delete removes it, and Ctrl+Z undoes.
        </HelpTip>
      </h2>
      <div class="segmented modes" role="radiogroup" aria-label="Mode">
        {#each MODES as m (m.mode)}
          <button type="button" role="radio" aria-checked={mode === m.mode} class:on={mode === m.mode} class:delete={m.mode === 'delete'} onclick={() => setMode(m.mode)}>
            {#if m.mode === 'draw'}<PenLine size={16} aria-hidden="true" />{:else if m.mode === 'move'}<MousePointer2 size={16} aria-hidden="true" />{:else}<Eraser size={16} aria-hidden="true" />{/if}
            {m.label}
          </button>
        {/each}
      </div>
    </section>

    <section>
      <h2>Figure</h2>
      {#if settings.view === 'skeletal'}
        <label class="check first">
          <input type="checkbox" bind:checked={settings.labelEnds} />
          <strong>Label CH₃ ends</strong>
        </label>
        {#if drawn.hidden.length}
          <p class="warning">
            {drawn.hidden.length === 1 ? 'A carbon is' : `${drawn.hidden.length} carbons are`} drawn in a straight line, so the skeletal formula hides
            {drawn.hidden.length === 1 ? 'it' : 'them'} (marked in amber). Bend the chain there: in Move, drag {drawn.hidden.length === 1 ? 'it' : 'one'} off the line.
          </p>
        {/if}
      {:else}
        {#if hasRing}
          <label class="check first">
            <input type="checkbox" bind:checked={settings.labelRings} />
            <strong>Label ring carbons</strong>
          </label>
        {/if}
        {#if settings.view !== 'full' && hasAcid}
          <label class="check first">
            <input type="checkbox" bind:checked={settings.acids} />
            <strong>Write acids as CO₂H</strong>
          </label>
        {/if}
      {/if}
      {#if drawn.leftLabels}
        <label class="check first">
          <input type="checkbox" bind:checked={settings.reverseLeft} />
          <strong>Flip left labels (H₃C, HO)</strong>
        </label>
      {/if}
      <div class="numbering">
        <label class="check">
          <input type="checkbox" bind:checked={settings.numbering} />
          <strong>Number carbons</strong>
        </label>
        {#if settings.numbering}
          <button type="button" class="flip" onclick={() => (settings.flip = !settings.flip)}>
            <FlipHorizontal2 size={15} aria-hidden="true" /> Flip
          </button>
        {/if}
      </div>
      {#if settings.numbering && drawn.numberingNote}
        <p class="warning">{drawn.numberingNote}</p>
      {/if}
      <label class="caption">
        <span>Caption</span>
        <input type="text" maxlength="80" bind:value={settings.caption} placeholder="Optional, such as Butanoic acid" spellcheck="false" />
      </label>
    </section>

  </aside>

  <div class="figure-side">
    <div class="card canvas">
      <div class="toolbar no-print" role="toolbar" aria-label="Structure actions">
        <div class="segmented views" role="radiogroup" aria-label="View">
          {#each VIEWS as v (v.view)}
            <button type="button" role="radio" aria-checked={settings.view === v.view} class:on={settings.view === v.view} title={VIEW_TIPS[v.view]} onclick={() => (settings.view = v.view as View)}>
              {v.name}
            </button>
          {/each}
        </div>
        <span class="divider wide-only"></span>
        <button class="icon-btn" aria-label="Copy image" data-tip="Copy image" onclick={copyImage}><Copy size={19} /></button>
        <button class="icon-btn" aria-label="Download PNG" data-tip="Download PNG" onclick={() => download('png')}><ImageDown size={19} /></button>
        <button class="icon-btn" aria-label="Download SVG" data-tip="Download SVG" onclick={() => download('svg')}><FileDown size={19} /></button>
        <span class="divider"></span>
        <button class="icon-btn" aria-label="Undo" data-tip="Undo" disabled={!past.length} onclick={undo}><Undo2 size={19} /></button>
        <button class="icon-btn" aria-label="Redo" data-tip="Redo" disabled={!future.length} onclick={redo}><Redo2 size={19} /></button>
        <button class="icon-btn" aria-label="Clear the page" data-tip="Clear the page" disabled={!structure.atoms.length} onclick={clearPage}><Trash2 size={19} /></button>
      </div>
      <div class="sheet">
        <svg
          bind:this={svg}
          class="page {mode}"
          class:moving={!!moving}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 {WIDTH} {HEIGHT}"
          font-family="Arial, Helvetica, sans-serif"
          role="application"
          aria-label="Drawing page. {describe(structure, settings.view)}."
          onpointerdown={pressPage}
          onpointermove={movePointer}
          onpointerup={endPointer}
          onpointercancel={endPointer}
        >
          <rect data-no-export width={WIDTH} height={HEIGHT} fill="#fff" />
          <StructureDrawing
            {structure}
            {drawn}
            selected={mode === 'draw' ? [] : selected}
            deleting={mode === 'delete'}
            from={drawing?.from ?? null}
            onatomdown={pressAtom}
            onbonddown={pressBond}
            onhydrogendown={mode === 'move' ? pressHydrogen : undefined}
          />
          {#if drawing && preview}
            <g data-no-export class="preview" pointer-events="none">
              <line x1={drawing.start.x} y1={drawing.start.y} x2={preview.at.x} y2={preview.at.y} />
              {#if !preview.atom}<circle cx={preview.at.x} cy={preview.at.y} r="7" />{/if}
            </g>
          {/if}
          {#if landing}
            <g data-no-export class="preview" pointer-events="none">
              <line x1={landing.from.x} y1={landing.from.y} x2={landing.at.x} y2={landing.at.y} />
              <circle cx={landing.at.x} cy={landing.at.y} r="7" />
            </g>
          {/if}
          {#if box}
            <rect
              data-no-export
              class="box"
              class:delete={mode === 'delete'}
              x={Math.min(box.x1, box.x2)}
              y={Math.min(box.y1, box.y2)}
              width={Math.abs(box.x2 - box.x1)}
              height={Math.abs(box.y2 - box.y1)}
            />
          {/if}
          {#if !structure.atoms.length}
            <g data-no-export class="empty" pointer-events="none">
              <text x={WIDTH / 2} y={HEIGHT / 2 - 8} text-anchor="middle" font-size="22" font-weight="700">Your structure will appear here</text>
              <text x={WIDTH / 2} y={HEIGHT / 2 + 24} text-anchor="middle" font-size="16">Drag across the page to draw a C–C bond, or drag an atom or ring from the tray.</text>
            </g>
          {/if}
        </svg>
      </div>
    </div>
  </div>
</div>

{#if carrying}
  <div class="carried" class:atom={carrying.item.kind === 'atom'} style:left="{carrying.x}px" style:top="{carrying.y}px" aria-hidden="true">
    {#if carrying.item.kind === 'atom'}{carrying.item.element}{:else if carrying.item.kind === 'chiral'}*{:else}{@render ringIcon(carrying.item.ring)}{/if}
  </div>
{/if}

<style>
  .editor { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
  .tools { display: flex; flex-direction: column; gap: 1.1rem; padding: 1rem 1.1rem 1.2rem; }
  h2 { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
  h2.with-tip { display: flex; align-items: center; justify-content: space-between; }
  .warning { margin: 0.5rem 0 0; color: var(--amber-dark, #92400e); font-size: 0.84rem; }

  .tray { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; margin-top: 0.7rem; }
  .element {
    display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
    padding: 0.55rem 0.3rem 0.5rem;
    border: 1.5px solid var(--border); border-radius: 12px; background: #fff; color: var(--ink);
    touch-action: none; user-select: none; -webkit-user-select: none; cursor: grab;
    transition: border-color 0.15s, background 0.15s, transform 0.15s;
  }
  .element:hover { border-color: var(--blue-border); background: var(--blue-soft); transform: translateY(-1px); }
  .element strong { font-family: Arial, Helvetica, sans-serif; font-size: 1.5rem; line-height: 1.1; }
  .element span { color: var(--muted); font-size: 0.75rem; font-weight: 600; }
  .more { margin-top: 0.5rem; width: 100%; padding: 0.45rem; border: 1.5px dashed var(--blue-border); border-radius: 10px; background: transparent; color: var(--blue-dark); font-size: 0.86rem; font-weight: 600; }
  .more:hover { background: var(--blue-soft); }
  .more-atoms { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4rem; margin-top: 0.5rem; }
  .element.small { padding: 0.35rem 0.2rem; }
  .element.small strong { font-size: 1.15rem; }
  .rings { margin-top: 0.5rem; }
  .element { min-width: 0; }
  .element.ring { padding: 0.4rem 0 0.45rem; }
  .element.ring span { font-size: 0.64rem; }

  .modes { margin-top: 0.6rem; }
  .views { flex: none; }
  .views button { padding-inline: 0.7rem; }
  .modes button.on.delete { color: var(--red); }
  .check { display: flex; align-items: center; gap: 0.55rem; margin-top: 0.8rem; cursor: pointer; font-size: 0.9rem; }
  .check input { width: 1.1rem; height: 1.1rem; margin: 0; accent-color: var(--blue); }
  .check strong { white-space: nowrap; }
  .check.first { margin-top: 0.6rem; }
  .numbering { display: flex; align-items: center; gap: 0.3rem; }
  .numbering .check { margin-right: auto; }
  .flip {
    display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.8rem; padding: 0.3rem 0.45rem;
    border: 1.5px solid var(--border); border-radius: 8px; background: #fff; color: var(--ink); font-size: 0.84rem; font-weight: 600;
  }
  .flip:hover { border-color: var(--blue-border); background: var(--blue-soft); }
  .caption { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.9rem; font-size: 0.9rem; font-weight: 700; }
  .caption input { padding: 0.45rem 0.6rem; border: 1.5px solid var(--border); border-radius: 8px; font: inherit; font-weight: 400; }

  .canvas { display: flex; flex-direction: column; }
  .toolbar { display: flex; align-items: center; gap: 0.3rem; padding: 0.45rem; border-bottom: 1px solid var(--border); }
  .divider { width: 1px; height: 1.6rem; background: var(--border); margin: 0 0.3rem; flex: none; }
  .sheet { padding: 0.75rem; display: flex; justify-content: center; }
  .page { display: block; width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--border); touch-action: none; user-select: none; -webkit-user-select: none; }
  .page.draw { cursor: crosshair; }
  .page.draw :global(.atom), .page.draw :global(.bond.target) { cursor: pointer; }
  .page.move { cursor: crosshair; }
  .page.move :global(.atom), .page.move :global(.bond.target), .page.move :global(.hydrogen) { cursor: grab; }
  .page.moving, .page.moving :global(.atom) { cursor: grabbing; }
  .page.delete, .page.delete :global(.atom), .page.delete :global(.bond) { cursor: crosshair; }
  .box { fill: rgba(37, 99, 235, 0.08); stroke: var(--blue); stroke-width: 1.5; stroke-dasharray: 6 5; pointer-events: none; }
  .box.delete { fill: rgba(220, 38, 38, 0.08); stroke: var(--red); }
  .preview line { stroke: var(--blue); stroke-width: 2.5; stroke-dasharray: 7 5; stroke-linecap: round; }
  .preview circle { fill: rgba(37, 99, 235, 0.15); stroke: var(--blue); stroke-width: 1.5; }
  .empty text { fill: #9aa0aa; }

  .carried {
    position: fixed; z-index: 100; display: grid; place-items: center; min-width: 3rem; height: 3rem; padding: 0 0.3rem;
    transform: translate(-50%, -50%); border: 2px solid var(--blue); border-radius: 12px; background: #fff;
    box-shadow: 0 8px 20px rgba(16, 24, 40, 0.2); font: 700 1.6rem Arial, Helvetica, sans-serif; color: #111;
    pointer-events: none; user-select: none;
  }
  /* A carried atom is just its letter, so the snapping preview shows through. */
  .carried.atom { border: none; background: none; box-shadow: none; text-shadow: 0 0 3px #fff, 0 0 3px #fff; }

  /* Phones: the views get their own row. */
  @media (max-width: 640px) {
    .toolbar { flex-wrap: wrap; }
    .views { flex-basis: 100%; }
    .views button { flex: 1; padding-inline: 0.2rem; }
    .wide-only { display: none; }
  }

  /* Wide screens: the tools on the left and the page filling the window beside them. */
  @media (min-width: 861px) and (min-height: 560px) {
    .editor {
      display: grid;
      grid-template-columns: 18rem minmax(0, 1fr);
      height: calc(100vh - var(--topbar-h));
      padding: 1.25rem;
      gap: 1.25rem;
    }
    .tools { min-height: 0; overflow-y: auto; }
    .figure-side { display: flex; min-height: 0; }
    .canvas { flex: 1; min-height: 0; }
    .sheet { flex: 1; min-height: 0; }
    .page { height: 100%; }
  }
</style>
