# Math Figures

Math Figures (mathfigures.com) is a directory of generators that make clean,
printable math figures for teachers to paste into tests, worksheets and
slides. It is a teacher.dev project.

## Language

### The directory

**Figure**:
A finished math picture a teacher puts in front of students, such as a coordinate grid or a number line.
_Avoid_: Graphic, image, visual, resource

**Generator**:
A page that makes one kind of figure from a teacher's settings, named "<Figure> Generator".
_Avoid_: Maker, tool, builder, app

**Editor**:
A page where the teacher builds a figure by hand on a canvas, rather than from settings, named "<Figure> Editor". It's listed in the directory like a generator, tagged Editor. Its figure is kept in the teacher's browser, never in the page address, so it has no links to share. Most fill the window with a way home of their own; the Transformations Editor, with as many settings as a generator, is laid out like one.
_Avoid_: Builder, drawing tool, generator (for this kind of page)

**Directory**:
The home page, which lists every generator with a live preview of its figure.
_Avoid_: Catalog, gallery, index

**Label size**:
How big a figure's text is compared to its lines: small, medium or large, one setting on every generator, set beside the export buttons. Medium is how figures have always looked; large keeps labels readable once a figure is shrunk to fit a worksheet.
_Avoid_: Font size, text size, zoom, scale

**Generator request**:
A teacher asking for a kind of figure that no generator makes yet.
_Avoid_: Feature request, suggestion

### Coordinate grids

**Coordinate Grid**:
A figure of square blocks with an x-axis and a y-axis, for plotting points and lines. Its generator is the Coordinate Grid Generator.
_Avoid_: Graph, graph paper, coordinate plane (fine as search words, not as the name)

**Chart title**:
The title across the top of a figure.
_Avoid_: Title (alone), heading

**Axis title**:
Text that runs along an axis to say what it measures, such as "Time (hours)". It can be written text or a blank line for students.
_Avoid_: Axis label, axis name

**Axis label**:
The short name at an axis's arrow tip, such as x or y.
_Avoid_: Axis title, variable

**End cap**:
How one end of an axis finishes: a triangle arrow, a line arrow, a circle or nothing. Each end of a line in a Parallel Lines and Transversal has one too, where the circle is a dot marking where a ray or segment stops.
_Avoid_: Arrow (alone), arrowhead, tip

**Preset**:
A named set of settings for one generator, saved by the teacher in their browser. None are built in.
_Avoid_: Template, favorite

**Range**:
The stretch of numbers an axis covers, set as From, To and Step (such as −2 to 5 by 1). Both the Coordinate Grid and the Number Line use it.
_Avoid_: Domain, interval, window, start and blocks

**Numbering**:
How the numbers under the ticks are written: decimals, fractions, multiples of π or degrees. It isn't a setting; it follows how the teacher typed the range, so a range typed with π is numbered in π and one typed with ° is numbered in degrees.
_Avoid_: Format, label style

**Minor gridline**:
A thin, faint, unnumbered line that splits each block of a coordinate grid into 2, 4 or 5 parts. A grid has none unless the teacher picks a number.
_Avoid_: Subdivision, fine grid, minor tick

**Gridlines**:
How a coordinate grid's lines are drawn, one choice for the whole grid: light (gray, so the axes and graphed lines stand out), standard, bold (darker and thicker, with thicker axes, to survive a photocopier) or none (just the axes, with a tick at each block). Every grid starts standard.
_Avoid_: Grid weight, grid color, contrast

**Angle unit**:
Whether a coordinate grid's trig functions read x in radians or degrees. It's one setting for the whole figure, set with the x-axis: radians, until the teacher types ° in the x-axis range (which switches it to degrees) or picks degrees.
_Avoid_: Angle mode, trig mode

### Number lines

**Number Line**:
A figure of one horizontal axis with evenly spaced ticks, for placing numbers and graphing equations and inequalities in one variable. Its generator is the Number Line Generator.
_Avoid_: Line graph, ruler

**Equation**:
What the teacher types to graph, one per row. On a number line it's an inequality or equation in one letter, such as −2 < x ≤ 5, x < −1 or x ≥ 3, or x = 2, or a list of points, each one number, such as 3 or −1, 2.5, π/2, or a sequence; every row is drawn over the same line, and a number line with no equation is blank. On a coordinate grid it's a line or curve that can be written as y = …, such as y = 2x + 1, 2x + 3y = 6, x = 4 or y = x² − 4, an inequality of one, such as y > 2x + 1, or a list of points, such as (1, 2), (3, 4). Points aren't equations, but they're typed in the same rows and called the same thing. (Both generators' rows are `eq` in the page address; the number line's reading code still calls an equation `inequality`, and older number line links with `inequality=` still open.)
_Avoid_: Solution set, interval, expression

**Tick**:
A short mark across a number line at every step of its range. Numbered ticks are drawn longer than the ticks between them.
_Avoid_: Notch, hash mark, gridline

**Equation graph**:
The thick line, arrows and endpoints drawn over a number line to show which numbers make its equation true. Where it runs off an end it has its own arrow, just inside the number line's arrow.
_Avoid_: Shading, solution, plot

**Graphed line**:
A straight line or curve drawn across a coordinate grid from an equation, with an arrowhead where it leaves the grid. A curve is anything that can be solved for y, such as a parabola or 2^x; sideways curves and circles aren't drawn yet. An inequality row's graphed line is the boundary of its shaded region.
_Avoid_: Plot, function, curve

