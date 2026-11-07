<script lang="ts">
  // The card every generator shows its figure in: an icon toolbar for getting
  // the figure out (copy, download, link) and undo/redo, above the figure
  // itself. `svg` is the rendered figure to export (when it isn't given, the
  // first <svg> inside the card is); `history` comes from createHistory.
  // `labelSize`, bound to the generator's setting, adds the label size picker,
  // beside the export buttons it matters for. Status messages appear as a
  // toast over the figure. Printing prints just the figure, the width of a
  // letter page unless the page sets --print-width (and --print-height).
  // `share` is false for a figure the page address doesn't hold, which has no link to share.
  // `tools` adds a page's own buttons after undo and redo, and `end` its own at the far right, after the label size.
  import { Copy, FileDown, ImageDown, Redo2, Share, Undo2 } from '@lucide/svelte'
  import type { Snippet } from 'svelte'
  import { copyPng, downloadPng, downloadSvg } from './exporting'
  import type { createHistory } from './history.svelte'
  import { LABEL_SIZES, type LabelSize } from './labelSize'

  interface Props {
    svg?: SVGSVGElement
    filename: string
    history: ReturnType<typeof createHistory>
    labelSize?: LabelSize
    share?: boolean
    tools?: Snippet
    end?: Snippet
    children: Snippet
  }
  let { svg, filename, history, labelSize = $bindable(), share = true, tools, end, children }: Props = $props()

  const LABEL_ORDER: LabelSize[] = ['large', 'medium', 'small']
  const GLYPH: Record<LabelSize, number> = { large: 20, medium: 15, small: 11 }

  let sheet = $state<HTMLElement>()
  const figure = () => svg ?? sheet?.querySelector('svg') ?? undefined

  let status = $state('')
  let statusTimer: ReturnType<typeof setTimeout> | undefined
  function flash(msg: string) {
    status = msg
    clearTimeout(statusTimer)
    statusTimer = setTimeout(() => (status = ''), 2200)
  }

  async function copyImage() {
    const el = figure()
    if (!el) return
    try {
      await copyPng(el)
      flash('Image copied. Paste it into your document.')
    } catch {
      flash('Your browser blocked copying. Try downloading a PNG instead.')
    }
  }
  async function shareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      flash('Link copied. Share it, and anyone who opens it sees this exact figure.')
    } catch {
      flash('Copy the address bar to share this figure.')
    }
  }
</script>

<svelte:window onkeydown={history.onkeydown} />

<div class="card canvas">
  <div class="toolbar no-print" role="toolbar" aria-label="Figure actions">
    <button class="icon-btn" aria-label="Copy image" data-tip="Copy image" onclick={copyImage}><Copy size={19} /></button>
    <button class="icon-btn" aria-label="Download PNG" data-tip="Download PNG" onclick={() => figure() && downloadPng(figure()!, `${filename}.png`)}><ImageDown size={19} /></button>
    <button class="icon-btn" aria-label="Download SVG" data-tip="Download SVG" onclick={() => figure() && downloadSvg(figure()!, `${filename}.svg`)}><FileDown size={19} /></button>
    {#if share}<button class="icon-btn" aria-label="Share link" data-tip="Share link" onclick={shareLink}><Share size={19} /></button>{/if}
    <span class="divider"></span>
    <button class="icon-btn" aria-label="Undo" data-tip="Undo" disabled={!history.canUndo} onclick={history.undo}><Undo2 size={19} /></button>
    <button class="icon-btn" aria-label="Redo" data-tip="Redo" disabled={!history.canRedo} onclick={history.redo}><Redo2 size={19} /></button>
    {#if tools}<span class="divider"></span>{@render tools()}{/if}
    {#if labelSize !== undefined}
      <!-- Three buttons, each an "A" drawn at its size: large, medium, small. -->
      <div class="label-size" role="radiogroup" aria-label="Label size, for how big text prints">
        {#each LABEL_ORDER as v (v)}
          <button
            type="button" role="radio" class="size" class:on={labelSize === v} aria-checked={labelSize === v}
            aria-label="{LABEL_SIZES[v]} labels" data-tip="{LABEL_SIZES[v]} labels" onclick={() => (labelSize = v)}
          ><span style="font-size: {GLYPH[v]}px" aria-hidden="true">A</span></button>
        {/each}
      </div>
    {/if}
    {#if end}<div class="end">{@render end()}</div>{/if}
  </div>
  <div class="sheet" bind:this={sheet}>
    {@render children()}
    <p class="status no-print" class:shown={status} aria-live="polite">{status}</p>
  </div>
</div>

<style>
  .canvas { display: flex; flex-direction: column; }
  .toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 0.3rem; padding: 0.45rem; border-bottom: 1px solid var(--border); }
  .divider { width: 1px; height: 1.6rem; background: var(--border); margin: 0 0.3rem; }
  .end { margin-left: auto; display: inline-flex; align-items: center; gap: 0.3rem; }
  .label-size + .end { margin-left: 0.4rem; }
  .label-size { margin-left: auto; display: inline-flex; gap: 2px; padding: 3px; border-radius: 10px; background: var(--bg); }
  .size {
    display: inline-grid; place-items: center; width: 2.1rem; height: 1.9rem; padding: 0; border: 0; border-radius: 8px;
    background: transparent; color: var(--muted); line-height: 1; cursor: pointer;
  }
  /* Only the A is in serif, not the button's tooltip. */
  .size span { font-family: 'Times New Roman', Times, serif; }
  .size:hover { color: var(--ink); }
  .size.on { background: #fff; color: var(--blue); box-shadow: 0 1px 2px rgb(17 24 39 / 12%); }
  @media (max-width: 480px) {
    .divider { display: none; }
    .toolbar { justify-content: space-between; gap: 0.15rem; padding: 0.35rem; }
    .toolbar :global(.icon-btn) { width: 2.15rem; height: 2.15rem; }
  }
  .sheet { position: relative; padding: 1rem; display: flex; justify-content: center; }
  .sheet :global(svg) { max-height: 74vh; width: auto; max-width: 100%; }
  .status {
    position: absolute; left: 50%; bottom: 0.9rem; transform: translate(-50%, 0.4rem);
    max-width: calc(100% - 2rem); margin: 0; padding: 0.45rem 0.85rem; border-radius: 999px;
    background: var(--ink); color: #fff; font-weight: 600; font-size: 0.86rem; text-align: center;
    opacity: 0; pointer-events: none; transition: opacity 0.15s, transform 0.15s;
  }
  .status.shown { opacity: 1; transform: translate(-50%, 0); }

  /* Wide screens: the card fills the space beside the settings and the figure
     shrinks to fit it (see the generator's page layout). */
  @media (min-width: 861px) and (min-height: 560px) {
    .canvas { flex: 1; min-height: 0; }
    .sheet { flex: 1; min-height: 0; }
    .sheet :global(svg) { width: 100%; height: 100%; max-height: none; }
  }

  @media print {
    @page { size: letter portrait; margin: 0.5in; }
    .canvas { border: none; box-shadow: none; }
    .sheet { display: block; width: var(--print-width, 7.5in); padding: 0; break-inside: avoid; }
    .sheet :global(svg) { width: 100%; height: var(--print-height, auto); max-height: none; }
  }
</style>
