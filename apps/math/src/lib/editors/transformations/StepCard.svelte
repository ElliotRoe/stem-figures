<script lang="ts">
  // One transformation in the step list, as a row: its number, how its image
  // is drawn, what it is (a translation's vector or a reflection's line to
  // type or pick right there), a button to place it on the grid again with a
  // preview of each choice, show or hide, and remove. A rotation or dilation
  // says what it is in words, with its settings on a second line.
  import { Eye, EyeOff, MousePointerClick, Trash2 } from '@lucide/svelte'
  import RowStyle from '$lib/shared/RowStyle.svelte'
  import NumberField from './NumberField.svelte'
  import type { StepEntry } from './drawing.js'
  import { describeStep, type Line, type Pt } from './transform.js'

  interface Props {
    entry: StepEntry
    index: number
    /** Whether it's being placed on the grid. */
    placing: boolean
    onplace: () => void
    /** A number being dragged: the drag is one step to undo. */
    onhold: (on: boolean) => void
    onremove: () => void
    /** Call before a change that should be a step of its own. */
    act: () => void
  }
  let { entry = $bindable(), index, placing, onplace, onhold, onremove, act }: Props = $props()

  const step = $derived(entry.step)
  const id = $derived(`step-${entry.id}`)

  type LineKey = 'x-axis' | 'y-axis' | 'y=x' | 'y=-x' | 'x=c' | 'y=c' | 'y=x+b' | 'y=-x+b'
  const LINE_CHOICES: [LineKey, string][] = [
    ['x-axis', 'the x-axis'], ['y-axis', 'the y-axis'], ['y=x', 'y = x'], ['y=-x', 'y = −x'],
    ['x=c', 'x = a number'], ['y=c', 'y = a number'], ['y=x+b', 'y = x + a number'], ['y=-x+b', 'y = −x + a number'],
  ]
  function lineKey(l: Line): LineKey {
    if (l.kind === 'vertical') return l.c === 0 ? 'y-axis' : 'x=c'
    if (l.kind === 'horizontal') return l.c === 0 ? 'x-axis' : 'y=c'
    if (l.b === 0) return l.slope === 1 ? 'y=x' : 'y=-x'
    return l.slope === 1 ? 'y=x+b' : 'y=-x+b'
  }
  function lineFor(key: LineKey, was: Line): Line {
    const n = was.kind === 'diagonal' ? was.b : was.c
    const some = n === 0 ? 2 : n
    switch (key) {
      case 'x-axis': return { kind: 'horizontal', c: 0 }
      case 'y-axis': return { kind: 'vertical', c: 0 }
      case 'y=x': return { kind: 'diagonal', slope: 1, b: 0 }
      case 'y=-x': return { kind: 'diagonal', slope: -1, b: 0 }
      case 'x=c': return { kind: 'vertical', c: some }
      case 'y=c': return { kind: 'horizontal', c: some }
      case 'y=x+b': return { kind: 'diagonal', slope: 1, b: some }
      case 'y=-x+b': return { kind: 'diagonal', slope: -1, b: some }
    }
  }

  const setCenter = (center: Pt) => {
    if (entry.step.kind === 'rotation' || entry.step.kind === 'dilation') entry.step = { ...entry.step, center }
  }
  // The style button edits a row; a figure's sides have no arrows or point marks.
  const styled = $derived(entry.look as typeof entry.look & { point: 'dot' })
  const PLACE = { translation: 'Place the image on the grid', reflection: 'Pick the line on the grid', rotation: 'Pick the center and turn on the grid', dilation: 'Pick the center on the grid' }
</script>