**Row style**:
How one equation is drawn, set from the button before it, which shows a miniature of how the row is drawn: a color, a line style (solid, dashed or dotted), a thickness (thin, medium or thick; its arrowheads and circles grow with it) and which ends have arrows (both, neither, left or right; for an up-and-down line, left means the bottom), whether endpoints show, and whether asymptotes show. An inequality row's style also picks how its shaded region is filled, a tint or hatching, but not its line style, which its sign decides. Points take the color and a point mark: a dot, or a cross as French classrooms use. On a number line a row's style is its color, whether values are written, and for points and sequences a point mark and how point labels show; a number line's thick line, arrows and circles carry meaning, so they can't be changed. Every row starts black. Values are written above the line for endpoints and unlabeled points that don't sit on a numbered tick, the way their own row was typed (0.35 as 0.35, 3/8 as a fraction), unless the row style turns them off (for an estimate-this-point question). The color goes on the row's thick line, arrows, circles and points, never on the line, ticks or numbers. Rows of the same color join into one equation graph, as they always have; rows of different colors are drawn separately, each color over the colors that came before it in the list.
_Avoid_: Format, appearance, theme

**Point mark**:
How points are drawn: a dot or a cross. It's part of each points row's row style, on both the coordinate grid and the number line. It never changes an endpoint, whose open or closed circle has a meaning.
_Avoid_: Marker, symbol, dot style

**Sequence**:
A number line row typed as a rule in n, such as aₙ = 1/n, uₙ = 1/n or just 1/n, shown for n from one whole number to another (1 to 5 unless the teacher changes it). Its terms are drawn as points, so 1/n from 1 to 5 marks 1, 1/2, 1/3, 1/4 and 1/5. Terms past the end of the line are left off with a note, not treated as a mistake. Rules built from earlier terms, such as aₙ = aₙ₋₁ + 3, aren't read yet.
_Avoid_: Series, pattern, list

**Term**:
One number a sequence makes, drawn as a point on the line.
_Avoid_: Element, value

**Endpoint**:
Where an equation's graph or a graphed line stops at a number, drawn as an open circle (not included) or a closed circle (included). On a coordinate grid, a graphed line's endpoints are at the ends of its domain, and a row style can hide them so the line simply stops.
_Avoid_: Dot, point, boundary

