<script lang="ts">
  // An organic structure in one view, from what drawView worked out: bonds,
  // labels with subscripts, chiral centers' asterisks, carbon numbers and the
  // caption, in page units.
  // While editing, each atom and bond (and, for dragging, each of the full
  // structural formula's added hydrogens) also gets a wider invisible target
  // to press, and atoms their highlights and marks (selected, overbonded, a
  // carbon the skeletal formula hides); those are marked data-no-export so
  // they stay out of copied and downloaded pictures.
  import { BOND_NAMES, type Atom, type Bond, type OrganicStructure } from './structure'
  import { CAPTION_FONT, FONT, NUMBER_FONT, STAR_FONT, SUB_DROP, SUB_FONT, type AddedHydrogen, type Drawn, type Run } from './view'

  interface Props {
    structure: OrganicStructure
    drawn: Drawn
    /** atoms to highlight, and whether as selected or about to be deleted */
    selected?: string[]
    deleting?: boolean
    /** the atom a bond is being drawn from */
    from?: string | null
    onatomdown?: (event: PointerEvent, atom: Atom) => void
    onbonddown?: (event: PointerEvent, bond: Bond) => void
    /** the full structural formula's added hydrogens can be pressed only with this */
    onhydrogendown?: (event: PointerEvent, hydrogen: AddedHydrogen) => void
  }
  let { structure, drawn, selected = [], deleting = false, from = null, onatomdown, onbonddown, onhydrogendown }: Props = $props()

  const INK = '#111'
  const editing = $derived(!!onatomdown)
  const byId = $derived(new Map(structure.atoms.map((a) => [a.id, a])))
  const bondById = $derived(new Map(structure.bonds.map((b) => [b.id, b])))

  /** How far each run moves up or down: subscripts drop, and what follows comes back up. */
  const shifts = (runs: Run[]) => runs.map((r, i) => (r.sub === !!runs[i - 1]?.sub ? 0 : r.sub ? SUB_DROP : -SUB_DROP))
</script>

{#each drawn.bonds as drawnBond, i (drawnBond.bondId ?? `h${i}`)}
  {@const bond = drawnBond.bondId ? bondById.get(drawnBond.bondId) : undefined}
  {@const a = bond && byId.get(bond.a)}
  {@const b = bond && byId.get(bond.b)}
  <g class="bond" class:target={!!bond} role="presentation" onpointerdown={(e) => bond && onbonddown?.(e, bond)}>
    {#if editing && bond && a && b}
      <line data-no-export x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" stroke-width="22">
        <title>{BOND_NAMES[bond.order]} bond</title>
      </line>
    {/if}
    {#each drawnBond.lines as l, j (j)}
      <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={INK} stroke-width="2.5" stroke-linecap="round" />
    {/each}
  </g>
{/each}

{#each drawn.labels as label, i (label.atomId ?? `h${i}`)}
  {@const dys = shifts(label.runs)}
  <text class="label" x={label.x} y={label.y} dy="0.35em" font-size={FONT} fill={INK}>
    {#each label.runs as run, j (j)}<tspan font-size={run.sub ? SUB_FONT : undefined} dy={dys[j] || undefined}>{run.text}</tspan>{/each}
  </text>
{/each}

{#each drawn.numbers as n (n.atomId)}
  <text class="label" x={n.x} y={n.y} dy="0.35em" text-anchor="middle" font-size={NUMBER_FONT} fill={INK}>{n.n}</text>
{/each}

{#each drawn.stars as star (star.atomId)}
  <text class="label" x={star.x} y={star.y} dy="0.35em" text-anchor="middle" font-size={STAR_FONT} fill={INK}>*</text>
{/each}

{#if drawn.caption}
  <text class="label" x={drawn.caption.x} y={drawn.caption.y} text-anchor="middle" font-size={CAPTION_FONT} fill={INK}>{drawn.caption.text}</text>
{/if}

{#if editing && onhydrogendown}
  {#each drawn.hydrogens as h (`${h.atomId}-${h.index}`)}
    <circle data-no-export class="hydrogen target" cx={h.x} cy={h.y} r="15" fill="transparent" role="presentation" onpointerdown={(e) => onhydrogendown(e, h)} />
  {/each}
{/if}

{#if editing}
  {#each structure.atoms as atom (atom.id)}
    {@const on = selected.includes(atom.id)}
    <g data-no-export class="atom" role="presentation" onpointerdown={(e) => onatomdown?.(e, atom)}>
      <circle
        cx={atom.x}
        cy={atom.y}
        r="20"
        class="target"
        class:on
        fill={on ? (deleting ? 'var(--red-soft)' : 'rgba(37, 99, 235, 0.14)') : 'transparent'}
        stroke={on ? (deleting ? 'var(--red)' : 'var(--blue)') : from === atom.id ? 'var(--amber)' : 'none'}
        stroke-width="2"
      />
      {#if drawn.overbonded.includes(atom.id)}
        <circle cx={atom.x} cy={atom.y} r="17" fill="none" stroke="var(--red)" stroke-width="2.5" pointer-events="none" />
      {/if}
      {#if drawn.hidden.includes(atom.id)}
        <circle cx={atom.x} cy={atom.y} r="6" fill="var(--amber)" pointer-events="none" />
      {/if}
    </g>
  {/each}
{/if}

<style>
  .label { user-select: none; pointer-events: none; }
  .atom:hover .target:not(.on), .hydrogen:hover { fill: rgba(37, 99, 235, 0.1); }
</style>
