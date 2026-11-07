<script lang="ts">
  // The Transformations Editor's directory card: a triangle reflected over
  // y = x, drawn by the same code the editor uses.
  import Figure from './Figure.svelte'
  import { gridDefaults } from '$lib/grid/settings.js'
  import { emptyDrawing, type Drawing } from './drawing.js'
  import { buildFigure } from './figure.js'

  const d: Drawing = {
    ...emptyDrawing(),
    grid: gridDefaults({ xFrom: '-6', xTo: '6', yFrom: '-6', yTo: '6', xEvery: 2, yEvery: 2 }),
    vertices: [{ x: 1, y: 3 }, { x: 3, y: 5 }, { x: 1, y: 5 }],
    names: ['A', 'B', 'C'],
    closed: true,
    steps: [
      {
        id: 'r', step: { kind: 'reflection', line: { kind: 'diagonal', slope: 1, b: 0 } },
        look: { color: 'blue', line: 'dashed', width: 'medium' }, shown: true,
      },
    ],
  }
  const f = buildFigure(d)
</script>

<Figure {f} settings={d.grid} label="A triangle reflected over y = x" id="preview-transformations" />
