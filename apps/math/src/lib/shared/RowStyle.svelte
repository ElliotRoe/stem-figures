<script lang="ts">
  // The button before an equation, drawn the way that equation is graphed (its
  // color, line style and arrows, or dots or crosses for points), so each row reads as
  // its own line on the figure. It opens a small popup to change those. Fixed-position like
  // CapPicker's menu, so the scrolling settings column can't clip it.
  import { tick } from 'svelte'
  import {
    ARROWS, ASYMPTOTES, COLORS, ENDPOINTS, FILLS, LABEL_STYLES, LINE_STYLES, POINT_STYLES, THICKNESSES, VALUE_STYLES,
    type Arrows, type AsymptoteStyle, type Color, type Endpoints, type Fill, type LabelStyle, type LineStyle, type PointStyle, type Thickness,
    type ValueStyle,
  } from './rowStyle.js'

  // What a row style can hold. The grid keeps its label style in `names` (its
  // links say names=); a number line row keeps it in `labels`, and has `values`.
  type Styled = {
    color: Color; point: PointStyle; line?: LineStyle; arrows?: Arrows; ends?: Endpoints; asym?: AsymptoteStyle
    names?: LabelStyle; labels?: LabelStyle; values?: ValueStyle; fill?: Fill; barrows?: Arrows; width?: Thickness
  }

  // row: { color, line, arrows, point, width, … }, edited in place. isPoints: only color, point and labels apply.
  // hasDomain: the row's line stops at a domain, so it can show endpoints. hasAsymptotes: its curve has some to show.
  // isInequality: a coordinate grid row that shades a region; its boundary's line style follows its sign, its
  // arrows are its own (barrows), and it picks a fill.
  // colorOnly: a number line's row, whose line, arrows and circles carry meaning, so they can't change.
  // canLabel: its points can have labels (a sequence's terms can't). labelExample: a labeled point
  // with its coordinates, as the label style's second choice shows it.
  // hasArrows: its line can end in arrowheads (a figure's sides on the Transformations Editor can't).
  let {
    row, label, id, isPoints = false, hasDomain = false, hasAsymptotes = false, colorOnly = false, canLabel = true,
    labelExample = 'A(2, 3)', isInequality = false, hasArrows = true,
  }: {
    row: Styled; label: string; id: string; isPoints?: boolean; hasDomain?: boolean; hasAsymptotes?: boolean; colorOnly?: boolean
    canLabel?: boolean; labelExample?: string; isInequality?: boolean; hasArrows?: boolean
  } = $props()

  const arrowKey = $derived(isInequality ? 'barrows' : 'arrows')
  const arrows = $derived(hasArrows ? (row[arrowKey] ?? 'both') : 'none')
  // How much the miniature's line thickens or thins, as the figure's does.
  const WEIGHT: Record<Thickness, number> = { thin: 0.6, medium: 1, thick: 1.6 }
  const weight = $derived(WEIGHT[row.width ?? 'medium'])
  const labelKey = $derived(row.labels !== undefined ? 'labels' : row.names !== undefined ? 'names' : null)

  let open = $state(false)
  let root = $state<HTMLElement>()
  let trigger = $state<HTMLButtonElement>()
  let panel = $state<HTMLElement>()
  let pos = $state({ left: 0, top: 0 })

  const GAP = 6
  const EDGE = 8

  async function show() {
    open = true
    await tick()
    const r = trigger!.getBoundingClientRect()
    const h = panel!.offsetHeight
    const w = panel!.offsetWidth
    const below = r.bottom + GAP + h <= window.innerHeight - EDGE
    pos = {
      top: Math.max(EDGE, below ? r.bottom + GAP : r.top - GAP - h),
      left: Math.max(EDGE, Math.min(r.left, window.innerWidth - EDGE - w)),
    }
    panel!.querySelector<HTMLElement>('[aria-checked=true]')?.focus()
  }
  function hide(refocus = true) {
    open = false
    if (refocus) trigger?.focus()
  }
  function onpointerdown(event: PointerEvent) {
    if (open && !root!.contains(event.target as Node)) hide(false)
  }
  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      hide()
    }
  }
</script>

<svelte:window {onpointerdown} onresize={() => open && hide(false)} onscrollcapture={(e) => open && !panel?.contains(e.target as Node) && hide(false)} />

