<script lang="ts">
  // The Organic Structure Editor's directory card: 2-phenylethanol's skeletal
  // formula, drawn the way the editor draws it. Its ids are fixed so the
  // server's and browser's pictures match.
  import StructureDrawing from './StructureDrawing.svelte'
  import { step, type Atom, type Bond, type OrganicStructure } from './structure'
  import { drawView } from './view'

  const center = { x: 300, y: 300 }
  const ring: Atom[] = Array.from({ length: 6 }, (_, k) => ({ id: `r${k}`, element: 'C', ...step(center, -90 + k * 60) }))
  const a: Atom = { id: 'a', element: 'C', ...step(ring[1], 330) }
  const b: Atom = { id: 'b', element: 'C', ...step(a, 30) }
  const o: Atom = { id: 'o', element: 'O', ...step(b, 330) }
  const bond = (x: string, y: string, order: Bond['order'] = 1): Bond => ({ id: `${x}-${y}`, a: x, b: y, order })
  const structure: OrganicStructure = {
    atoms: [...ring, a, b, o],
    bonds: [...ring.map((r, k) => bond(r.id, ring[(k + 1) % 6].id, k % 2 ? 1 : 2)), bond('r1', 'a'), bond('a', 'b'), bond('b', 'o')],
  }
  const drawn = drawView(structure, { view: 'skeletal', labelEnds: false, labelRings: true, acids: false, reverseLeft: true, numbering: false, flip: false, caption: '' })
  const crop = drawn.crop!
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="{crop.x} {crop.y} {crop.width} {crop.height}" font-family="Arial, Helvetica, sans-serif">
  <StructureDrawing {structure} {drawn} />
</svg>
