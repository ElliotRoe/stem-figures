# Grid settings stay Math-only

The Coordinate Grid Generator and the Transformations Editor draw the same coordinate grid with the same options (ranges, numbering, titles, axis labels, end caps, minor gridlines and gridlines), so those options live in one module, `apps/math/src/lib/grid/`, which both pages build on: a new grid option added there reaches both at once. That module stays in the Math app rather than `packages/shared`, even though Chemistry, Biology and Physics also draw grids, because those sites only share the low-level grid drawing (`$shared/graph`), each with its own fixed set of options, and anything in `packages/shared` changes every site that imports it, so each change there means checking and building every site.

## Considered Options

- **`packages/shared`**: one module for every site's grids, but each change would ripple to sites that don't offer these options, and those sites' graphs (titration curves, motion graphs) don't want a teacher-editable grid.
- **Each page keeps its own copy**: nothing to extract, but the Transformations Editor's grid would drift from the Coordinate Grid Generator's every time an option is added, which is what teachers would notice first.

## Consequences

- Each page sets its own starting values (the Coordinate Grid Generator starts at 0 to 15, the Transformations Editor at −10 to 10); only the options and how they're read are shared.
- If another site ever wants the teacher-editable grid, move this module to `packages/shared` then, not before.
