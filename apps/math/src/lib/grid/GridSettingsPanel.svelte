<script lang="ts">
  // The grid settings as one block of settings groups: titles, the x-axis, the
  // y-axis and the gridlines. Every Math page with a coordinate grid shows
  // exactly this, so a grid option added here appears on all of them.
  // `xExtras` and `xChildren` let a page add its own lines to the x-axis group
  // (the Coordinate Grid Generator's angle unit). `s`, bound to the page's own
  // settings state, is changed in place by the groups.
  import type { Snippet } from 'svelte'
  import AxisSettings from '$shared/graph/AxisSettings.svelte'
  import GridlineSettings from '$shared/graph/GridlineSettings.svelte'
  import TitleSettings from '$shared/graph/TitleSettings.svelte'
  import MathInput from '$lib/shared/MathInput.svelte'
  import { readAxes, type GridOptions } from './settings.js'

  interface Props {
    s: GridOptions
    placeholders?: { title: string; xTitle: string; yTitle: string }
    xExtras?: string[]
    xChildren?: Snippet
  }
  let {
    s = $bindable(),
    placeholders = { title: 'Distance over time', xTitle: 'Time (hours)', yTitle: 'Distance (km)' },
    xExtras = [],
    xChildren,
  }: Props = $props()

  const axes = $derived(readAxes(s))
</script>

<TitleSettings
  bind:title={s.title} bind:titleMode={s.titleMode} bind:xTitle={s.xTitle} bind:xTitleMode={s.xTitleMode}
  bind:yTitle={s.yTitle} bind:yTitleMode={s.yTitleMode}
  {placeholders}
/>

<AxisSettings
  axis="x" read={axes.x} problems={axes.problems} field={MathInput} extras={xExtras}
  bind:from={s.xFrom} bind:to={s.xTo} bind:step={s.xStep} bind:every={s.xEvery}
  bind:labelMode={s.xLabelMode} bind:label={s.xLabel} bind:startCap={s.xStartCap} bind:endCap={s.xEndCap}
>
  {@render xChildren?.()}
</AxisSettings>
<AxisSettings
  axis="y" read={axes.y} problems={axes.problems} field={MathInput}
  bind:from={s.yFrom} bind:to={s.yTo} bind:step={s.yStep} bind:every={s.yEvery}
  bind:labelMode={s.yLabelMode} bind:label={s.yLabel} bind:startCap={s.yStartCap} bind:endCap={s.yEndCap}
/>

<GridlineSettings bind:minor={s.minor} bind:gridlines={s.gridlines} />