<!-- How this row looks on the figure, in miniature. -->
{#snippet preview()}
  {@const ink = COLORS[row.color]}
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    {#if isPoints}
      {#each [[7, 16], [17, 8]] as [x, y]}
        {#if row.point === 'cross'}
          <path d="M{x - 3.2},{y - 3.2} L{x + 3.2},{y + 3.2} M{x - 3.2},{y + 3.2} L{x + 3.2},{y - 3.2}" stroke={ink} stroke-width="2" stroke-linecap="round" />
        {:else}
          <circle cx={x} cy={y} r="3" fill={ink} />
        {/if}
      {/each}
    {:else if colorOnly}
      <!-- A number line's equation graph: a thick line from a closed circle, running off in an arrow. -->
      <line x1="6" y1="12" x2="15" y2="12" stroke={ink} stroke-width="3.2" />
      <path d="M22,12 L15,7.5 L15,16.5 z" fill={ink} />
      <circle cx="6" cy="12" r="3.4" fill={ink} />
    {:else}
      {@const left = arrows === 'both' || arrows === 'left'}
      {@const right = arrows === 'both' || arrows === 'right'}
      {#if isInequality}
        <!-- Its shaded region, below the boundary. -->
        {#if row.fill === 'hatch'}
          <path d="M8,20 L20,8 M14,20 L20,14" stroke={ink} stroke-width="1.4" />
        {:else}
          <path d="M3,21 L21,3 L21,21 z" fill={ink} fill-opacity="0.25" />
        {/if}
      {/if}
      <line
        x1={left ? 7.5 : 4} y1={left ? 16.5 : 20} x2={right ? 16.5 : 20} y2={right ? 7.5 : 4}
        stroke={ink} stroke-width={(!isInequality && row.line === 'dotted' ? 2.6 : 2.2) * weight}
        stroke-dasharray={isInequality ? undefined : row.line === 'dashed' ? '4 2.6' : row.line === 'dotted' ? '0.01 3.6' : undefined}
        stroke-linecap={!isInequality && row.line === 'dotted' ? 'round' : 'butt'}
      />
      {#if left}<path d="M3,21 L5.1,13.9 L10.1,18.9 z" fill={ink} />{/if}
      {#if right}<path d="M21,3 L18.9,10.1 L13.9,5.1 z" fill={ink} />{/if}
    {/if}
  </svg>
{/snippet}

{#snippet lineIcon(style: LineStyle)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
    <line
      x1="3" y1="6" x2="25" y2="6" stroke="currentColor" stroke-width="2.5"
      stroke-dasharray={style === 'dashed' ? '6 4' : style === 'dotted' ? '0.01 4.5' : undefined}
      stroke-linecap={style === 'dotted' ? 'round' : 'butt'}
    />
  </svg>
{/snippet}

{#snippet widthIcon(width: Thickness)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
    <line x1="3" y1="6" x2="25" y2="6" stroke="currentColor" stroke-width={2.5 * WEIGHT[width]} />
  </svg>
{/snippet}

{#snippet fillIcon(style: Fill)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
    <rect x="3" y="1" width="22" height="10" fill="none" stroke="currentColor" stroke-width="1" />
    {#if style === 'hatch'}
      <path d="M5,11 L15,1 M11,11 L21,1 M17,11 L25,3" stroke="currentColor" stroke-width="1.4" />
    {:else}
      <rect x="3" y="1" width="22" height="10" fill="currentColor" fill-opacity="0.3" />
    {/if}
  </svg>
{/snippet}

{#snippet pointIcon(style: PointStyle)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
    {#if style === 'cross'}
      <path d="M10,2 L18,10 M10,10 L18,2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    {:else}
      <circle cx="14" cy="6" r="4" fill="currentColor" />
    {/if}
  </svg>
{/snippet}

{#snippet endsIcon(style: Endpoints)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true" stroke="currentColor" stroke-width="2">
    {#if style === 'shown'}
      <line x1="7" y1="6" x2="21" y2="6" />
      <circle cx="5" cy="6" r="3" fill="currentColor" />
      <circle cx="23" cy="6" r="3" fill="#fff" />
    {:else}
      <line x1="3" y1="6" x2="25" y2="6" />
    {/if}
  </svg>
{/snippet}

{#snippet asymIcon(style: AsymptoteStyle)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true" fill="none" stroke="currentColor">
    <path d="M4,11 Q9,10 11,1" stroke-width="2" />
    <path d="M17,1 Q19,10 24,11" stroke-width="2" />
    {#if style === 'shown'}<line x1="14" y1="0" x2="14" y2="12" stroke-width="1.6" stroke-dasharray="0.01 3" stroke-linecap="round" />{/if}
  </svg>
{/snippet}

{#snippet arrowIcon(ends: Arrows)}
  <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true" fill="currentColor" stroke="currentColor" stroke-width="2">
    <line x1={ends === 'both' || ends === 'left' ? 8 : 3} y1="6" x2={ends === 'both' || ends === 'right' ? 20 : 25} y2="6" />
    {#if ends === 'both' || ends === 'left'}<path d="M2,6 L9,2 L9,10 z" stroke="none" />{/if}
    {#if ends === 'both' || ends === 'right'}<path d="M26,6 L19,2 L19,10 z" stroke="none" />{/if}
  </svg>
{/snippet}

<div class="row-style" bind:this={root}>
  <button
    bind:this={trigger}
    type="button"
    class="icon-btn outline"
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-label="Customize {label}"
    data-tip={open ? undefined : 'Customize'}
    onclick={() => (open ? hide() : show())}
  >
    {@render preview()}
  </button>

  {#if open}
    <div
      bind:this={panel}
      class="panel"
      role="dialog"
      tabindex="-1"
      aria-label="Customize {label}"
      style="left: {pos.left}px; top: {pos.top}px"
      {onkeydown}
    >
      <div class="group">
        <span class="name" id="{id}-color">Color</span>
        <div class="swatches" role="radiogroup" aria-labelledby="{id}-color">
          {#each (Object.entries(COLORS) as [Color, string][]) as [name, hex]}
            <button
              type="button"
              class="swatch"
              role="radio"
              aria-checked={row.color === name}
              aria-label={name}
              title={name[0].toUpperCase() + name.slice(1)}
              style="--swatch: {hex}"
              onclick={() => (row.color = name)}
            ></button>
          {/each}
        </div>
      </div>

      {#if isPoints}
        <div class="group">
          <span class="name" id="{id}-point">Point</span>
          <div class="segmented" role="radiogroup" aria-labelledby="{id}-point">
            {#each (Object.entries(POINT_STYLES) as [PointStyle, string][]) as [v, name]}
              <button type="button" role="radio" aria-checked={row.point === v} aria-label={name} title={name} class:on={row.point === v} onclick={() => (row.point = v)}>
                {@render pointIcon(v)}
              </button>
            {/each}
          </div>
        </div>

        {#if labelKey && canLabel}
          <div class="group">
            <span class="name" id="{id}-labels">Point labels <span class="hint">like {labelExample}</span></span>
            <div class="segmented" role="radiogroup" aria-labelledby="{id}-labels">
              {#each (Object.entries(LABEL_STYLES) as [LabelStyle, string][]) as [v, name]}
                <button type="button" role="radio" aria-checked={row[labelKey] === v} class="words" class:on={row[labelKey] === v} onclick={() => (row[labelKey] = v)}>
                  {v === 'name' ? 'A' : labelExample}<span class="visually-hidden"> ({name})</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      {:else if !colorOnly}
        {#if isInequality}
          <div class="group">
            <span class="name" id="{id}-fill">Shading</span>
            <div class="segmented" role="radiogroup" aria-labelledby="{id}-fill">
              {#each (Object.entries(FILLS) as [Fill, string][]) as [v, name]}
                <button type="button" role="radio" aria-checked={row.fill === v} aria-label={name} title={name} class:on={row.fill === v} onclick={() => (row.fill = v)}>
                  {@render fillIcon(v)}
                </button>
              {/each}
            </div>
          </div>
          <p class="note">The line is dashed for &lt; and &gt;, solid for ≤ and ≥.</p>
        {:else}
        <div class="group">
          <span class="name" id="{id}-line">Line</span>
          <div class="segmented" role="radiogroup" aria-labelledby="{id}-line">
            {#each (Object.entries(LINE_STYLES) as [LineStyle, string][]) as [v, name]}
              <button type="button" role="radio" aria-checked={row.line === v} aria-label={name} title={name} class:on={row.line === v} onclick={() => (row.line = v)}>
                {@render lineIcon(v)}
              </button>
            {/each}
          </div>
        </div>
        {/if}

        {#if row.width !== undefined}
          <div class="group">
            <span class="name" id="{id}-width">Thickness</span>
            <div class="segmented" role="radiogroup" aria-labelledby="{id}-width">
              {#each (Object.entries(THICKNESSES) as [Thickness, string][]) as [v, name]}
                <button type="button" role="radio" aria-checked={row.width === v} aria-label={name} title={name} class:on={row.width === v} onclick={() => (row.width = v)}>
                  {@render widthIcon(v)}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if hasDomain}
          <div class="group">
            <span class="name" id="{id}-ends">Endpoints</span>
            <div class="segmented" role="radiogroup" aria-labelledby="{id}-ends">
              {#each (Object.entries(ENDPOINTS) as [Endpoints, string][]) as [v, name]}
                <button type="button" role="radio" aria-checked={row.ends === v} aria-label={name} title={name} class:on={row.ends === v} onclick={() => (row.ends = v)}>
                  {@render endsIcon(v)}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if hasAsymptotes}
          <div class="group">
            <span class="name" id="{id}-asym">Asymptotes</span>
            <div class="segmented" role="radiogroup" aria-labelledby="{id}-asym">
              {#each (Object.entries(ASYMPTOTES) as [AsymptoteStyle, string][]) as [v, name]}
                <button type="button" role="radio" aria-checked={row.asym === v} aria-label={name} title={name} class:on={row.asym === v} onclick={() => (row.asym = v)}>
                  {@render asymIcon(v)}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if hasArrows}
        <div class="group">
          <span class="name" id="{id}-arrows">Arrows</span>
          <div class="segmented" role="radiogroup" aria-labelledby="{id}-arrows">
            {#each (Object.entries(ARROWS) as [Arrows, string][]) as [v, name]}
              <button type="button" role="radio" aria-checked={arrows === v} aria-label={name} title={name} class:on={arrows === v} onclick={() => (row[arrowKey] = v)}>
                {@render arrowIcon(v)}
              </button>
            {/each}
          </div>
        </div>
        {/if}
      {/if}

      {#if row.values !== undefined}
        <div class="group">
          <span class="name" id="{id}-values">Values <span class="hint">above the line</span></span>
          <div class="segmented" role="radiogroup" aria-labelledby="{id}-values">
            {#each (Object.entries(VALUE_STYLES) as [ValueStyle, string][]) as [v, name]}
              <button type="button" role="radio" aria-checked={row.values === v} class="text" class:on={row.values === v} onclick={() => (row.values = v)}>
                {v === 'shown' ? 'Write' : 'None'}<span class="visually-hidden"> ({name})</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Outlined, so it reads as its own control, apart from the plain × at the row's end. */
  /* As tall as the math field beside it (square on one line), always as wide, so
     the fields line up down the list even when one holds a stacked fraction. */
  .row-style { display: flex; align-self: stretch; }
  .outline { width: 2.86rem; height: auto; border: 1.5px solid var(--border); border-radius: 10px; background: #fff; }
  .outline:hover:not(:disabled), .outline[aria-expanded='true'] { border-color: var(--blue-border); background: var(--blue-soft); }
  .panel {
    position: fixed;
    z-index: 60;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 12px 32px -8px rgb(17 24 39 / 25%);
  }
  .group { display: flex; flex-direction: column; gap: 0.35rem; }
  .name { font-size: 0.75rem; font-weight: 700; color: var(--muted); }
  .swatches { display: flex; gap: 0.4rem; }
  .swatch {
    width: 1.6rem;
    height: 1.6rem;
    padding: 0;
    border: 2px solid #fff;
    border-radius: 6px;
    background: var(--swatch);
    box-shadow: 0 0 0 1px var(--border);
    cursor: pointer;
  }
  .swatch[aria-checked='true'] { box-shadow: 0 0 0 2px var(--blue); }
  .swatch:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--blue), 0 0 0 4px var(--blue-border); }
  .segmented button { display: inline-grid; place-items: center; padding: 0.3rem 0.45rem; }
  .segmented button.text { display: inline-block; padding: 0.3rem 0.6rem; font-size: 0.82rem; font-weight: 700; }
  .segmented button.words { display: inline-block; padding: 0.3rem 0.6rem; font: italic 700 0.9rem 'Times New Roman', Times, serif; }
  .name .hint { font-weight: 400; }
  .note { max-width: 13rem; margin: -0.2rem 0 0; font-size: 0.75rem; color: var(--muted); }
</style>