<li class="step" class:faded={!entry.shown}>
  <div class="head">
    <span class="num">{index + 1}</span>
    <RowStyle row={styled} id="{id}-style" label="image {index + 1}" hasArrows={false} />
    <span class="what">
      {#if step.kind === 'translation'}
        <span class="word">Translate</span>
        <span>⟨</span>
        <NumberField {onhold} label="Across" value={step.dx} width="2.3rem" onchange={(v) => step.kind === 'translation' && (entry.step = { ...step, dx: v })} />
        <span>,</span>
        <NumberField {onhold} label="Up" value={step.dy} width="2.3rem" onchange={(v) => step.kind === 'translation' && (entry.step = { ...step, dy: v })} />
        <span>⟩</span>
      {:else if step.kind === 'reflection'}
        <span class="word">Reflect over</span>
        <select id="{id}-line" aria-label="Line of reflection" value={lineKey(step.line)}
          onchange={(e) => { act(); if (step.kind === 'reflection') entry.step = { ...step, line: lineFor(e.currentTarget.value as LineKey, step.line) } }}>
          {#each LINE_CHOICES as [v, name]}<option value={v}>{name}</option>{/each}
        </select>
      {:else}
        <span class="said">{describeStep(step)}</span>
      {/if}
    </span>
    <button type="button" class="icon-btn place" class:on={placing} aria-pressed={placing} aria-label={PLACE[step.kind]} data-tip={placing ? 'Placing… (Esc to stop)' : PLACE[step.kind]} onclick={onplace}>
      <MousePointerClick size={17} />
    </button>
    <button class="icon-btn" aria-label={entry.shown ? `Hide image ${index + 1}` : `Show image ${index + 1}`} data-tip={entry.shown ? 'Hide image' : 'Show image'}
      onclick={() => { act(); entry.shown = !entry.shown }}
    >{#if entry.shown}<Eye size={17} />{:else}<EyeOff size={17} />{/if}</button>
    <button class="icon-btn" aria-label="Remove step {index + 1}" data-tip="Remove" onclick={onremove}><Trash2 size={17} /></button>
  </div>

  <!-- A second line for what doesn't fit on the first: a rotation's or dilation's settings, or a reflection line's number. -->
  {#if step.kind === 'reflection'}
    {@const key = lineKey(step.line)}
    {#if key === 'x=c' || key === 'y=c'}
      {@const line = step.line as { kind: 'vertical' | 'horizontal'; c: number }}
      <div class="fields">
        <span>{key === 'x=c' ? 'x =' : 'y ='}</span>
        <NumberField {onhold} label="Where the line crosses" value={line.c} onchange={(c) => (entry.step = { kind: 'reflection', line: { ...line, c } })} />
      </div>
    {:else if key === 'y=x+b' || key === 'y=-x+b'}
      {@const line = step.line as { kind: 'diagonal'; slope: 1 | -1; b: number }}
      <div class="fields">
        <span>{line.slope === 1 ? 'y = x +' : 'y = −x +'}</span>
        <NumberField {onhold} label="Where the line crosses the y-axis" value={line.b} onchange={(b) => (entry.step = { kind: 'reflection', line: { ...line, b } })} />
      </div>
    {/if}
  {:else if step.kind === 'rotation' || step.kind === 'dilation'}
    {@const center = step.center}
    <div class="fields">
      {#if step.kind === 'rotation'}
        <div class="segmented" role="radiogroup" aria-label="Angle">
          {#each [90, 180, 270] as deg}
            <button type="button" role="radio" aria-checked={step.degrees === deg} class:on={step.degrees === deg}
              onclick={() => { act(); if (step.kind === 'rotation') entry.step = { ...step, degrees: deg as 90 | 180 | 270 } }}>{deg}°</button>
          {/each}
        </div>
        <div class="segmented" role="radiogroup" aria-label="Direction">
          {#each [['ccw', 'Counterclockwise', '↺'], ['cw', 'Clockwise', '↻']] as [dir, name, icon]}
            <button type="button" role="radio" aria-label={name} title={name} aria-checked={step.direction === dir} class:on={step.direction === dir && step.degrees !== 180}
              disabled={step.degrees === 180}
              onclick={() => { act(); if (step.kind === 'rotation') entry.step = { ...step, direction: dir as 'cw' | 'ccw' } }}>{icon}</button>
          {/each}
        </div>
      {:else}
        <span>×</span>
        <NumberField {onhold} id="{id}-factor" label="Scale factor" value={step.factor} step={0.5} width="2.6rem" accept={(v) => v > 0}
          onchange={(factor) => step.kind === 'dilation' && (entry.step = { ...step, factor })} />
      {/if}
      <span class="about">{step.kind === 'rotation' ? 'about' : 'from'} (</span>
      <NumberField {onhold} label="Center x" value={center.x} width="2.1rem" onchange={(x) => setCenter({ ...center, x })} />
      <span>,</span>
      <NumberField {onhold} label="Center y" value={center.y} width="2.1rem" onchange={(y) => setCenter({ ...center, y })} />
      <span>)</span>
    </div>
  {/if}

</li>

<style>
  .step { display: flex; flex-direction: column; gap: 0.4rem; padding: 0.6rem 0; border-top: 1px solid var(--border); }
  .step:first-child { border-top: 0; padding-top: 0.1rem; }
  .step.faded .what, .step.faded .fields { opacity: 0.55; }
  .head { display: flex; align-items: center; gap: 0.3rem; }
  /* Compact, so a step and its settings fit on one line. */
  .head :global(.row-style .outline) { width: 2.3rem; }
  .head .icon-btn { flex: none; width: 1.9rem; height: 1.9rem; }
  .num { flex: none; width: 0.8rem; color: var(--muted); font-size: 0.8rem; font-weight: 600; text-align: center; }
  .what { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.2rem; font-size: 0.9rem; }
  .what select { min-width: 5.5rem; }
  .word { font-weight: 700; white-space: nowrap; }
  .said { font-weight: 700; line-height: 1.3; }
  .what select { flex: 1; min-width: 0; }
  .fields { display: flex; align-items: center; flex-wrap: nowrap; gap: 0.25rem; padding-left: 1.1rem; white-space: nowrap; font-size: 0.9rem; }
  .about { margin-left: 0.15rem; color: var(--muted); }
  .place.on { background: var(--blue-soft); color: var(--blue-dark); }
  select { padding: 0.3rem 0.35rem; border: 1.5px solid var(--border); border-radius: 8px; background: #fff; font: inherit; font-size: 0.88rem; }
  select:focus { outline: none; border-color: var(--blue); }
  .segmented button { min-width: 1.9rem; padding-inline: 0.25rem; font-size: 0.82rem; }
  .segmented button:disabled { opacity: 0.4; cursor: default; }
</style>
