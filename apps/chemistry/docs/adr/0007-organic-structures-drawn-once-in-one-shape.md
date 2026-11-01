# Organic structures are drawn once, in one shape, and every view uses it

The teacher draws only an organic structure's carbons and other atoms (no hydrogen on them), and the editor works out each atom's hydrogens from its usual valence. The skeletal formula, carbon skeleton, condensed formula and full structural formula are all drawn from that one organic structure in the shape the teacher drew it; no view moves an atom. So a chain drawn as a zigzag (right for a skeletal formula) gets its full structural formula's hydrogens splayed into the open gaps, not the textbook straight chain with hydrogens above and below, and a chain drawn straight (right for a full structural formula) hides its middle carbons in the skeletal formula, which the editor points out while editing. Zigzag and Straighten buttons, redrawing chains with no rings in the other style, are the planned way between the two.

## Considered Options

- **Lay the organic structure out again for each view**: one drawing would be textbook-shaped in every view, but 2D layout is a research-grade problem once rings and branches meet, and the teacher would lose control of the shape they drew.
- **A chemistry library such as RDKit.js** for layout: large WebAssembly (see ADR 0003), and its layout is the splayed ChemDraw style, not the right-angled classroom one either.
- **A separate shape for each view**: every view could be perfect, but the teacher would draw the molecule up to four times, which is what both teachers asked not to do.
- **Hydrogens drawn by hand** (as the first version of the editor did): no view could hide or condense them without working out which were which, and a hexane took 20 atoms and 19 bonds.

## Consequences

A teacher picks the shape for the view they use most, and the other views follow it. Drawings saved by the first version (hydrogens drawn by hand) are dropped rather than converted, since that version was never released.
