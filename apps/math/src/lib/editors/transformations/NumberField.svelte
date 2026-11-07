<script lang="ts">
  // A number typed the way a teacher writes it: −3, 2.5 or 1/2. Like a
  // number box in Figma, dragging across it left or right changes the value
  // by `step` every few pixels; a click without dragging types instead. While
  // it has the focus it keeps what was typed, changes the value as soon as
  // the text reads as a number (and `accept` takes it), and goes back to the
  // value when it loses the focus. `onhold` says when a drag starts and ends,
  // so the whole drag can be one step to undo.
  import { parseNumber } from '$lib/shared/math.js'
  import { numberText } from './transform.js'

  interface Props {
    value: number
    label: string
    onchange: (v: number) => void
    /** Whether a number may be used (a scale factor must be above 0). */
    accept?: (v: number) => boolean
    /** How much each step of a drag changes the value. */
    step?: number
    onhold?: (on: boolean) => void
    id?: string
    /** The narrowest it gets; it widens to fit a longer number, like −12 or 150. */
    width?: string
  }
  let { value, label, onchange, accept = () => true, step = 1, onhold, id, width = '3.6rem' }: Props = $props()

  const read = (text: string) => parseNumber(text.replace(/−/g, '-'))
  const ok = (v: number | null): v is number => v !== null && Number.isFinite(v) && accept(v)
  /** Pixels of drag per step. */
  const PER_STEP = 8

  let input = $state<HTMLInputElement>()
  let focused = $state(false)
  let typed = $state('')
  const shown = $derived(focused ? typed : numberText(value))
  const bad = $derived(focused && typed.trim() !== '' && !ok(read(typed)))

  let scrub = $state<{ pointerId: number; x: number; from: number; moved: boolean } | null>(null)

  function down(e: PointerEvent) {
    if (focused || e.button !== 0) return
    e.preventDefault()
    input!.setPointerCapture(e.pointerId)
    scrub = { pointerId: e.pointerId, x: e.clientX, from: value, moved: false }
  }
  function move(e: PointerEvent) {
    if (!scrub || e.pointerId !== scrub.pointerId) return
    const dx = e.clientX - scrub.x
    if (!scrub.moved) {
      if (Math.abs(dx) < 3) return
      scrub.moved = true
      onhold?.(true)
    }
    const v = Number((scrub.from + Math.round(dx / PER_STEP) * step).toFixed(9))
    if (v !== value && ok(v)) onchange(v)
  }
  function up(e: PointerEvent) {
    if (!scrub || e.pointerId !== scrub.pointerId) return
    const moved = scrub.moved
    scrub = null
    if (moved) onhold?.(false)
    else {
      // A click: type into it, with what's there selected.
      input!.focus()
      input!.select()
    }
  }
</script>

<input
  bind:this={input}
  {id}
  class="number"
  class:scrubbing={scrub?.moved}
  style:width={`max(${width}, calc(${[...shown].length}ch + 1.1rem))`}
  type="text"
  inputmode="decimal"
  autocomplete="off"
  aria-label={label}
  aria-invalid={bad}
  title={focused ? undefined : 'Drag left or right to change, or click to type'}
  value={shown}
  onpointerdown={down}
  onpointermove={move}
  onpointerup={up}
  onpointercancel={up}
  onfocus={() => {
    typed = numberText(value)
    focused = true
  }}
  oninput={(e) => {
    typed = e.currentTarget.value
    const v = read(typed)
    if (ok(v) && v !== value) onchange(v)
  }}
  onblur={() => (focused = false)}
  onkeydown={(e) => {
    if (e.key === 'Enter') e.currentTarget.blur()
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const v = Number((value + (e.key === 'ArrowUp' ? step : -step)).toFixed(9))
      if (ok(v)) {
        onchange(v)
        typed = numberText(v)
      }
    }
  }}
/>

<style>
  .number {
    padding: 0.3rem 0.4rem; border: 1.5px solid var(--border); border-radius: 8px; background: #fff;
    font: inherit; font-size: 0.9rem; font-variant-numeric: tabular-nums; text-align: center;
    cursor: ew-resize; touch-action: none;
  }
  .number:focus { outline: none; border-color: var(--blue); cursor: text; }
  .number.scrubbing { border-color: var(--blue); background: var(--blue-soft); }
  .number[aria-invalid='true'] { border-color: var(--red); }
</style>