**Domain**:
The stretch of x-values a graphed line is drawn over (y-values, for an up-and-down line), typed after its equation as an inequality, such as y = 3x, −5 ≤ x < 7. Using ≤ or < picks a closed or open endpoint. A piecewise function is several rows, each with its own domain. A graphed line with no domain runs across the whole grid. An end cut off by its domain inside the grid never has an arrowhead; an end whose domain runs past the grid's edge follows the row style's arrows.
_Avoid_: Restriction, bounds, interval, range (an axis's range is different)

**Hole**:
A single x-value where a graphed line is undefined but the curve continues on both sides, such as x = 1 in y = (x² − 1)/(x − 1). It's found automatically and drawn as an open circle.
_Avoid_: Gap, removable discontinuity (fine in teaching, not as the name), missing point

**Asymptote**:
A line that a graphed line approaches but never reaches: vertical, horizontal or slant. Where a graphed line meets a vertical asymptote, the curve breaks and each side runs to the grid's edge with an arrowhead. Asymptotes are found for the whole row and, when its row style shows them, drawn as dotted lines in the row's color, without their equations; they're hidden unless the teacher shows them.
_Avoid_: Discontinuity, break, limit line

**Shaded region**:
The part of a coordinate grid filled in to show the points that make an inequality row true, such as y > 2x + 1, y ≥ x² − 4, x < 3 or −2 < x ≤ 3. It's filled in the row's color, as a see-through tint or as hatching, and runs to the grid's edges, under the gridlines, axes and every other row so points can be read through it. Hatching runs a different way for each hatched row, in list order (/, \, |, —), so overlaps show even in black and white. Several inequality rows are a system: each shades its own side, and where they overlap shows the points that make every one true. An inequality row has no domain; each inequality is its own row.
_Avoid_: Shading (that's an angle's), solution set, half-plane (fine in teaching), area

**Boundary**:
The graphed line along the edge of a shaded region, where the inequality's sides are equal. It's dashed for < and > (its points aren't included) and solid for ≤ and ≥ (they are), and the row style can't change that, since it carries meaning. It starts without arrows, since the shading shows it goes on. A boundary breaks at an asymptote and keeps its holes just as a graphed line does, and each piece shades its own side. To have students do the shading, a teacher graphs the equation instead, dashed or solid.
_Avoid_: Edge, border, endpoint (that's a circle where a line stops)

**Point label**:
The letter written at a point, typed before it in textbook notation: A(1, 2) on a coordinate grid, P(0.35) on a number line. It's one letter, with primes or a subscript allowed (A′, A₁), and it belongs to its point, so it stays when the point's numbers change and goes when the point is deleted. A points row's style shows just the labels or the labels with their coordinates or values, A or A(0.35). On a number line a labeled point's value is never written, since it would give the answer away; endpoints and sequence terms aren't labeled.
_Avoid_: Point name, vertex name (that's a triangle's), letter, tag

### Transformations

**Transformations** (the figure):
A coordinate grid showing a preimage and the images transformations make of it, built in the Transformations Editor.
_Avoid_: Transformation generator, transformation graph

**Preimage**:
What the teacher draws on the grid to be transformed: a polygon, a path of segments, or a single point. One per figure.
_Avoid_: Shape (that's a measured triangle, quadrilateral or regular polygon), original, figure (that's the whole picture)

**Image**:
What one transformation makes of the preimage or of the image before it, always worked out, never placed by hand. Its point labels carry one more prime than the one it came from (A to A′ to A″).
_Avoid_: Copy, result, transformed shape

**Transformation**:
One step that moves the preimage or an image: a translation, reflection, rotation or dilation.
_Avoid_: Move, operation, motion

**Composition**:
Transformations done one after another, each acting on the image the step before it made.
_Avoid_: Sequence (that's a number line's), chain, combo

**Translation**:
A transformation that slides every point by the same amount, ⟨a, b⟩, which can be shown as an arrow.
_Avoid_: Slide, shift

**Reflection**:
A transformation that flips over a line of reflection.
_Avoid_: Flip, mirror

**Line of reflection**:
The line a reflection flips over: the x-axis, the y-axis, y = x, y = −x, or a line x = c or y = c.
_Avoid_: Mirror line, axis of symmetry, line of symmetry

**Rotation**:
A transformation that turns by 90°, 180° or 270°, clockwise or counterclockwise, about a center of rotation.
_Avoid_: Turn

**Center of rotation**:
The point a rotation turns about.
_Avoid_: Origin (that's always (0, 0)), pivot, center (alone)

**Dilation**:
A transformation that stretches or shrinks by a positive scale factor from a center of dilation.
_Avoid_: Enlargement, scaling, resize

**Center of dilation**:
The point a dilation stretches from or shrinks toward.
_Avoid_: Origin, center (alone)

**Scale factor**:
How many times as far from the center of dilation each point ends up: above 1 enlarges, below 1 shrinks.
_Avoid_: Ratio, scale, zoom

**Glide reflection**:
A composition of a translation and then a reflection over a line parallel to it, made as those two steps.
_Avoid_: Glide, walk

### Shapes

**Shape**:
A figure of straight sides meeting at named vertices, drawn to scale from its measures and labeled for students: a triangle, a quadrilateral or a regular polygon. Each has its own generator.
_Avoid_: Polygon (alone; say regular polygon for that figure), diagram, drawing

**Part**:
Any vertex, side, angle or extra line of a shape, or any of a box plot's five-number summary: something that can carry a label or a marking.
_Avoid_: Element, component, piece

**Vertex name**:
The letter at a corner, such as A, B or C. Each can be renamed or left blank, and the shape's measures are named after them (∠B, AB).
_Avoid_: Point, corner label

**Measure**:
A side's length or an angle's size, in degrees. A **given** measure is one the teacher types; a **solved** measure is worked out from the givens. Drawing to scale means proportional, not true size on paper.
_Avoid_: Value, dimension, size

**Part label**:
What's written at a part: nothing, its measure (such as 12 or 24°, with the figure's unit on lengths, or a box plot's Q1 value), or text the teacher types, such as x or 2y + 1. It replaces the text boxes teachers otherwise lay over a drawing.
_Avoid_: Text box, caption, annotation, label (alone; axes have their own labels)

**Unit**:
One optional unit for the whole shape, such as cm or ft, added to every length shown as its measure.
_Avoid_: Scale

**Extra line**:
A line drawn onto a shape that isn't one of its sides, shaped as a segment, a ray past one end, or a line past both: a height, dropped from a vertex to a side, which is extended when the height lands outside the shape, a quadrilateral's diagonal, joining opposite vertices, or a regular polygon's apothem or radius. The point where a height lands, or where the diagonals cross, can be given a name, such as E. It can be solid, dashed or dotted, like a graphed line; on a composite shape it can also be thin or thick, or hidden (as can the shape's own sides and curves), when it still splits sides and makes angles that can be labeled but isn't drawn. On a composite shape, the teacher draws one across the inside in lines mode, between two anchor points or from one onto a height's foot, or shows a seam as one; where it meets a side partway along, that spot becomes a corner, splitting the side in two. Each end keeps what it was drawn to, not where it was, so when the shape changes in edit mode a line to a corner still ends at that corner, one to the middle of a side still ends halfway along it, and a height stays square to its side, with a right-angle mark at its foot and the side run on in dots when its foot leaves the side.
_Avoid_: Auxiliary line, segment, construction, internal line

**Marking**:
A standard geometry symbol on a part: congruence ticks on sides, parallel arrows on sides, congruence arcs on angles, or a right-angle square. The teacher sets congruence marks and parallel arrows by hand, never from the measures or the kind of shape, so they don't give answers away. An angle gets an arc only when it has a label or congruence arcs. A right-angle square appears on its own at every 90° angle, including where a height meets a side and where diagonals cross at right angles, and can be turned off.
_Avoid_: Symbol, annotation, tick (a number line's tick is different)

**Parallel arrows**:
One, two or three arrowheads in the middle of a side; sides with the same number are parallel.
_Avoid_: Parallel marks, chevrons

**Base side**:
The side that sits flat along the bottom before any flip or rotation.
_Avoid_: Bottom, base (alone; a height's base is the side it meets)

### Triangles

**Triangle**:
A shape with three vertices, drawn from any three measures that make one. Its generator is the Triangle Generator.
_Avoid_: Shape (alone), polygon

**Other triangle**:
The second triangle two sides and a non-included angle can make (the ambiguous case). The generator draws the one whose unknown angle is acute unless the teacher switches to the other.
_Avoid_: Second solution, alternate

### Quadrilaterals

**Quadrilateral**:
A shape with four vertices, A, B, C and D in order around it. Each family of quadrilaterals has its own generator: the Rectangle, Parallelogram, Trapezoid and Kite Generators.
_Avoid_: Quad, four-sided polygon

**Kind**:
Which quadrilateral a generator draws, which decides the measures the teacher gives. The Rectangle Generator draws rectangles and squares, the Parallelogram Generator parallelograms and rhombi, the Trapezoid Generator trapezoids, isosceles trapezoids and right trapezoids, and the Kite Generator kites.
_Avoid_: Type, shape (alone), category

**Trapezoid**:
A quadrilateral with exactly one pair of parallel sides, its **bases**; the other two are its **legs**. A right trapezoid has a leg at right angles to both bases.
_Avoid_: Trapezium (what UK teachers call it; fine as a search word)

### Regular polygons

**Regular polygon**:
A shape with 3 to 20 equal sides and equal angles around a center, sized by its side, radius or apothem. Its generator is the Regular Polygon Generator. Past 12 sides it's named by its count, such as a 15-gon.
_Avoid_: Polygon (alone), n-sided shape

**Center**:
The point a regular polygon is drawn around, the same distance from every vertex. It can be shown as a dot and named, such as O.
_Avoid_: Centre, midpoint, origin

**Apothem**:
The line from a regular polygon's center to the middle of a side, at right angles to it, and its length. The generator draws it to the bottom side.
_Avoid_: Inradius, height

**Radius**:
The line from a regular polygon's center to a vertex, and its length; together, the **radii**. The generator draws one to the bottom right vertex, so with the apothem it makes the right triangle used for area.
_Avoid_: Circumradius

### Composite shapes

**Composite Shape**:
A flat figure made of simpler shapes joined side to side, such as an L-shape, a rectangle with a semicircle on top, or a circle (two semicircles sharing their diameter), drawn to scale for area and perimeter questions. Unlike a **Shape**, it can have a curved side. Its editor is the Composite Shape Editor.
_Avoid_: Compound shape, composite figure, irregular shape, L-shape (all fine as search words, not as the name)

**Piece**:
One of the simpler shapes a composite shape is built from (a rectangle, triangle, semicircle or quarter circle): the first one placed, or one added onto a straight outer side. Pieces are only ever added, never cut out. A piece added onto a side starts by covering all of it, and can then be stretched past either end of it. An inside corner, such as an L-shape's, can be filled with a right triangle or a quarter circle, offered under "Add in this corner" on either side meeting it. A composite shape is always one connected shape: a resize stops before any piece would come apart from the rest (they may meet at just a corner), and deleting a piece also deletes any piece that would be left floating, with everything that would go tinted red first. Pieces that sat on a deleted piece but still touch the rest stay where they are.
_Avoid_: Part (a part is what carries a label), component, sub-shape

**Seam**:
Where two pieces of a composite shape meet. It isn't printed, so the outline reads as one shape and students find the split themselves, unless the teacher draws an extra line along it in lines mode. Resizing a piece never moves or resizes another, except across a shared edge.
_Avoid_: Join, shared side, boundary

**Shared edge**:
A seam where a triangle, semicircle or quarter circle covers the whole of the side it was added on (or the whole of several lined-up sides it was added across): changing that side's length changes the piece with it, and the other way round. A quarter circle shares only that one side, never the corner's other side, and can't be bigger than it: shrinking the side shrinks it. Two rectangles never share an edge; each resizes on its own.
_Avoid_: Linked side, parent side

**Selection**:
The pieces picked in edit mode: a click picks one, Shift-click adds or removes one. Several picked can be deleted together, resized together by dragging a side they line up along (which also moves any other piece's side lying along that line, so nothing comes apart or overlaps), merged when together they make one rectangle, or have a triangle, semicircle or rectangle added across a side they line up along.
_Avoid_: Group (they don't stay together once unpicked)

**Edit mode**:
The Composite Shape Editor's mode for building the shape: adding, resizing and deleting pieces. Extra lines, labels and marks are hidden while it's on, leaving just the pieces; copying or downloading still gives the whole figure. It's the first of three modes, picked at the bottom of the canvas: edit, lines, label. Seams show faintly dashed and pieces are tinted on hover, neither of which prints.

**Lines mode**:
The Composite Shape Editor's mode for drawing extra lines and nothing else: the outline goes pale and labels are hidden, every anchor point is shown, and a line is drawn by dragging from one to another, or onto the small square where a height would meet a side. Clicking a line opens its card, to make it a ray or delete it. A ray runs on to the edge of the canvas here and in edit mode.
_Avoid_: Draw mode

**Anchor point**:
A spot an extra line can start or end at: a corner, the middle of a side or of an extra line, where two extra lines cross, or anywhere on a curve (a semicircle's or quarter circle's), where it's pulled onto the curve's ends, middle and quarter points when dropped near one. A straight side offers only its corners and middle, never a spot partway along. Only spots on the outside of the shape or on an extra line count, never a seam inside it, except a semicircle's center, so its radius can be drawn; a line whose end ends up inside the shape (its side became a seam when a piece went on it) is dropped on leaving edit mode. A height's foot, on a side or on another extra line, is one too, offered only while a line is being drawn, since it depends on where the line starts.
_Avoid_: Snap point, handle, vertex (a corner is only one kind)

**Ray** (on a composite shape):
An extra line that runs on past one of its ends, or past both, making it a line. While the shape is being built it runs on to the edge of the canvas; in label mode and in print it stops the same distance past the shape's outside edge as every other ray, finished with an end cap (a triangle arrow to start). The run-on part makes no anchor points, corners or labelable points; only the angle where it leaves the shape can be labeled.
_Avoid_: Extension, run-on line, infinite line

**Label mode**:
The Composite Shape Editor's mode for labeling and marking sides, angles, points and extra lines (and choosing an extra line's style, or deleting it), including the angles extra lines make with sides and each other, the points inside the shape where they end or cross, and each corner's exterior angle (drawn with the side before it run on dashed past the corner), and each ray's end cap and the angle it makes where it leaves the shape, the same way as in Parallel Lines and Angles. The whole figure can be turned here, up to half a turn either way, with its labels staying upright; edit and lines mode show it unturned, so it's built square to the snap dots. The figure looks exactly as it will print.

**Snap dots**:
Faint dots one unit apart, shown only in edit mode, that corners and sides snap to while being dragged: a side running straight across or up and down snaps only to lines of dots (the ones shown, five units apart when zoomed far out), whatever lengths the pieces around it have, and a slanted side, which can't line up with them, snaps to whole lengths. Holding Cmd (Ctrl on Windows) while dragging stops the snapping.
_Avoid_: Grid (a composite shape has no grid)

**Locked part**:
An angle or side of a triangle piece that the teacher has locked in its popup, so it stays as everything else changes: when another of its measures is typed, when its tip is dragged (which then slides only where the lock allows, along a line or round a circle, shown while dragging), and when a piece it shares a seam with is resized. Two locks that between them fix the tip stop it being dragged. In edit mode each locked part shows its size with a lock beside it.
_Avoid_: Fixed, pinned, constraint

### Parallel lines and transversals

**Parallel Lines and Transversal**:
A figure of parallel lines cut by transversals, with the angles where they cross labeled for students. Its generator is the Parallel Lines and Transversal Generator. It isn't a **Shape**: its lines run on past the figure, with no corners.
_Avoid_: Transversal diagram, angle pairs diagram (fine as search words)

**Parallel line**:
One of the figure's lines that all run the same way, evenly spaced; a figure has one or more, named m, n… They have no angle of their own: the figure is turned as a whole.
_Avoid_: Base line, horizontal line

**Transversal**:
Any line in the figure that isn't one of the parallel lines, set by its angle with them: the angle above the top parallel line, to the right of the transversal. A figure has any number, named t, s…, placed apart along the lines. Two lines that aren't parallel, cut by a third, are drawn as one parallel line and two transversals.
_Avoid_: Cutting line, secant, non-parallel line

**Crossing**:
Where any two of the figure's lines meet: a transversal and a parallel line, or two transversals. The rays out from it split the space around it into angles, four where two lines cross.
_Avoid_: Intersection (fine in teaching), vertex, corner

**Angle** (in this figure):
The space between two neighboring rays at a crossing, named by the two lines and its side, so it keeps its label while the lines move and gets it back if its crossing comes back. Its label is nothing, its measure or text the teacher types, and starts as nothing. Its mark is nothing, one to three congruence arcs, or, at a 90° angle, a right-angle square; giving it a label gives it one arc (or the square) unless the teacher takes it off. It can also be shaded. It's edited by clicking it on the figure.

**Point** (in this figure):
A dot with an optional name, such as A, that lets angles and lines be named by points (∠ABC, line AB). It goes where lines cross, or near either end of a line, between its last crossing and its end; none shows until the teacher clicks the place on the figure and turns it on.
_Avoid_: Vertex name (that's a shape's corner), point label (that's a coordinate grid's), dot
_Avoid_: Angle number (angles aren't numbered unless the teacher types the numbers)

**Shading**:
A light color filling one angle near its crossing, so the teacher can point at an angle pair ("what is the relationship between the shaded angles?"). It's set per angle and never follows from the measures.
_Avoid_: Highlight, fill, color (alone)

### Angles

**Angles**:
A figure of rays out from one vertex, with the angles between them labeled for students: a single angle, adjacent angles, angles on a line or around a point, or vertical angles. Its generator is the Angles Generator. A figure needing a second crossing is a **Parallel Lines and Transversal**.
_Avoid_: Angle (alone; that's one angle in the figure), angle diagram, angle relationships (fine as search words)

**Ray** (in this figure):
One of the 2 to 6 lines out from the vertex, all the same length, set by its direction. A **two-sided** ray also runs straight back through the vertex, making a line, and still counts as one ray. No two rays point the same way. A point can go at the vertex or near the end of a ray (a two-sided ray has two ends), as on a Parallel Lines and Transversal.
_Avoid_: Line (alone), arm, side

**Baseline**:
The first ray, pointing right before the figure is turned, which every other ray's direction is measured from.
_Avoid_: Base ray, initial side (fine in teaching), x-axis

**Direction**:
A ray's angle from the baseline, 0° to 360° counterclockwise, as a protractor reads it. It only places the ray: an angle's measure is the gap between neighboring rays, never a direction.
_Avoid_: Heading, bearing, rotation

**Reflex angle**:
The angle over 180° that wraps around the outside, such as the 300° beside a 60° angle. It's an angle like any other, so it can be labeled, marked and shaded.
_Avoid_: Exterior angle (a shape's is different), outside angle

### Circles

**Circle** (the figure):
One circle with its center, points on it and lines between them, with the angles and arcs labeled for students: parts of a circle, central and inscribed angles, the circle theorems. Its generator is the Circle Generator. The circle is always drawn the same size; its **radius** (a length and unit, such as 6 cm) only sets the lengths the figure measures.
_Avoid_: Circle diagram, circle theorems (fine as search words), unit circle (that's a different figure)

**Center**:
The circle's center, named O unless the teacher changes it, with a dot that can be hidden. It can be joined like any point, but not moved.
_Avoid_: Origin, middle

**Point** (in this figure):
A place with an optional name, such as A, set by its **direction** from the center (0° to the right, counting counterclockwise, as the Angles Generator measures) and its distance from the center in radii. At a distance of 1 it's on the circle, anywhere else off it, inside or outside. Every point is added on the circle; dragged, a point on the circle slides round it (in 5° steps, 1° with Ctrl or Cmd held) until it's pulled a third of a radius away, and a point off it moves anywhere (its distance in quarter radii) and snaps back on within a tenth of a radius. An arc's popup can add a point in its middle.
_Avoid_: Vertex, dot (that's how it's drawn)

**Line** (in this figure):
A straight line joining two places (the center, points, touch points or midpoints), or a **tangent**. It's named by what it is: a **radius** (from the center to the circle), a **diameter** (circle to circle through the center), a **chord** (circle to circle), a **secant** (a chord run on past both ends, or any line crossing the circle twice as drawn), or just a line (from a point off the circle, not crossing it twice). Each end stops at its point or runs on past it, ending in a cap; an end running into the circle goes all the way through it first. A run-on end can instead run until it meets another line (two tangents to where they cross, say), and that line runs on to meet it too; where they meet is a crossing, which can be named. Lines are drawn from a point's popup ("Join to") or the left card. A line's label goes beside it by itself, and can be dragged across the line to the other side.
_Avoid_: Segment (alone), side, edge

**Tangent**:
A line touching the circle at one point. A tangent at a point on the circle is square to the radius there and runs on the same set length each way; either end can be cut back to where it touches. A tangent from a point outside the circle runs from that point to its **touch point**; a point has two, named on the page by where they touch (left and right, or top and bottom), and the popup draws none, either or both.
_Avoid_: Tangent line (fine), touching line

**Touch point**:
Where a tangent from a point outside the circle touches it. It can be named and joined like a point (a radius to it, say), but it moves with its point and tangent, and goes when the tangent does.
_Avoid_: Point of tangency (fine in teaching), contact point

**Midpoint**:
The middle of a line joining two places, such as a chord's. Clicking the middle of the line names it or draws a line from it to the center or a point (the line from the center square to a chord); midpoints aren't offered anywhere else, and a line from one is added with Add midpoint line, or from the midpoint's popup, and has its own row in the left card, "Midpoint of [AB] to [O]"; once joined or named it's a place on the figure, and the line's congruence ticks go on each half.
_Avoid_: Apothem (that's a regular polygon's), bisector

**Crossing** (in this figure):
Where two lines cross away from a point, or a line meets the circle away from a point (a run-on end through the circle, say). Nothing shows there until the teacher clicks it and names a point there.
_Avoid_: Intersection (fine in teaching)

**Angle** (in this figure):
The space between two neighboring lines at the center, a point or a crossing, labeled and marked as on a Parallel Lines and Transversal. It isn't shaded: enclosed areas are. A right angle's square comes on its own, at the first right angle in each place (where a triangle stands on a diameter, or a radius meets its tangent), until the teacher takes it off. Only the center has reflex angles (a reflex central angle); everywhere else, only angles up to 180° count.
_Avoid_: Central angle and inscribed angle as names in the figure (they're fine in teaching; every angle is edited the same way)

**Arc**:
The piece of the circle between two neighboring places on it (points, and where lines meet it). Its label is nothing, its measure in degrees, its length (from the radius) or text; it can carry congruence ticks and be drawn bold or in a color, to show an intercepted arc, or hidden, leaving the rest of the circle drawn (it shows faintly dashed while the figure is edited). An arc split by a point in the middle is labeled piece by piece.
_Avoid_: Curve, minor arc and major arc (an arc is always between neighboring places)

**Enclosed area**:
Any region the circle and the lines close off: a **sector** (between two radii and an arc), a **segment** (between a chord and an arc), a triangle of chords, or a piece where chords cross. Clicking inside one shades it in one of the shading colors. It keeps its shading while its points move, until a line is drawn across it. Lines' loose ends, and a tangent, close nothing off.
_Avoid_: Region, face, shape (that's a different figure)

**Measures** (in this figure):
The circle's circumference and area, and each shaded enclosed area's size (with its arc's angle and length when it runs along one arc, as a sector or segment does), worked out from the radius and shown on the page in terms of π and as a decimal. They're for the teacher and never printed in the figure.
_Avoid_: Answers, results, solutions

### Data displays

**Data set**:
The numbers a teacher types in one row to be displayed, such as 12, 15, 15, 18, 22, 30, with an optional name like "Class A". Several rows are drawn over the same axis to compare them.
_Avoid_: Data, list, values, series

**Box Plot**:
A figure of one or more data sets, each drawn as a box from Q1 to Q3 split at the median, with whiskers out to the ends, over one shared number line. Its generator is the Box Plot Generator.
_Avoid_: Box and whisker plot, box chart (fine as search words, not as the name)

**Five-number summary**:
The minimum, Q1, median, Q3 and maximum of a data set. Quartiles are the medians of the lower and upper halves, leaving out the median when the count is odd, as the TI-84 works them out. A teacher can type the five numbers instead of a data set. None is written on the figure unless the teacher gives it a part label, so the figure doesn't give answers away.
_Avoid_: Summary statistics, five statistics

**Outlier**:
A value more than 1.5 times the box's width beyond either end of the box, drawn as its own point with the whisker stopping at the last value that isn't one. Outliers are only drawn when the teacher turns them on; otherwise whiskers reach the minimum and maximum.
_Avoid_: Extreme value, anomaly

**Bar Graph**:
A figure of separate bars, one for each category (or one for each series in each category), whose lengths show values read off a numbered value axis. The bars stand up as columns or run sideways; a column graph is a bar graph with upright bars. Its generator is the Bar Graph Generator.
_Avoid_: Bar chart, column graph, column chart (fine as search words, not as the name); histogram (its bars touch, over a numbered axis)

**Category**:
One row of a bar graph's table, and the place along its category axis where that row's bars stand, named under them (or beside them, for sideways bars), such as Soccer. Categories are named, not numbered, and keep the order they were typed in.
_Avoid_: Group, label, x value

**Series**:
One column of a bar graph's table, named by its heading, such as Boys: a bar in every category, all filled alike and named in the key. With two or more series a category's bars stand side by side (a double bar graph) or stacked end to end.
_Avoid_: Data set (that's a row of numbers for a box plot), group, column (fine in speech)

**Error bar**:
A line through the end of a bar from its value minus a ± amount to its value plus it, with a short crossbar at each end unless the teacher takes them off. The teacher types each bar's ± amount (a standard error, a standard deviation, a range); the generator never works one out. Only side-by-side bars have them.
_Avoid_: Whisker (that's a box plot's), uncertainty bar, confidence interval (fine in teaching)

**Key**:
The list beside or under a figure pairing each fill with what it stands for, such as each series of a bar graph; on a stem-and-leaf plot, the example under it that says what a stem and leaf stand for, such as 3 | 4 = 34 cm.
_Avoid_: Legend (fine as a search word)

**Fill**:
How a bar is colored in: one of the graph inks, or a black-and-white fill (gray, white, hatching, dots, cross-hatching) that still tells the series apart once photocopied. A figure's look gives the series fills in turn, and the teacher can pick one for any series.
_Avoid_: Pattern, shading (that's an angle's or a region's), color (for the black-and-white ones)

**Stem-and-Leaf Plot**:
A figure of a data set written as numbers: a column of stems down the left, a line, and each value's leaf written across its stem's row in even columns, so the rows' lengths compare like bars, with a key under it such as 3 | 4 = 34. Back-to-back, two data sets share the stems, one set's leaves running left and the other's right. Its generator is the Stem-and-Leaf Plot Generator.
_Avoid_: Stem and leaf diagram, stemplot (fine as search words, not as the name)

**Stem**:
Every digit of a value before its leaf, written once for its row, such as 3 for 34, 2 for 2.3, or −0 for −4. Every stem from the lowest to the highest has a row, even an empty one. Split stems take two rows each (leaves 0–4, then 5–9) or five; a negative stem's rows run the other way, so the plot always reads from the smallest value to the largest.
_Avoid_: Row (a split stem has several), category

**Leaf**:
A value's digit at the leaf unit, written on its stem's row. The leaf unit is the last digit typed unless the teacher picks one, and digits past it are cut off, not rounded. Leaves go in order outward from the stem (so a negative stem's biggest digit comes first), or as typed.
_Avoid_: Last digit (fine in speech), unit digit

**Pie Chart**:
A circle cut into sectors, one for each category, each sector's angle the category's share of the whole times 360°. The sectors run clockwise from 12 o'clock in the order typed, or largest first. Values are counts, percents or degrees. Whatever isn't drawn (values left empty, or values that fall short of the whole) is one empty sector at the end. Its generator is the Pie Chart Generator.
_Avoid_: Circle graph, pie graph (fine as search words, not as the name)

**Sector (of a pie chart)**:
The slice of a pie chart for one category, between two radii. Its label is inside it where it fits, or outside with a short leader line, and says its name, value, percent, angle or fraction, or two of them; a sector's own label can be a blank line or a letter (x°) for students to work out.
_Avoid_: Slice, wedge, segment (a segment is cut off by a chord)

**Histogram**:
A figure of touching bars over a numbered axis, one bar per bin, whose heights show how many values fall in each bin (with unequal bins, their areas, over a frequency density axis). Its generator is the Histogram Generator.
_Avoid_: Bar graph (bars there are separate categories), column chart

**Bin**:
One stretch of the histogram's axis, such as 10 to 20, numbered at its edges. A value on an edge belongs to the bin that starts there (10 ≤ x < 20), unless the teacher picks the bin that ends there (10 < x ≤ 20). Bins come from a data set with a start and bin width, or are typed with their counts as a frequency table, where a bin typed as an inequality says which end it holds. Whole-number bins like 10–19 are read as their edges, so 10–19, 20–29 leave a gap; the generator offers 9.5–19.5, 19.5–29.5 instead. On the page they're bins; class, class interval and class width are the same words in UK textbooks.
_Avoid_: Interval, class, bucket, range (a range is an axis's From, To and Step)

**Frequency**:
How many values fall in a bin: the height of its bar, read off the histogram's vertical axis.
_Avoid_: Count (fine in speech), tally

**Cumulative Frequency Graph**:
A figure of running totals over a numbered axis: a point at each bin's upper bound for the number of values up to it, starting from 0 at the lowest bound, joined by a smooth curve or straight lines. The vertical axis is cumulative frequency, or cumulative percent of n. Its generator is the Cumulative Frequency Graph Generator.
_Avoid_: Ogive, cumulative frequency curve, cumulative frequency polygon (fine as search words, not as the name)

**Cumulative table**:
A table of upper bounds, each with its cumulative frequency (the running total of values up to it), as many questions give the data for a cumulative frequency graph. Typed instead of a frequency table, its totals never go down.
_Avoid_: Running total table, cumulative frequency table (fine in speech)

**Reading**:
A value read off a cumulative frequency graph with dashed lines: across from a cumulative frequency to the join and down to the horizontal axis (the median from n/2, the quartiles from n/4 and 3n/4, a percentile), or up from a value and across. It's read where the lines meet the join as drawn, to a tenth of a block, and its value is written at the axis, left as a blank line for students, or left off.
_Avoid_: Estimate (fine in teaching), interpolation, guide line

**Frequency density**:
A bin's frequency divided by its width, the height of its bar on a histogram with unequal bins, so each bar's area stands for its frequency. The Histogram Generator chooses it for unequal bins; a frequency axis can still be picked, with a warning.
_Avoid_: Density (alone, fine in speech), frequency per unit

**Frequency polygon**:
A line through the middle of the top of each histogram bar, drawn over the bars or alone, and closed down to the axis half a bin past each end unless the teacher leaves it open.
_Avoid_: Line graph (points joined across a coordinate grid), frequency curve

**Axis break**:
A zig-zag on the horizontal axis between the corner and the first bin, when the axis starts past 0, so data like heights from 150 to 190 cm don't need an empty stretch from 0.
_Avoid_: Broken axis, squiggle, axis jump

**Line plot**:
A number line with a mark stacked above each value of a data set, as grades 3–6 use the name. No generator makes one yet.
_Avoid_: Dot plot is the same figure; line graph (points joined across a coordinate grid) is a different one

**Two-Way Table**:
A table of counts for two ways of sorting the same people or things: the categories of one down the side (Year 7, Year 8), the categories of the other across the top (Walk, Bus, Car), and in each cell how many are in both. Each variable can have a title, written above the headings and beside the row names, or both in a corner split by a diagonal. Its generator is the Two-Way Table Generator.
_Avoid_: Contingency table, two-way frequency table (fine as search words, not as the name); frequency table (one variable)

**Total**:
A cell of a two-way table that adds up others: each row's total in the Total column, each column's total in the Total row, and the grand total where they meet. Totals are typed like any other cell, or filled in by Work out totals.
_Avoid_: Sum, marginal (fine in teaching), subtotal

**Missing value**:
A cell of a two-way table left for students: left empty, so it's blank on the figure, or typed as a letter like x, written as typed. A missing value can be worked out when its row or column has no other gap, repeated until nothing changes; the generator says which can and what each one is.
_Avoid_: Hidden value (nothing is typed and then hidden), gap (fine in speech), unknown

**Relative frequency**:
A count divided by a total. On a histogram it's a bin's frequency as a share of n, the total of all the frequencies, as a decimal or a percent. In a two-way table it's a cell divided by the grand total (a joint relative frequency), by its row's total, or by its column's total (a conditional relative frequency), written as a decimal, a percent or a fraction in lowest terms; the totals then show the matching shares, and a row's (or column's) total is 1, or 100%.
_Avoid_: Proportion, percentage frequency, probability (fine in teaching), percentage table

**Venn Diagram**:
A figure of one, two or three equal circles, each a set, inside a box for the universal set, with something written in each region and any regions shaded. Two sets overlap, sit apart (mutually exclusive) or one sits inside the other (a subset); three always overlap. Its generator is the Venn Diagram Generator.
_Avoid_: Set diagram, circle diagram

**Set**:
One circle of a Venn diagram, named outside it by a letter (A, B, C) or a word (Football). In sets mode it's a list of members typed by the teacher; a repeated member is another copy, so prime factors (2, 2, 3) sort as they should.
_Avoid_: Group, category (that's a bar graph's), circle (fine in speech)

**Universal Set**:
Everything a Venn diagram is about, drawn as the box round the circles and named in its top left corner: U (the default), ξ (as GCSE writes it), S, ε, a word or nothing. In sets mode its members are typed as a list or a range like 1-20; left empty, it's just the sets' own members.
_Avoid_: Universe, sample space (fine in teaching), rectangle

**Region**:
The part of a Venn diagram inside exactly some of the sets and outside the rest, such as A only (A ∩ B′) or neither: four for two overlapping sets, eight for three, outside included. In text mode each holds what's typed for it, numbers, letters or words, split at its commas one piece to a line (as in red flesh, mushy, savory); in sets mode, the elements that belong there, written in rows round its middle; one left empty is drawn empty, or with a blank line when the teacher asks for one. Clicking a region on the figure fills it in or shades it. A shaded region is filled with a tint, gray or a black-and-white pattern, under the circles' outlines.
_Avoid_: Section, area (that's a shape's measure), zone, part

### 3D shapes

**3D Shape**:
Any of the three-dimensional figures below — a prism, cylinder, pyramid, cone or sphere — drawn to scale from the measures the teacher gives and labeled for students. Each has its own generator; the words in this section belong to all of them. A 3D shape isn’t a **Shape**, which is flat.
_Avoid_: Solid (fine as a search word), 3D figure, volume diagram, shape (alone)

**Prism**:
A 3D shape with two matching bases joined by flat sides: a rectangle (a box), a right or isosceles triangle, or a regular polygon of 3 to 8 sides. It stands on its base or lies on its side; a triangular prism lies down unless the teacher stands it up. Its generator is the Prism Generator.
_Avoid_: Box (fine as a search word), cuboid

**Cylinder**:
A 3D shape with two matching circles joined by a curved side. Its generator is the Cylinder Generator.
_Avoid_: Can, tube

**Pyramid**:
A 3D shape with a base, a rectangle or a regular polygon, whose sides meet at a tip. Its generator is the Pyramid Generator.
_Avoid_: Tetrahedron (fine as a search word)

**Cone**:
A 3D shape with a circle for its base and a curved side that meets at a tip. Its generator is the Cone Generator.

**Sphere**:
A 3D shape that is round all over, every point on it the same distance from its middle. Its generator, the Sphere Generator, also draws a **hemisphere**: half a sphere, its flat face down like a dome or up like a bowl.
_Avoid_: Ball, half sphere

**Oblique**:
A 3D shape that leans: its top slides sideways from above its base, so its side edges slant and its height is shorter than them. The opposite, standing straight up, is **right**, as in right prism.
_Avoid_: Slanted, tilted, leaning, skewed

**Hidden edge**:
An edge a viewer couldn't see through the front of a 3D shape, drawn dashed. Hidden edges can be turned off to leave only the outline.
_Avoid_: Back edge, dotted edge, invisible line

**Height** (of a 3D shape):
The straight-up distance from a 3D shape's base to its top or tip, drawn dashed with a right-angle square where it meets the base. On an oblique shape it lands outside the shape, so the base's line is extended out to meet it. It can be shown or hidden.
_Avoid_: Altitude, perpendicular height (fine in a label), vertical

**Slant height**:
On a right pyramid or cone, the distance from the tip down the middle of a sloping face (on a cone, down its side) to the base's edge.
_Avoid_: Slant, lateral height, side length

**Lean**:
How far an oblique shape's top slides sideways past its base, measured along the base's extended line. Any two of the height, the lean and the slanted side edge are enough; the third is worked out.
_Avoid_: Offset, shift, overhang

### Mapping diagrams

**Mapping diagram**:
A figure of two lists side by side, the inputs on the left and the outputs on the right, each in an oval (or a box, or nothing) under its title, with an arrow from each input to each output it maps to. It shows a function, or a relation that isn't one. Its generator is the Mapping Diagram Generator.
_Avoid_: Arrow diagram, mapping (fine as search words, not as the name)

**Input**, **Output**:
One item on a mapping diagram's left side, or its right. Each is a number, math like 2x or 1/2, or a word, typed or pasted as a list, and shown once however often it's typed. The sides are titled Input and Output unless the teacher writes something else, such as x and y.
_Avoid_: Domain and range (a graphed line's domain and an axis's range are different things here), element, value

**Arrow** (on a mapping diagram):
A straight line with an arrowhead from one input to one output, saying that input maps to it. It's kept by what its two ends say, so reordering a list keeps it. An input can have several arrows, or none, for students to draw.
_Avoid_: Line, connection, link

**Function** (on a mapping diagram):
A mapping diagram where every input has exactly one arrow. The generator tells the teacher whether theirs is one, and why not (an input with two outputs, or one with none), but never writes it on the figure.
_Avoid_: Well-defined, valid
