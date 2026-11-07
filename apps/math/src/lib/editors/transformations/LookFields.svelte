<script lang="ts">
  // How a figure's sides are drawn, laid out in full rather than behind a
  // button: its color, a solid, dashed or dotted line, and how thick.
  import { COLORS, type Color } from '$shared/graph/colors'
  import { LINE_STYLES, THICKNESSES, type LineStyle, type Thickness } from '$lib/shared/rowStyle.js'
  import type { Look } from './drawing.js'

  interface Props {
    look: Look
    id: string
    /** Call before a change, so each is a step of its own to undo. */
    act: () => void
  }
  let { look = $bindable(), id, act }: Props = $props()

  const WEIGHT: Record<Thickness, number> = { thin: 0.6, medium: 1, thick: 1.6 }
  function set(patch: Partial<Look>) {
    act()
    look = { ...look, ...patch }
  }
</script>

<div class="look">
  <div class="row">
    <span class="name" id="{id}-color">Color</span>
    <div class="swatches" role="radiogroup" aria-labelledby="{id}-color">
      {#each Object.entries(COLORS) as [name, hex]}
        <button type="button" class="swatch" role="radio" aria-checked={look.color === name} aria-label={name} title={name[0].toUpperCase() + name.slice(1)}
          style:--swatch={hex} onclick={() => set({ color: name as Color })}></button>
      {/each}
    </div>
  </div>
  <div class="row">
    <span class="name" id="{id}-line">Line</span>
    <div class="segmented" role="radiogroup" aria-labelledby="{id}-line">
      {#each Object.entries(LINE_STYLES) as [v, name]}
        <button type="button" role="radio" aria-checked={look.line === v} aria-label={name} title={name} class:on={look.line === v} onclick={() => set({ line: v as LineStyle })}>
          <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
            <line x1="3" y1="6" x2="25" y2="6" stroke="currentColor" stroke-width="2.5"
              stroke-dasharray={v === 'dashed' ? '6 4' : v === 'dotted' ? '0.01 4.5' : undefined} stroke-linecap={v === 'dotted' ? 'round' : 'butt'} />
          </svg>
        </button>
      {/each}
    </div>
  </div>
  <div class="row">
    <span class="name" id="{id}-width">Thickness</span>
    <div class="segmented" role="radiogroup" aria-labelledby="{id}-width">
      {#each Object.entries(THICKNESSES) as [v, name]}
        <button type="button" role="radio" aria-checked={look.width === v} aria-label={name} title={name} class:on={look.width === v} onclick={() => set({ width: v as Thickness })}>
          <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
            <line x1="3" y1="6" x2="25" y2="6" stroke="currentColor" stroke-width={2.5 * WEIGHT[v as Thickness]} />
          </svg>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .look { display: flex; flex-direction: column; gap: 0.5rem; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
  .name { font-size: 0.86rem; font-weight: 600; color: var(--muted); }
  .swatches { display: flex; gap: 0.3rem; }
  .swatch {
    width: 1.5rem; height: 1.5rem; padding: 0; border: 2px solid #fff; border-radius: 50%; background: var(--swatch);
    box-shadow: 0 0 0 1.5px var(--border); cursor: pointer;
  }
  .swatch[aria-checked='true'] { box-shadow: 0 0 0 2px var(--blue); }
  .segmented button { display: grid; place-items: center; min-width: 2.6rem; }
</style>
