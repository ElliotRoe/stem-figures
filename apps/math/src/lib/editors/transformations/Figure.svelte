<script lang="ts">
  // A Transformations figure as it prints: the coordinate grid, then the
  // preimage and images (kept inside the grid), lines of reflection, centers,
  // translation arrows and point labels. `overlay` adds the editor's own
  // handles and hints on top, each marked data-no-export so it never prints.
  import type { Snippet } from 'svelte'
  import Grid from '$shared/graph/Grid.svelte'
  import { SANS, SERIF } from '$shared/graph/grid'
  import type { GridOptions } from '$lib/grid/settings.js'
  import type { FigureLayout } from './figure.js'

  interface Props {
    f: FigureLayout
    settings: GridOptions
    label: string
    svg?: SVGSVGElement
    /** Prefixes the ids in the drawing, which have to be unique on the page. */
    id?: string
    overlay?: Snippet
  }
  let { f, settings, label, svg = $bindable(), id = 'tf', overlay }: Props = $props()
</script>

<Grid layout={f} {settings} {id} bind:svg {label} gridlines={settings.gridlines}>
  <defs>
    <clipPath id="{id}-inside"><rect x={f.grid.x} y={f.grid.y} width={f.grid.w} height={f.grid.h} /></clipPath>
  </defs>
  <g clip-path="url(#{id}-inside)">
    {#each f.lines as l (l.key)}
      <path d={l.d} fill="none" stroke={l.color} stroke-width="2.6" stroke-dasharray="10 6" />
      {#each l.heads as d}<path {d} fill={l.color} />{/each}
    {/each}
    {#each f.arrows as a (a.key)}
      <path d={a.d} fill="none" stroke={a.color} stroke-width="2" />
      <path d={a.head} fill={a.color} />
    {/each}
    {#each f.polys as p (p.key)}
      {#if p.d}
        <path d={p.d} fill="none" stroke={p.color} stroke-width={p.width} stroke-dasharray={p.dash} stroke-linecap={p.cap} stroke-linejoin="round" />
      {/if}
      {#each p.dots as q}<circle cx={q.x} cy={q.y} r={p.r} fill={p.color} />{/each}
    {/each}
    {#each f.centers as c (c.key)}
      <circle cx={c.x} cy={c.y} r="5" fill="#fff" stroke={c.color} stroke-width="2.4" />
      <circle cx={c.x} cy={c.y} r="1.8" fill={c.color} />
    {/each}
  </g>

  <!-- Point labels: the letter in italic serif, like the coordinate grid's; coordinates upright. -->
  <g font-size={f.nameFs} font-weight="bold" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round">
    {#each f.pointLabels as l (l.key)}
      <text x={l.x} y={l.y} fill={l.color} text-anchor={l.anchor} data-label={l.key}
        ><tspan font-family={SERIF} font-style="italic">{l.name}</tspan
        >{#if l.coords}<tspan font-family={SANS} font-size={f.fs}>{l.coords}</tspan>{/if}</text
      >
    {/each}
  </g>

  {@render overlay?.()}
</Grid>
