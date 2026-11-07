// The words under each generator: what its figures show and how teachers use
// them, what can be set, and frequently asked questions, for the section below
// the figure (GeneratorAbout) and the page's structured data. Everything here
// should be true of the generator's code; check it when a generator changes.
// Plain text only: the same strings go into JSON-LD.

export interface Faq {
  q: string
  a: string
}

export interface GeneratorCopy {
  /** the section's visible heading */
  heading: string
  /** one or two short paragraphs */
  intro: string[]
  /** "What you can set", one line each */
  settings: string[]
  faqs: Faq[]
  /** what the generator's social card image (/og/<id>.png) shows */
  imageAlt: string
  /** schema.org educationalLevel */
  educationalLevel: string[]
}

export const COPY: Record<string, GeneratorCopy> = {
  transformations: {
    heading: 'Transformations on a coordinate grid',
    intro: [
      'The Transformations Editor draws a polygon, path or point on a coordinate grid and the images transformations make of it: translations, reflections over the x-axis, the y-axis, y = x, y = −x or any line x = a, y = a or y = ±x + a, rotations of 90°, 180° or 270° about any point, and dilations by any scale factor from any center. Click the preimage out on the grid, then add transformations one after another; each one acts on the image the one before made, labeled A′, then A″.',
      'Teachers use it for 8th grade and geometry transformation units: practice where students draw the image, questions where they name the transformation, and answer keys. Switch between the Student, Question and Answer key versions of the same figure to make each one.',
    ],
    settings: [
      'The preimage: one point, a path or a polygon of up to 10 vertices, clicked onto the grid or typed, with a label for each vertex',
      'Transformations, one after another: a translation by ⟨a, b⟩, a reflection over a line, a rotation of 90°, 180° or 270° either way about any point, and a dilation by any scale factor from any point, each placed on the grid with a preview',
      'Color, or black and white for a copier, with images told apart by dashed and dotted lines, and each figure’s own color and line: solid, dashed or dotted, thin, medium or thick',
      'Three versions of the figure: Student, Question and Answer key, or exactly what shows: the preimage, images, in-between images, lines of reflection, centers, translation arrows, point labels and coordinates',
      'The grid, with the same settings as the Coordinate Grid Generator: each axis’s range, numbering, titles, axis labels and end caps, gridlines and minor gridlines, and small, medium or large labels',
    ],
    faqs: [
      {
        q: 'How do I draw the preimage?',
        a: 'Click grid points on the figure, one per vertex: one click makes a point, more make a path, and clicking the first point again closes it into a polygon. You can also type each vertex’s coordinates, and drag a vertex to move it.',
      },
      {
        q: 'How do I add a transformation?',
        a: 'Choose Add a transformation and pick one, then place it on the grid. A translation follows the pointer: click where the first vertex should go. A reflection previews over the axis or diagonal nearest the pointer; for a line like x = 2, choose it in the step’s Over menu. A rotation asks for its center, then shows all three turns to pick from. A dilation asks for its center. Afterwards its numbers can be typed, or dragged left and right.',
      },
      {
        q: 'How do I make a version for students without the answer?',
        a: 'Pick a version under Show. Student shows the preimage with its line of reflection or center, for students to draw the image. Question shows the preimage and the final image, for students to name the transformation. Answer key shows everything. The gear beside them chooses exactly what shows, and each image can be hidden on its own with its eye button.',
      },
      {
        q: 'What if an image goes off the grid?',
        a: 'The step says which points are off the grid, or so close to its edge that their labels get cut off, and Widen the grid makes room for every figure with a block to spare. A four-quadrant grid widens evenly, the same distance from the origin every way, so where it stops doesn’t give away where the image is.',
      },
      {
        q: 'Can I do a glide reflection or another composition?',
        a: 'Yes. Add the transformations in order, like a translation and then a reflection over a line parallel to it for a glide reflection. With In-between images unticked, only the preimage and the final image show.',
      },
      {
        q: 'Is my figure saved?',
        a: 'It is kept in this browser, so it is still there when you come back, with undo and redo. It isn’t in the page address, so there is no link to share; copy or download the image instead.',
      },
    ],
    imageAlt: 'A triangle on a coordinate grid and its image after a reflection over the line y = x, with its vertices labeled A, B, C and A′, B′, C′',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },
  'coordinate-grid': {
    heading: 'Coordinate grids and graph paper for graphing',
    intro: [
      'The Coordinate Grid Generator draws a grid of square blocks with an x-axis and a y-axis, numbered along each axis over the range you set. Leave it blank as graph paper, or type equations and points to graph on it: straight lines like y = 2x + 1, curves like y = x² − 4, y = 2ˣ, y = log₂ x, y = |x − 3| or y = 1/x, trig functions like y = 3 sin(2x), pieces of a piecewise function with open and closed circles, inequalities like y > 2x + 1, shaded on one side, and labeled points like A(2, 3).',
      'Teachers use it for plotting points, graphing linear equations, reading slope and intercepts, graphing inequalities and systems of inequalities, and graphing functions from Algebra 1 through Precalculus and Calculus: transformations, domain and range, holes and asymptotes, limits and trig graphs. Type a range with fractions or π for a trig graph, or with ° for degrees, and give each axis a title or a blank line for students.',
    ],
    settings: [
      'Equations to graph, one per row: lines, curves, points, pieces of a piecewise function with open or closed endpoints, and inequalities to shade',
      'Functions to graph with: powers and roots, |x|, sin, cos, tan, sec, csc, cot and their inverses, ln, log and log with any base, and e',
      'Each row’s style: its color, a solid, dashed or dotted line, a thin, medium or thick line, which ends have arrows, endpoints and asymptotes shown or hidden, a dot or cross for points, and a tint or hatching for an inequality’s shading',
      'Each axis’s range (From, To and Count by), typed as whole numbers, decimals, fractions, multiples of π or degrees, and how often it is numbered',
      'A chart title and axis titles, as text or a blank line for students, and the x and y labels at the arrow tips',
      'How each end of each axis finishes: a triangle arrow, a line arrow, a circle or nothing',
      'Light, standard or bold gridlines, or none, minor gridlines splitting each block into 2, 4 or 5, and small, medium or large labels',
    ],
    faqs: [
      {
        q: 'How do I make a blank coordinate plane?',
        a: 'Leave the Equations row empty and set each axis’s From and To, like −10 to 10 for a four-quadrant grid or 0 to 15 for the first quadrant only. It prints as plain graph paper with numbered axes.',
      },
      {
        q: 'What equations can I graph?',
        a: 'Anything that can be written as y = …, such as y = 2x + 1, 2x + 3y = 6, y = −(x − 2)² + 3, y = 2^x or y = |x|, plus up-and-down lines like x = 4. Trig, log and ln functions work too, and any of these can be an inequality to shade. Circles, sideways curves and polar graphs aren’t drawn yet.',
      },
      {
        q: 'Can I graph trig, log and exponential functions?',
        a: 'Yes. Type sin, cos, tan, sec, csc or cot, like y = 3sin(2x) or y = tan(x − pi/4), and arcsin, arccos or arctan for their inverses. For logs, type ln(x), log(x) for base 10, or log_2(x) for another base (type _ before the base). Exponentials are typed with ^, like y = 2^x or y = e^(−x). Type ^ for any exponent, / for a fraction and sqrt for a square root.',
      },
      {
        q: 'Can I graph trig functions in degrees?',
        a: 'Yes. Type the x-axis range with °, like From 0° to 360° counting by 90° (or type deg), and sin, cos and tan read x in degrees. For radians, type the range with pi, like 0 to 2pi counting by pi/4, and the axis is numbered in π.',
      },
      {
        q: 'How do I show a hole or an asymptote?',
        a: 'A hole is drawn for you as an open circle, as in y = (x² − 1)/(x − 1), and a curve like y = 1/x breaks at its vertical asymptote instead of joining across it. To draw the asymptotes as dotted lines, open the button before the row and choose Show asymptotes; they are hidden at first so students can find them.',
      },
      {
        q: 'How do I plot and label points?',
        a: 'Type points in a row, like (1, 2), (3, 4), or give each a letter first, like A(1, 2), B(−3, 4). The row’s style chooses a dot or a cross and whether the label shows just the letter or the letter with its coordinates.',
      },
      {
        q: 'How do I graph an inequality or a system of inequalities?',
        a: 'Type it with <, ≤, > or ≥, like y > 2x + 1, y ≤ x² − 4, x < 3 or −2 < x ≤ 3, and the side that makes it true is shaded. The boundary is dashed for < and > and solid for ≤ and ≥. For a system, give each inequality its own row: each shades its own side, and the solutions are where the shading overlaps. In black and white, set each row’s shading to hatching so the overlap still shows.',
      },
      {
        q: 'Can I make the lines darker so they show up on photocopies?',
        a: 'Yes. Under Grid, set Gridlines to Bold for darker, thicker gridlines and axes, or to Light to make the grid gray so the axes and graphs stand out; None leaves just the axes. To make one graphed line thicker or thinner, open the button before its row and pick a thickness.',
      },
      {
        q: 'Can I graph a piecewise function?',
        a: 'Yes. Put each piece in its own row with its domain after a comma, like y = x + 2, x < 1 and then y = −2x + 4, x ≥ 1 (type <= for ≤ and >= for ≥). Use ≤ for a closed circle at the end and < for an open one; a piece that runs off the grid ends in an arrow. Any equation can be a piece, like y = x², −2 ≤ x ≤ 2, and x = 3, 1 ≤ y < 4 is an up-and-down piece. To leave the circles off, open the button before the row and choose No endpoints.',
      },
      {
        q: 'How do I number the x-axis in π for trig graphs?',
        a: 'Type the range with pi, like From −2pi to 2pi, counting by pi/2. The numbers are written in π, and Numbers set to Every 2nd line keeps them from crowding. Type ° in the range to graph trig in degrees instead.',
      },
    ],
    imageAlt: 'A printable four-quadrant coordinate grid from −10 to 10 with the line y = 2x + 1 graphed on it, made with the Coordinate Grid Generator',
    educationalLevel: ['Middle school', 'High school', 'Algebra 1', 'Algebra 2'],
  },

  'number-line': {
    heading: 'Number lines for inequalities, fractions and points',
    intro: [
      'The Number Line Generator draws a horizontal number line over the range you type, with a tick at every step and numbers under them. Type an inequality to graph it with open and closed circles and a thick line, or type numbers to mark as points, lettered for students to identify, or a sequence like aₙ = 1/n.',
      'Teachers use it for graphing inequalities and compound inequalities, placing integers, fractions and decimals, and questions on reading a point’s value. Type the range in fractions or π and the numbers follow, so a line counting by 1/4 is numbered in fractions.',
    ],
    settings: [
      'Equations to graph, one per row: an inequality or equation in one letter, like −2 < x ≤ 5, x < −1 or x ≥ 3, or x = 2, a list of points, lettered points like P(0.35), or a sequence',
      'Each row’s color, whether values are written above the line, and for points a dot or cross and how their labels show',
      'The range (From, To and Count by), typed as whole numbers, decimals, fractions or multiples of π',
      'How often the ticks are numbered: every tick, every 2nd, 4th, 5th or 10th, or not at all',
      'For a sequence, which terms are shown, n from one whole number to another',
      'Small, medium or large labels',
    ],
    faqs: [
      {
        q: 'How do I graph an inequality on a number line?',
        a: 'Type it in an Equations row, like x ≥ −2 (type >= for ≥). The generator draws a closed circle where the number is included and an open circle where it isn’t, with a thick line over every number that makes it true.',
      },
      {
        q: 'Can it graph compound inequalities?',
        a: 'Yes. Type an “and” inequality as −3 < x ≤ 4, or with the word and, and an “or” inequality with the word or, like x < −1 or x ≥ 3. You can also type x ≠ 2, all real numbers or no solution.',
      },
      {
        q: 'Can I make a fraction number line?',
        a: 'Yes. Type the step as a fraction, like 1/4, and the ticks are numbered as fractions. To have students name the fractions, set Numbers to number fewer ticks, such as every 4th, so only the whole numbers are written.',
      },
      {
        q: 'How do I mark points for students to identify?',
        a: 'Type the points with a letter before each, like P(3/4), Q(3/2). They’re drawn as dots with only their letters, since writing the value would give the answer away. A point typed without a letter that doesn’t sit on a numbered tick has its value written above it, unless you turn Values off in the row’s style.',
      },
      {
        q: 'Why is the graph in two colors?',
        a: 'Each row has its own color, set from the button before it. Rows of the same color join into one graph; rows of different colors are drawn separately, so you can show two inequalities on one line.',
      },
    ],
    imageAlt: 'A printable number line from −5 to 5 with x ≥ −2 graphed as a closed circle at −2 and a thick line running right, made with the Number Line Generator',
    educationalLevel: ['Elementary school', 'Middle school', 'High school', 'Algebra 1'],
  },

  'triangle': {
    heading: 'Triangles drawn to scale, labeled for students',
    intro: [
      'The Triangle Generator draws a triangle to scale from any three of its measures: three sides, two sides and an angle, or two angles and a side. It works out the rest, so the picture always matches the numbers. Measures can be typed with fractions, square roots and π, like 5/2 or 3√2.',
      'Label each side and angle with its measure, with math like x or 2y + 1, or with nothing, and add congruence marks, heights and right-angle squares. Teachers use it for the Pythagorean theorem, special right triangles, trigonometry, the laws of sines and cosines, and area.',
    ],
    settings: [
      'Any three sides and angles, typed as numbers, fractions, square roots or π',
      'A label on each side and angle: its measure, text like x, or nothing',
      'Congruence ticks on sides and congruence arcs on angles, one to three of each',
      'A height from any corner, solid, dashed or dotted, labeled and with the point where it lands named',
      'Corner names, a unit such as cm or ft, and solved measures rounded to whole numbers, tenths or hundredths',
      'Right-angle squares on or off, which side sits at the bottom, flip and turn, and labels dragged where you want them',
    ],
    faqs: [
      {
        q: 'Which measures do I need to give?',
        a: 'Any three that make a triangle: three sides (SSS), two sides and an angle (SAS or SSA), or two angles and a side (ASA or AAS). Three angles alone fix the shape but not the size, so no side lengths are shown. If the measures don’t make a triangle, the settings say why and the last good triangle stays on screen.',
      },
      {
        q: 'How do I label a side x for students to find?',
        a: 'Leave that side’s measure blank so the generator solves it, then set its label to text and type x, or any math like 2y + 1. A side or angle you gave shows its measure; one the generator solved shows nothing unless you ask for its measure.',
      },
      {
        q: 'Is the triangle really drawn to scale?',
        a: 'Yes. Its sides and angles are in proportion to the measures, so a 3-4-5 triangle looks like one. It isn’t true size on paper; it is fitted to the figure.',
      },
      {
        q: 'What about the ambiguous case?',
        a: 'When two sides and an angle not between them make two different triangles, the generator draws the one whose unknown angle is acute and offers Show the other triangle to switch to the second.',
      },
      {
        q: 'Can I type a square root or a fraction?',
        a: 'Yes. Type sqrt for √, / for a fraction and pi for π, so 5√2 or 7/2 are drawn at their true length and labeled as typed.',
      },
    ],
    imageAlt: 'A printable right triangle with legs labeled 3 and 4 and the hypotenuse labeled x, made with the Triangle Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'rectangle': {
    heading: 'Rectangle and square figures drawn to scale',
    intro: [
      'The Rectangle Generator draws a rectangle from its length and width, or a square from its side, to scale, with its corners named A, B, C and D and a right-angle square in each. Each side and angle can be labeled with its measure, with text you type such as x or 2x + 3, or with nothing.',
      'Teachers use it for area and perimeter questions, for writing and solving expressions from a rectangle’s sides, and for the Pythagorean theorem with a diagonal drawn. Add a unit such as cm or ft to every length, draw one or both diagonals and name where they cross, and mark equal sides with congruence ticks.',
    ],
    settings: [
      'Kind: a rectangle from sides AB and BC, or a square from side AB, typed as numbers, fractions or square roots',
      'A label on each side and angle: its measure, text you type such as x, or nothing',
      'Congruence ticks and parallel arrows on sides, and congruence arcs on angles',
      'Diagonals AC and BD, solid, dashed or dotted, each labeled with its length, text or nothing, and a name for where they cross',
      'A unit for every length (cm, m, mm, in, ft, yd, units or your own), rounded to whole numbers, tenths or hundredths',
      'Corner names, right-angle squares on or off, which side sits at the bottom, flip and turn',
    ],
    faqs: [
      {
        q: 'Is the rectangle drawn to scale?',
        a: 'Yes. It is drawn in proportion to the lengths you type, so a 12 by 5 rectangle is more than twice as long as it is wide. It is sized to fit the figure, not drawn at its true size on paper.',
      },
      {
        q: 'Can I label a side with x or an expression?',
        a: 'Yes. Click the button after the side’s measure, choose Text and type x, 2x + 3 or anything else. The side is still drawn to the length you typed, so the rectangle keeps its shape.',
      },
      {
        q: 'How do I draw a diagonal for a Pythagorean theorem question?',
        a: 'Open Diagonals and tick Diagonal AC or Diagonal BD. Label it with its length, with text such as x, or with nothing, and draw it solid, dashed or dotted.',
      },
      {
        q: 'Can it draw a square?',
        a: 'Yes. Choose Square under Kind and type one side; the other three are the same length. Congruence marks are never added for you, so tick each side with the button after it to show they are equal.',
      },
      {
        q: 'Can I move a label that’s in the way?',
        a: 'Yes. Drag any label on the figure to move it. Reset label positions, under Labels, puts them all back.',
      },
    ],
    imageAlt: 'A printable rectangle drawn to scale, labeled 12 cm and 5 cm, with a right-angle square at each corner, made with the Rectangle Generator',
    educationalLevel: ['Elementary school', 'Middle school', 'High school'],
  },

  'parallelogram': {
    heading: 'Parallelogram and rhombus figures drawn to scale',
    intro: [
      'The Parallelogram Generator draws a parallelogram from two sides and the angle between them, or a rhombus from its side and one angle, to scale. Each side and angle can be labeled with its measure, with text you type such as x, or with nothing, and opposite sides can be marked parallel with arrows.',
      'Teachers use it for area from a base and height, for finding missing angles and sides from a parallelogram’s properties, and for a rhombus’s diagonals. Draw the height from D or C to side AB, dashed, with a right-angle square where it lands, and draw the diagonals with a name for where they cross.',
    ],
    settings: [
      'Kind: a parallelogram from sides AB and DA and ∠A, or a rhombus from side AB and ∠A',
      'A label on each side and angle: its measure, text you type such as x, or nothing',
      'Parallel arrows and congruence ticks on sides, and congruence arcs on angles',
      'Heights from D and C to AB, and diagonals AC and BD, each solid, dashed or dotted and labeled with its length, text or nothing',
      'Names for where a height lands and where the diagonals cross',
      'A unit for every length, rounding, corner names, right-angle squares, which side sits at the bottom, flip and turn',
    ],
    faqs: [
      {
        q: 'How do I show the height for an area question?',
        a: 'Open Heights and tick Height from D to AB. It is drawn dashed, with a right-angle square where it meets AB, and can be labeled with its length or with text such as h. Its length is worked out from the sides and angle you gave.',
      },
      {
        q: 'Are the parallel arrows added for me?',
        a: 'The parallelogram opens with one arrow on AB and CD and two on BC and DA, but arrows and congruence marks are otherwise set by hand, never worked out from the measures, so they don’t give answers away. Change them with the button after each side.',
      },
      {
        q: 'Can it draw a rhombus?',
        a: 'Yes. Choose Rhombus under Kind and give its side and ∠A; all four sides are the same length. Draw both diagonals to show they cross at right angles: a right-angle square appears where they do.',
      },
      {
        q: 'Can I label the angles x, y and z?',
        a: 'Yes. The button after each angle sets its label: its measure, text such as x, or nothing. An angle gets an arc when it has a label or congruence arcs.',
      },
    ],
    imageAlt: 'A printable parallelogram with base 12 cm, a dashed height of 5 cm and parallel arrows on its opposite sides, made with the Parallelogram Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'trapezoid': {
    heading: 'Trapezoid figures drawn to scale: right, isosceles and any other',
    intro: [
      'The Trapezoid Generator draws a trapezoid to scale from its bases AB and CD: a right trapezoid from the bases and leg DA, an isosceles trapezoid from the bases and height, or any other trapezoid from the bases, height and ∠A. Each side and angle can be labeled with its measure, with text you type such as x, or with nothing, and the bases can be marked parallel with arrows.',
      'Teachers use it for the area of a trapezoid, for finding a slanted leg with the Pythagorean theorem, and for angles between parallel lines. The height is drawn dashed, with a right-angle square where it lands, and the diagonals can be drawn with a name for where they cross.',
    ],
    settings: [
      'Kind: a right trapezoid (bases and leg DA), an isosceles trapezoid (bases and height) or a trapezoid (bases, height and ∠A)',
      'A label on each side, angle and extra line: its measure, text you type such as x, or nothing',
      'Parallel arrows and congruence ticks on sides, and congruence arcs on angles',
      'Heights from D and C to AB, and diagonals AC and BD, each solid, dashed or dotted',
      'Names for where a height lands and where the diagonals cross',
      'A unit for every length (cm, m, mm, in, ft, yd, units or your own), rounded to whole numbers, tenths or hundredths',
      'Corner names, right-angle squares, which side sits at the bottom, flip and turn',
    ],
    faqs: [
      {
        q: 'Is it a trapezoid or a trapezium?',
        a: 'The same shape: a quadrilateral with exactly one pair of parallel sides, its bases. Teachers in the US call it a trapezoid, and teachers in the UK a trapezium.',
      },
      {
        q: 'How do I make a trapezoid for an area question?',
        a: 'Choose Isosceles trapezoid or Trapezoid under Kind and type the two bases and the height h. The height is drawn from D, dashed, with a right-angle square where it meets AB, labeled with its measure; change the label to text such as h, or to nothing.',
      },
      {
        q: 'Why is one leg labeled x when it opens?',
        a: 'It opens on a right trapezoid with its slanted leg BC labeled x, ready for a Pythagorean theorem question. Change the label with the button after BC.',
      },
      {
        q: 'Can I type a side like 3√2 or 7/2?',
        a: 'Yes. Type sqrt for √, / for a fraction and pi for π. The side is drawn to that length, and labeled the way you typed it.',
      },
      {
        q: 'What if my measures don’t make a trapezoid?',
        a: 'The settings say which measure to fix and why, and the figure keeps the last trapezoid your measures made until they work again.',
      },
    ],
    imageAlt: 'A printable isosceles trapezoid with bases 14 cm and 8 cm, a dashed height of 4 cm and a tick on each leg, made with the Trapezoid Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'kite': {
    heading: 'Kite figures drawn to scale',
    intro: [
      'The Kite Generator draws a kite to scale from its short side AB, its long side DA and the angle at B between the short sides. It stands upright on its line of symmetry, with B at the top and D at the bottom, and opens with its short sides marked with one tick and its long sides with two.',
      'Teachers use it for the area of a kite from its diagonals, for finding missing angles from its symmetry, and for the Pythagorean theorem. Draw either diagonal solid, dashed or dotted, label each side, angle and diagonal with its measure, text such as x, or nothing, and name the point where the diagonals cross.',
    ],
    settings: [
      'Short side AB, long side DA and ∠B, typed as numbers, fractions or square roots',
      'A label on each side and angle: its measure, text you type such as x, or nothing',
      'Congruence ticks on sides and congruence arcs on angles',
      'Diagonals AC and BD, solid, dashed or dotted, labeled with their lengths, text or nothing, and a name for where they cross',
      'A unit for every length, rounding, corner names, right-angle squares, which side sits at the bottom, flip and turn',
    ],
    faqs: [
      {
        q: 'Why does the kite stand upright?',
        a: 'It is drawn on its line of symmetry, the diagonal from B to D, so its equal sides mirror each other. Under Position, pick a side to sit at the bottom instead, or turn it.',
      },
      {
        q: 'How do I set up a kite area question?',
        a: 'Open Diagonals, tick both and label each with its measure. They cross at right angles, with a right-angle square there, and the area is half their product. Diagonals 6 and 12, say, come from AB = 3√2, DA = 3√10 and ∠B = 90°.',
      },
      {
        q: 'Are the equal sides marked for me?',
        a: 'The kite opens with one tick on each short side and two on each long side, but marks are otherwise set by hand, never worked out from the measures. Change them with the button after each side.',
      },
      {
        q: 'Can I type a side like 3√2?',
        a: 'Yes. Type sqrt for √, / for a fraction and pi for π. The side is drawn to that length, and labeled the way you typed it.',
      },
    ],
    imageAlt: 'A printable kite standing upright with its diagonals drawn and labeled 6 and 12, crossing at a right angle, made with the Kite Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'regular-polygon': {
    heading: 'Regular polygons with their apothem and radius',
    intro: [
      'The Regular Polygon Generator draws a regular polygon with 3 to 20 sides, from an equilateral triangle to a 20-gon, sized by its side, its radius or its apothem. Give one of the three and it works out the other two, the interior angle and the central angle.',
      'Draw the apothem to the bottom side and a radius to the bottom right corner to make the right triangle used for area, or every radius to split the polygon into matching triangles. Mark every side and angle as equal, letter the corners, and label the side, angle, apothem and radius with their measures or with x.',
    ],
    settings: [
      'Number of sides: 3 to 20',
      'Size from its side, radius or apothem, typed as a number, fraction or square root',
      'A label on the sides and the angles, the bottom side and bottom left angle standing for them all, with congruence marks on every one',
      'A center dot and its name, the apothem, a radius and all the radii, each solid, dashed or dotted and labeled',
      'Corners lettered A, B, C…, a unit, and solved lengths rounded to whole numbers, tenths or hundredths',
      'Right-angle squares on or off, a turn, and labels dragged where you want them',
    ],
    faqs: [
      {
        q: 'What is the apothem of a regular polygon?',
        a: 'The line from the center to the middle of a side, at right angles to it, and its length. The area of a regular polygon is half its apothem times its perimeter.',
      },
      {
        q: 'Can I size the polygon by its radius or apothem instead of its side?',
        a: 'Yes. Under Size from, pick Side, Radius or Apothem and type its length. The other lengths are worked out and shown faintly in the settings, and any of them can be labeled on the figure.',
      },
      {
        q: 'Which side and angle get the labels?',
        a: 'The side’s label goes on the bottom side and the angle’s in the bottom left corner. Congruence marks go on every side and every angle, to show they are all equal.',
      },
      {
        q: 'What are the polygons past 12 sides called?',
        a: 'The generator names polygons up to the dodecagon (12 sides) and calls the rest by their number of sides, like a 15-gon.',
      },
    ],
    imageAlt: 'A printable regular hexagon with its side labeled 10 cm and a dashed apothem labeled 8.7 cm, made with the Regular Polygon Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'prism': {
    heading: 'Rectangular, triangular and other prisms, drawn to scale',
    intro: [
      'The Prism Generator draws a prism to scale from the measures you type: a rectangular prism (a box), a prism on a right or isosceles triangle, or one on a regular polygon of 3 to 8 sides. Each measure can be labeled with its number and unit, with text like x, or left off, and the edges round the back are dashed.',
      'Teachers use it for volume and surface area questions, from counting a box’s dimensions to finding a missing edge from a given volume. A triangular prism lies on its side, the way textbooks draw it, unless you stand it up, and any prism standing on its base can lean as an oblique prism.',
    ],
    settings: [
      'Base: a rectangle, a right triangle, an isosceles triangle, or a regular polygon of 3 to 8 sides',
      'Standing on its base or lying on its side, for a triangular or polygon base',
      'Right or oblique, leaning left or right, with any two of the height, the lean and the slanted edge',
      'Each measure typed as a number, a fraction or with √, and labeled with its measure, text like x, or nothing',
      'The hypotenuse or slanted side of a triangle base, and the apothem of a polygon base, worked out and labeled if you want',
      'Hidden edges dashed or left off, the height, and right-angle squares',
      'A unit (cm, m, mm, in, ft, yd, units or your own), rounding for worked-out measures, and corner names',
      'Which way the depth goes back, and labels you can drag on the figure',
    ],
    faqs: [
      {
        q: 'How do I label the height as x instead of a number?',
        a: 'Type a height so the prism is drawn to scale, then click the label button beside Height and choose Text, and type x. The figure shows x while the prism keeps its shape.',
      },
      {
        q: 'Can I show the hypotenuse of a triangular prism?',
        a: 'Yes. With a right triangle base, the hypotenuse is worked out from the base and the triangle’s height. It isn’t labeled at first; click its label button and choose Measure to show it, or Text to label it x.',
      },
      {
        q: 'How do I draw an oblique prism?',
        a: 'Under Stands, choose Oblique, then give any two of the height, the lean and the slanted edge; the third is worked out. The height is drawn dashed from the top straight down to the base’s extended line. A prism lying on its side can’t be oblique.',
      },
      {
        q: 'Does it work out the volume?',
        a: 'No. It works out missing measures, such as a hypotenuse, an apothem or a slanted edge, but never writes the volume or surface area, so the figure doesn’t give the answer away.',
      },
      {
        q: 'Can I turn off the dashed hidden edges?',
        a: 'Yes. Under Lines, turn off Hidden edges to leave only the edges you would see from the front.',
      },
    ],
    imageAlt: 'A printable rectangular prism labeled 8 cm, 3 cm and 5 cm with its hidden edges dashed, made with the Prism Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'cylinder': {
    heading: 'Right and oblique cylinders for volume and surface area',
    intro: [
      'The Cylinder Generator draws a cylinder to scale from its radius, or its diameter, and its height. The radius or diameter is drawn across the top circle, the back of the bottom circle is dashed, and each measure is labeled with its number and unit, with text like r or x, or not at all.',
      'Teachers use it for volume and surface area questions, and for formula sheets with the radius labeled r and the height h. Make it oblique to show that a leaning cylinder has the same volume as a right one with the same base and height.',
    ],
    settings: [
      'The radius, or the diameter instead, drawn right across the circle',
      'The height, or for an oblique cylinder any two of the height, the lean and the slanted edge',
      'Right or oblique, leaning left or right',
      'Each measure typed as a number, a fraction or with √, and labeled with its measure, text like r, or nothing',
      'The back of the bottom circle dashed or left off, the height of an oblique cylinder, and right-angle squares',
      'A unit (cm, m, mm, in, ft, yd, units or your own), rounding for worked-out measures, and labels you can drag on the figure',
    ],
    faqs: [
      {
        q: 'Can I label the diameter instead of the radius?',
        a: 'Yes. Tick Give the diameter instead, and type the diameter. It is drawn right across the top circle through its center and labeled with the number you type.',
      },
      {
        q: 'How do I make a formula diagram with r and h?',
        a: 'Set the unit to None, then click the label button beside each measure, choose Text, and type r for the radius and h for the height. The cylinder keeps the shape of the numbers you typed.',
      },
      {
        q: 'How do I draw an oblique cylinder?',
        a: 'Under Stands, choose Oblique and give any two of the height, the lean and the slanted edge; the third is worked out. The height is drawn dashed from the top’s center down to the base’s extended line, with a right-angle square.',
      },
      {
        q: 'Is it drawn to scale?',
        a: 'Yes, in proportion: a cylinder with a height twice its radius looks it. It isn’t true size on paper; it fits the page however big the numbers are.',
      },
    ],
    imageAlt: 'A printable cylinder with its radius labeled 4 cm and its height 10 cm, made with the Cylinder Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'pyramid': {
    heading: 'Square, rectangular and polygon pyramids with height and slant height',
    intro: [
      'The Pyramid Generator draws a pyramid to scale on a rectangle or a regular polygon of 3 to 8 sides. Give a right pyramid its height or its slant height, and the other is worked out; the height is drawn dashed from the tip down to the base, and the slant height down the middle of the front face.',
      'Teachers use it for volume and surface area questions, and for the Pythagorean theorem inside a pyramid: label the height x and give the slant height and base, or the other way round. Each measure can show its number, text like x, or nothing.',
    ],
    settings: [
      'Base: a rectangle (a square when its sides are equal) or a regular polygon of 3 to 8 sides',
      'The height or the slant height of a right pyramid, the other worked out',
      'Right or oblique, leaning left or right, with the height and the lean',
      'Each measure typed as a number, a fraction or with √, and labeled with its measure, text like x, or nothing',
      'The apothem of a polygon base, worked out and labeled if you want',
      'Hidden edges dashed or left off, the dashed height, and right-angle squares',
      'A unit (cm, m, mm, in, ft, yd, units or your own), rounding, corner names, and which way the depth goes back',
    ],
    faqs: [
      {
        q: 'What is the difference between the height and the slant height?',
        a: 'The height goes straight down from the tip to the middle of the base. The slant height goes down the middle of a sloping face to the base’s edge. The generator draws both dashed. Together with half the base’s width, they make a right triangle.',
      },
      {
        q: 'Can I give the slant height and have the height worked out?',
        a: 'Yes. On a right pyramid, type either the height or the slant height and leave the other empty; it is worked out and shown faintly in the settings. A worked-out measure isn’t labeled until you choose Measure or Text on its label button.',
      },
      {
        q: 'Can I hide the height and show only the slant height?',
        a: 'Yes. Under Lines, turn off Height. The slant height stays, for surface area questions.',
      },
      {
        q: 'Why does a rectangular pyramid only show one slant height?',
        a: 'Its front and side faces slope differently, so they have different slant heights. The generator draws the one down the front face, to the middle of the front edge.',
      },
    ],
    imageAlt: 'A printable square pyramid with base edges of 12 cm and a slant height of 10 cm, made with the Pyramid Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'cone': {
    heading: 'Right and oblique cones with radius, height and slant height',
    intro: [
      'The Cone Generator draws a cone to scale from its radius, or its diameter, and its height or its slant height, working out the other. The height and radius are drawn dashed with a right-angle square between them, so the right triangle inside the cone is there to see.',
      'Teachers use it for volume and surface area questions and for the Pythagorean theorem: label the slant height x and give the height and radius. Label each measure with its number and unit, with text like r or x, or nothing.',
    ],
    settings: [
      'The radius, or the diameter instead, drawn across the base',
      'The height or the slant height of a right cone, the other worked out',
      'Right or oblique, leaning left or right, with the height and the lean',
      'Each measure typed as a number, a fraction or with √, and labeled with its measure, text like x, or nothing',
      'The back of the base circle dashed or left off, the dashed height, and right-angle squares',
      'A unit (cm, m, mm, in, ft, yd, units or your own), rounding for worked-out measures, and labels you can drag on the figure',
    ],
    faqs: [
      {
        q: 'How do I label the slant height as x?',
        a: 'Type the radius and the height, then click the label button beside Slant height, choose Text and type x. The slant height is worked out to draw the cone, but the figure shows only x.',
      },
      {
        q: 'Can I give the slant height instead of the height?',
        a: 'Yes. Type the slant height and leave the height empty, and the height is worked out. The slant height has to be longer than the radius.',
      },
      {
        q: 'How do I draw an oblique cone?',
        a: 'Under Stands, choose Oblique, then give the height and the lean. The height is drawn dashed from the tip down to the base’s extended line, and the lean along that line from the base’s center. An oblique cone has no single slant height, so it has none to label.',
      },
      {
        q: 'Can I show just the diameter?',
        a: 'Yes. Tick Give the diameter instead and type the diameter. It is drawn right across the base through its center.',
      },
    ],
    imageAlt: 'A printable cone with its dashed height labeled 9 cm and its radius 4 cm, made with the Cone Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'sphere': {
    heading: 'Spheres and hemispheres with the radius or diameter labeled',
    intro: [
      'The Sphere Generator draws a sphere with a circle round its middle, its back half dashed, and the radius drawn from the center to the edge, or the diameter right across. It also draws a hemisphere, with its flat face down like a dome or up like a bowl.',
      'Teachers use it for volume and surface area questions on spheres and hemispheres, such as how much a bowl holds or how much paint covers a dome. Label the radius or diameter with its number and unit, with text like r, or nothing.',
    ],
    settings: [
      'A whole sphere or a hemisphere',
      'The radius, or the diameter instead',
      'A hemisphere’s flat face down, like a dome, or up, like a bowl',
      'The radius or diameter labeled with its measure, text like r, or nothing',
      'The dashed back of the middle circle, or left off',
      'A unit (cm, m, mm, in, ft, yd, units or your own), and a label you can drag on the figure',
    ],
    faqs: [
      {
        q: 'How do I draw a hemisphere?',
        a: 'Under Draw, choose A hemisphere. Under Position, choose whether its flat face is down, like a dome, or up, like a bowl.',
      },
      {
        q: 'Can I label the diameter instead of the radius?',
        a: 'Yes. Tick Give the diameter instead and type the diameter. It is drawn right across the sphere through its center.',
      },
      {
        q: 'Why is part of the middle circle dashed?',
        a: 'The circle round the sphere’s middle is drawn like an ellipse seen from a little above, and its back half, which you couldn’t see through the front, is dashed. Turn off Hidden edges under Lines to leave it off.',
      },
    ],
    imageAlt: 'A printable sphere with its radius labeled 6 cm, made with the Sphere Generator',
    educationalLevel: ['Middle school', 'High school', 'Geometry'],
  },

  'box-plot': {
    heading: 'Box plots from your data',
    intro: [
      'The Box Plot Generator draws a box plot from the numbers you type or paste: a box from Q1 to Q3 split at the median, with whiskers out to the minimum and maximum, over a number line. Five numbers in order are read as a five-number summary instead, so you can draw a box plot straight from one. Quartiles are worked out as the TI-84 does, leaving out the median when the count is odd.',
      'Nothing on the figure gives the five-number summary away unless you ask, so students read it from the number line. Give Q1, the median or Q3 a label with its value, or a letter for students to name. Add more data sets to compare box plots over the same number line, each with its name beside it.',
    ],
    settings: [
      'One or more data sets, typed or pasted as numbers, or as a five-number summary, each with an optional name',
      'A label on the minimum, Q1, the median, Q3 or the maximum: its value, typed text like x or A, or nothing',
      'Outliers drawn as dots of their own, with the whiskers stopping at the last value that isn’t one',
      'The number line’s range and count-by, worked out from the data unless you type them, and which ticks are numbered',
      'A chart title and an axis title, as text or a blank line for students',
      'How each end of the number line finishes: an arrow, a circle or nothing',
    ],
    faqs: [
      {
        q: 'How are the quartiles worked out?',
        a: 'Q1 is the median of the lower half of the data and Q3 the median of the upper half. When there is an odd number of values, the median itself is left out of both halves. That is how the TI-84 and most US textbooks do it.',
      },
      {
        q: 'Can I make a box plot from a five-number summary?',
        a: 'Yes. Type the minimum, Q1, median, Q3 and maximum in order, like 12, 18, 25, 31, 40, and it is read as a five-number summary. If those five numbers are really your data, click Read as data instead.',
      },
      {
        q: 'How do I compare two box plots?',
        a: 'Click Add data set and type the second set of numbers. Every box plot is drawn over the same number line, top to bottom, so students can compare medians and spreads straight down. Name each data set, like Class A and Class B, to label it.',
      },
      {
        q: 'Does it show outliers?',
        a: 'Only when you turn on Show outliers. A value more than 1.5 times the box’s width past either end of the box is then drawn as its own dot, and the whisker stops at the last value that isn’t an outlier. Otherwise the whiskers reach the minimum and maximum.',
      },
      {
        q: 'Are the median and quartiles written on the figure?',
        a: 'Not unless you give them a label, so the figure doesn’t give the answers away. The settings panel shows each data set’s five-number summary for you to check, and the Box plot settings can label any of the five with its value or with text.',
      },
    ],
    imageAlt: 'A printable box plot of 15 test scores over a number line from 60 to 100, titled Test scores, made with the Box Plot Generator',
    educationalLevel: ['Middle school', 'High school'],
  },

  'bar-graph': {
    heading: 'Bar graphs and column graphs from a table',
    intro: [
      'The Bar Graph Generator draws a bar graph from a table you type or paste: a category on each row, like Soccer or Swimming, and its value. Bars stand up as columns or run sideways, over a value axis fitted to the data unless you type its range. Add a column to the table for a double bar graph, with the bars side by side or stacked and a key naming each set.',
      'Leave a category’s value empty and its name stays with no bar, for students to draw from a table. Write the values on the bars or leave them for students to read from the axis. For science, give each bar a ± value to draw error bars, such as the standard error of a mean.',
    ],
    settings: [
      'The table: categories down the side and one or more series across the top, typed or pasted from a spreadsheet',
      'Upright columns or sideways bars; for several series, side by side or stacked; narrow, medium or wide bars',
      'Values written at the end of each bar or inside it, or not at all',
      'Error bars from a ± value for each bar, with or without crossbars, and a note under the graph saying what they show',
      'Color, black-and-white fills that photocopy, or white bars to shade, with a fill picked for each series, and a key on the right or below',
      'A chart title and axis titles, as text or a blank line for students',
      'The value axis’s range and count-by, worked out from the data unless you type them, which lines are numbered, and the gridlines',
    ],
    faqs: [
      {
        q: 'What is the difference between a bar graph and a column graph?',
        a: 'Nothing but the direction. A column graph is a bar graph with upright bars; in the UK and Australia “bar chart” often means sideways bars. Pick Columns or Bars under Direction to switch between them.',
      },
      {
        q: 'How do I make a double bar graph?',
        a: 'Type a heading in the + column at the end of the table, like Girls, and its values under it; name the first column too, like Boys. Each category then gets two bars side by side, and a key names them. Choose Stacked to put one on top of the other instead.',
      },
      {
        q: 'Can I paste data from a spreadsheet?',
        a: 'Yes. Copy the cells in Excel or Google Sheets, with the category names in the first column and a heading row if you like, and paste anywhere in the table. It replaces what was there.',
      },
      {
        q: 'How do I add error bars?',
        a: 'Turn on Error bars and type each bar’s ± value, such as its standard error, in the ± column beside it, or paste a column headed SEM, SD or ± after the values. Each bar gets a line from its value minus that amount to its value plus it. Error bars are drawn on side-by-side bars, not stacked ones.',
      },
      {
        q: 'How do I leave a bar for students to draw?',
        a: 'Type the category’s name and leave its value empty. Its name stays under the axis with no bar, so students can draw the bar from a table or a description.',
      },
    ],
    imageAlt: 'A printable bar graph of favorite sports, with a column for each sport over a value axis titled Number of students, made with the Bar Graph Generator',
    educationalLevel: ['Elementary school', 'Middle school', 'High school'],
  },

  'stem-and-leaf': {
    heading: 'Stem-and-leaf plots from a data set',
    intro: [
      'The Stem-and-Leaf Plot Generator draws a stem-and-leaf plot from numbers you type or paste. Each value is split into a stem, written down the left, and a leaf, its last digit, written across its stem’s row, with every stem from the lowest to the highest shown and a key under the plot. Leaves line up in even columns, so the rows compare like bars.',
      'Put two data sets back to back to compare them, with one set’s leaves running left from the stems and the other’s running right. Leave the data empty for a plot students fill in: type the first and last stems for empty rows, or put the leaves in boxes for empty boxes. Under the data you can read each set’s n, minimum, maximum, range, median, mode and quartiles.',
    ],
    settings: [
      'One data set, or two back to back with a name for each',
      'The leaf unit: the last digit typed, or 0.01, 0.1, 1, 10 or 100, with digits past it cut off, not rounded',
      'Each stem on one row, split into two (leaves 0–4 and 5–9) or into five',
      'The first and last stems, to start or end the plot past the data, or to draw empty rows with no data',
      'Leaves in order or as typed, and negative values on negative stems, with −0 apart from 0',
      'Headings, and leaves in boxes with empty boxes up to a count in each row',
      'A key written with = or “means” and a unit, its example value, a blank line for students, or no key',
      'A chart title, as text or a blank line for students',
    ],
    faqs: [
      {
        q: 'How do I make a stem-and-leaf plot?',
        a: 'Type or paste the data, separated by commas or spaces. Each value’s last digit becomes its leaf and the digits before it its stem, so 34 is written 3 | 4. The leaves are put in order and the key is written for you.',
      },
      {
        q: 'How do I make a back-to-back stem-and-leaf plot?',
        a: 'Choose Back-to-back at the top of the Data card, then type the two data sets and name them, like Class A and Class B. The first set’s leaves run left from the stems and the second’s run right, and the key names both.',
      },
      {
        q: 'What happens to decimals?',
        a: 'The leaf is the last digit typed, so 2.3 is written 2 | 3 and 1.25 is written 1.2 | 5. Pick a leaf unit to change it. Digits past the leaf unit are cut off, not rounded, as textbooks do, and the values that were cut are listed under the data.',
      },
      {
        q: 'What are split stems?',
        a: 'When many values share a stem, each stem can take two rows, one for leaves 0 to 4 and one for 5 to 9, or five rows, one for each pair of digits. Choose Twice or 5 times under Rows for each stem.',
      },
      {
        q: 'How do I make a blank stem-and-leaf plot for students?',
        a: 'Leave the data empty and type the first and last stems, for stems with empty rows. Turn on Leaves in boxes and type how many boxes go in each row for empty boxes. With nothing typed at all, the stems are left blank too. Set the key to a blank line for students to write it.',
      },
    ],
    imageAlt: 'A printable stem-and-leaf plot of test scores with stems from 5 to 9 and a key, made with the Stem-and-Leaf Plot Generator',
    educationalLevel: ['Elementary school', 'Middle school', 'High school'],
  },

  'cumulative-frequency': {
    heading: 'Cumulative frequency graphs from a frequency table',
    intro: [
      'The Cumulative Frequency Graph Generator draws a cumulative frequency graph from a frequency table, a cumulative table or a data set. Each point is plotted at a bin’s upper bound against the running total up to it, starting from 0 at the lowest bound, and the points are joined by a smooth curve or straight lines. The axes fit the data unless you type their ranges.',
      'Dashed lines read the median and quartiles off the curve, or any percentile, or go up from a value to estimate how many are below it. Each value is written at the axis, left as a blank line for students, or left off. Every reading is taken from the curve as drawn, so it matches what students measure on the printed graph.',
    ],
    settings: [
      'The data: a frequency table of each bin’s upper end and frequency, a cumulative table of upper bounds, or a data set sorted into bins of a width you choose, with no inequalities to type',
      'Crosses or dots at the points, joined by a smooth curve, straight lines or nothing, starting from 0 at the lowest bound or not',
      'A vertical axis of cumulative frequency or cumulative percent',
      'Reading lines for the median, lower and upper quartiles, any percentile, across from a cumulative frequency or up from a value, each with its value, a blank line or neither',
      'Color, or black and white for printing',
      'A chart title and axis titles, as text or a blank line for students',
      'Each axis’s range and count-by, worked out from the data unless you type them, which lines are numbered, and the gridlines',
    ],
    faqs: [
      {
        q: 'Where are the points of a cumulative frequency graph plotted?',
        a: 'At the upper bound of each bin, against the running total up to that bound. The graph starts with a point at the lowest bound and 0, as GCSE mark schemes expect; turn off Start from 0 at the lowest bound to leave it out.',
      },
      {
        q: 'Is a cumulative frequency graph the same as an ogive?',
        a: 'Yes. US textbooks often call it an ogive and draw it with straight lines and a percent axis. Choose Straight lines under Join and Cumulative percent for the vertical axis to draw it that way.',
      },
      {
        q: 'How are the median and quartiles found?',
        a: 'A dashed line runs across from half of n (a quarter and three quarters for the quartiles) to the curve, then down to the horizontal axis. The value is read where that line meets the curve as drawn, to a tenth of a block, so a smooth curve and straight lines can give slightly different answers, as they do on paper. The panel lists the median, quartiles and interquartile range.',
      },
      {
        q: 'Can I type a cumulative frequency table instead?',
        a: 'Yes. Choose Cumulative table, type where the first bin starts, then each upper bound with its running total, or paste the table. The curve starts from 0 where the first bin starts.',
      },
      {
        q: 'How do I make a graph for students to draw on?',
        a: 'Choose None under Join for the points alone, so students draw the curve. For blank axes, leave the data empty and type each axis’s range. To have students read a value, draw its lines and choose Blank for its value.',
      },
    ],
    imageAlt: 'A printable cumulative frequency curve of the heights of 80 students, with dashed lines reading off the median and quartiles, made with the Cumulative Frequency Graph Generator',
    educationalLevel: ['Middle school', 'High school'],
  },

  'two-way-table': {
    heading: 'Two-way tables with totals, blanks and relative frequencies',
    intro: [
      'The Two-Way Table Generator draws a two-way table from the counts you type or paste: one category down the side, like Year 7, Year 8 and Year 9, and another across the top, like Walk, Bus and Car, with a Total column, a Total row and the grand total. Title the variables across the top and down the side, or put both in a corner split by a diagonal.',
      'Every cell, totals included, is written as you type it. Leave a cell empty and it’s blank on the table, or type a letter like x, for students to find. Work out totals fills in the totals the counts give, and the panel says whether the missing values can be worked out from the cells shown, and what each one is. Switch to relative frequencies of the grand total, of each row or of each column, written as decimals, percents or fractions.',
    ],
    settings: [
      'The table: row categories down the side and column categories across the top, typed or pasted from a spreadsheet, totals included',
      'A Total column and a Total row, each on or off, filled in for you or typed',
      'Any cell left blank or written as a letter, and whether the missing values can be worked out from the rest',
      'Counts, or relative frequencies of the grand total, each row or each column, as decimals or percents rounded to a set number of places, or as fractions in lowest terms',
      'A table title, as text or a blank line for students, and a title for each variable, outside the table or in a corner split by a diagonal',
      'Gray or plain headings, lines round every cell or only under the headings and before the totals, and totals in bold',
    ],
    faqs: [
      {
        q: 'How do I leave cells for students to fill in?',
        a: 'Leave them empty. An empty cell is blank on the table, totals included. Type a letter like x instead to label one for an equation. Under the table, the panel says whether every missing value can be worked out from the cells shown, and gives each one.',
      },
      {
        q: 'Do I have to type the totals?',
        a: 'No. Type the counts and click Work out totals, which fills in every total it can. Then empty any total that students should work out.',
      },
      {
        q: 'Can it show relative frequencies?',
        a: 'Yes. Choose Relative frequencies at the top of the table, then whether each cell is divided by the grand total (joint relative frequencies), by its row’s total or by its column’s total (conditional relative frequencies). They’re written as decimals or percents, rounded as you choose, or as fractions in lowest terms. You still type the counts.',
      },
      {
        q: 'Can I paste a table from a spreadsheet?',
        a: 'Yes. Copy the cells in Excel or Google Sheets, with the row names in the first column and the column headings in the first row, and paste anywhere in the table. A last column headed Total and a last row named Total become the totals.',
      },
      {
        q: 'How do I split the corner with a diagonal?',
        a: 'Type the titles under Titles, such as Transport across the top and Year down the side, then choose Split by a diagonal under Corner. Both titles go in the corner cell, on either side of the line.',
      },
    ],
    imageAlt: 'A printable two-way table of how students in Years 7, 8 and 9 travel to school, by walking, bus or car, with totals and some cells left blank, made with the Two-Way Table Generator',
    educationalLevel: ['Middle school', 'High school', 'Algebra 1'],
  },

  'histogram': {
    heading: 'Histograms from a data set or a frequency table',
    intro: [
      'The Histogram Generator draws a histogram from a data set you type or paste, sorted into bins of the width you give or one that fits the data, or from a frequency table of bins and their frequencies. In a table you type where the first bin starts, then each bin’s upper end and its frequency, with no inequalities to type. Bins can be unequal, in which case the vertical axis shows frequency density so each bar’s area stands for its frequency.',
      'The horizontal axis is numbered at the bin edges, with a zig-zag break when it starts past 0, such as for heights from 150 cm. Draw a frequency polygon over the bars or on its own. Leave a frequency empty for a bar students draw, or hide the vertical axis’s numbers for students to work out the scale from one bar.',
    ],
    settings: [
      'A data set, with where the bins start, their width, and which bin holds a value on an edge',
      'Or a frequency table: where the first bin starts, then each bin’s upper end and its frequency, equal or unequal bins, or a table pasted from a worksheet',
      'Frequency, relative frequency as a decimal or a percent, or frequency density on the vertical axis',
      'Bars filled with a color, gray, a black-and-white fill or white, and each bar’s frequency written above it',
      'A frequency polygon over the bars or alone, closed down to the axis or left open',
      'The horizontal axis numbered at the bin edges or every step of a range you type',
      'A chart title and axis titles, as text or a blank line for students',
      'The vertical axis’s range and count-by, worked out from the data unless you type them, which lines are numbered, and the gridlines',
    ],
    faqs: [
      {
        q: 'What is the difference between a histogram and a bar graph?',
        a: 'A histogram’s bars touch, because its bins run on from one to the next along a numbered axis, like heights from 150 to 190 cm. A bar graph’s bars stand apart, one for each named category, like favorite sports. Use the Bar Graph Generator for those.',
      },
      {
        q: 'How do I make a histogram with unequal class widths?',
        a: 'Choose Frequency table, type where the first bin starts, like 0, then each bin’s upper end with its frequency, like 10, then 15. With unequal bins the vertical axis shows frequency density, each bin’s frequency divided by its width, as GCSE Higher papers use. You can still pick frequency, but the panel warns you that the bars’ areas won’t match the frequencies.',
      },
      {
        q: 'Which bin does a value on an edge go in?',
        a: 'The bin that starts there, so 20 goes in 20 ≤ x < 30. Under the data set you can pick the bin that ends there instead (10 < x ≤ 20), as many UK papers write it. In a frequency table only the bins’ ends are typed, so it doesn’t matter.',
      },
      {
        q: 'Why does the panel say my bins have a gap?',
        a: 'Bins pasted as whole numbers, like 10–19 and 20–29, leave a gap of 1 between them. For whole-number data the bars meet halfway, so the generator offers to start at 9.5 and go up to 19.5, 29.5 and so on; click Use these bins to switch.',
      },
      {
        q: 'How do I draw a frequency polygon?',
        a: 'Under Bars, choose a frequency polygon over the bars or alone. It joins the middle of the top of each bar, and is closed down to the axis half a bin past each end unless you leave it open.',
      },
      {
        q: 'How do I leave a bar for students to draw?',
        a: 'Choose Frequency table (it starts from your data set’s bins if you typed one) and empty that bin’s frequency. The bin stays on the axis with no bar. Empty every frequency for a blank histogram with its axes set up.',
      },
    ],
    imageAlt: 'A printable histogram of student heights, with touching bars over bins from 150 to 180 cm and a zig-zag break on the horizontal axis, made with the Histogram Generator',
    educationalLevel: ['Middle school', 'High school'],
  },

  'venn-diagram': {
    heading: 'Venn diagrams with numbers, elements or shading',
    intro: [
      'The Venn Diagram Generator draws one, two or three circles inside a box for the universal set, marked U unless you choose ξ (as GCSE papers write it), S, ε, a word or nothing. Two sets can overlap, sit apart for mutually exclusive events, or one can sit inside the other for a subset. Each set is named outside its circle, with a letter like A or a word like Football.',
      'Put a number in each region for counting and probability questions, a letter or expression like x or 2x + 1 for algebra, or words to compare and contrast, like red flesh, mushy, savory, one to a line. Or list the members of each set, or a range like 1-20, and every element is sorted into its region for you, prime factors included. Click any region on the figure to fill it in or shade it, and leave regions empty for students to fill in.',
    ],
    settings: [
      'Text mode: whatever you type in each region, a number, a letter, an expression or words for comparing two things, with commas splitting it into lines. Sets mode: each set’s members, sorted into the regions where the sets meet',
      'One, two or three sets; two sets overlapping, separate, or one inside the other',
      'Each set’s name, as a letter or a word',
      'The universal set’s name: U, ξ, S, ε, a word or nothing',
      'Any regions shaded, in a color tint, gray or a black-and-white pattern',
      'Empty regions left empty or given a blank line for students',
    ],
    faqs: [
      {
        q: 'How do I shade a region, like A ∩ B′?',
        a: 'Click the region on the figure and tick Shaded, or tick it in the list of regions under Sets. A ∩ B′ is the part of A outside B, called A only in the list. Pick the fill under Shading: a color tint, gray, or hatching or dots that photocopy well.',
      },
      {
        q: 'Can it sort numbers into the diagram for me?',
        a: 'Yes. Choose Sets, type the universal set (like 1-20) and each set’s members (like 2, 4, 6, 8), and each number is written in the region of every set it belongs to. An element that’s in a set but not in the universal set is pointed out so you can fix it.',
      },
      {
        q: 'How do I make a prime factor Venn diagram for the HCF and LCM?',
        a: 'Choose Sets and name the sets after the two numbers. Type each number’s prime factors with repeats, like 2, 2, 3, 3 for 36 and 2, 2, 3, 5 for 60. Each repeated factor is another copy, so the factors the numbers share go in the middle.',
      },
      {
        q: 'Can I use it for probability?',
        a: 'Yes. Type a probability in each region, like 0.3, or choose Text for fractions and unknowns like x. Leave a region empty, or give empty regions a blank line, for students to work out.',
      },
      {
        q: 'Can I use ξ for the universal set?',
        a: 'Yes. The box is marked U to start with; GCSE papers in England write the universal set as ξ, which is one click away under Labels, along with S, ε, a word or nothing.',
      },
    ],
    imageAlt: 'A printable Venn diagram of students who play football and tennis, with the number of students in each region, made with the Venn Diagram Generator',
    educationalLevel: ['Middle school', 'High school'],
  },

  'pie-chart': {
    heading: 'Pie charts and circle graphs from a table',
    intro: [
      'The Pie Chart Generator draws a pie chart from a table you type or paste: a category on each row, like Apples or Bananas, and its count, percent or angle in degrees. The sectors run clockwise from 12 o’clock, as pie charts are drawn by hand, in the order typed or largest first. Each sector is labeled inside where it fits, or outside with a short leader line, by its name, value, percent, angle or fraction, or by a key.',
      'Leave a value empty and its share of the circle is left as one empty sector, for students to complete the pie chart; leave every value empty for a blank circle with its center marked and a radius drawn up to 12 o’clock. Give one sector a blank line or a letter (x°) instead of its label, for students to measure with a protractor or work out a missing angle.',
    ],
    settings: [
      'The table: a category and a value on each row, typed or pasted from a spreadsheet, as counts, percents or degrees, with the total for counts',
      'The sectors in the order typed or largest first, and a center dot',
      'Sector labels by name, value, percent, angle or fraction, or a name and a number, with any sector’s own label, a blank line or a letter',
      'Color, black-and-white fills that photocopy, or white sectors to shade, with a fill picked for each sector, and a key on the right or below',
      'A chart title, as text or a blank line for students',
    ],
    faqs: [
      {
        q: 'How do you work out the angles for a pie chart?',
        a: 'Divide each category’s value by the total and multiply by 360°. Out of 30 students, 12 is 12 ÷ 30 × 360° = 144°. The table under the data shows each category’s angle, percent and fraction of the whole.',
      },
      {
        q: 'Is a pie chart the same as a circle graph?',
        a: 'Yes. Circle graph is the usual name in US middle school, and pie chart in the UK and Australia. Both are a circle cut into sectors whose angles show each category’s share of the whole.',
      },
      {
        q: 'Can I type percents or angles instead of counts?',
        a: 'Yes. Choose Percents or Degrees under Values are. If they add up to less than 100% or 360°, the rest is left as an empty sector and the panel says so; if they add up to more, the sectors are shrunk to fit the circle.',
      },
      {
        q: 'How do I make a pie chart for students to complete?',
        a: 'Type every category, but leave the values empty for the sectors students should draw. With counts, type the total too, so the circle leaves room for them. The sectors you gave values are drawn and the rest is one empty sector. Leave every value empty for a blank circle.',
      },
      {
        q: 'How do I label a missing angle x?',
        a: 'Type the sector’s value, then under Labels pick Letter (x°) for it. Its label becomes x°, or x% when the chart is labeled by percents, and the next sector given a letter gets y.',
      },
    ],
    imageAlt: 'A printable pie chart of favorite fruit, with a colored sector for each fruit labeled with its name and percent, made with the Pie Chart Generator',
    educationalLevel: ['Middle school', 'High school'],
  },

  'mapping-diagram': {
    heading: 'Mapping diagrams for functions and relations',
    intro: [
      'The Mapping Diagram Generator draws two lists side by side, the inputs on the left and the outputs on the right, with an arrow from each input to each output you choose. Type or paste each list, or paste ordered pairs to fill in both lists and the arrows at once. Items can be numbers, math like 2x or 1/2, or words.',
      'It can show a function or a relation that isn’t one. The settings panel tells you which, and why not, but nothing on the figure says so, so students can decide. Leave the arrows off for students to draw them from a rule or a table.',
    ],
    settings: [
      'The inputs and outputs, typed or pasted as lists, or as ordered pairs',
      'The arrows: click the outputs each input goes to, match them in order, or clear them',
      'A title over each side (Input and Output unless you change them) and a diagram title, as text or a blank line for students',
      'Each side drawn in an oval, a box or nothing',
    ],
    faqs: [
      {
        q: 'How can you tell from a mapping diagram if it is a function?',
        a: 'A mapping diagram shows a function when every input has exactly one arrow. If an input has two arrows, or none, it isn’t a function. Two inputs can share an output; that is still a function, just not a one-to-one one.',
      },
      {
        q: 'Can I type ordered pairs instead of two lists?',
        a: 'Yes. Open Or paste ordered pairs, type pairs like (1, 3), (2, 5), (3, 7), and click Use these pairs. It fills in both lists and the arrows, replacing what was there.',
      },
      {
        q: 'Can I make a mapping diagram with no arrows?',
        a: 'Yes. Type the inputs and outputs and leave the arrows off, or click Clear arrows. Students draw the arrows from a rule or a list of ordered pairs.',
      },
      {
        q: 'Can the inputs and outputs be words?',
        a: 'Yes. Items can be numbers, math like 2x, or words such as names and sports. Each side shows an item once, in the order you typed it, even if you typed it twice.',
      },
    ],
    imageAlt: 'A printable mapping diagram with inputs 1, 2, 3 and 4 in an oval, outputs 3, 5, 7 and 9 in another, and one arrow from each input, made with the Mapping Diagram Generator',
    educationalLevel: ['Middle school', 'High school', 'Algebra 1'],
  },

  'circle': {
    heading: 'Circle diagrams for circle theorems, arcs and sectors',
    intro: [
      'The Circle Generator draws a circle with its center and points on it, joined by radii, diameters, chords and secants, with tangents at points or from a point outside the circle. Drag a point round the circle, or pull it off to make a point outside, and the figure stays drawn to scale, so every angle and arc measure is exact.',
      'Teachers use it for central and inscribed angles, the angle in a semicircle, cyclic quadrilaterals, tangents and radii, the alternate segment theorem, intersecting chords and secants, and the area of a sector or segment. Click any angle, arc, line or enclosed area on the figure to label it with its measure or with text like x, mark it, or shade it.',
    ],
    settings: [
      'Points on the circle by their direction from the center, or off it by their distance in radii, each with a name, typed in or dragged on the figure',
      'Lines between the center, points, midpoints and touch points: radii, diameters, chords and secants, each end stopping at its point or running on with an arrow, a line arrow or a dot',
      'Tangents at points on the circle, and either or both tangents from a point outside it',
      'Each angle labeled with its measure or text, with congruence arcs or a right-angle square, which a right angle gets on its own',
      'Each arc labeled in degrees, by its length or with text, with congruence ticks, drawn bold, in a color or hidden; each line labeled with its length or text, with ticks and parallel arrows, solid, dashed or dotted',
      'Enclosed areas, such as a sector or a segment, shaded in a color, with their areas given beside the figure in terms of π and as decimals',
      'Names where lines cross or meet the circle, an inscribed polygon of 3 to 8 sides, the radius and unit, rounding, and small, medium or large labels',
    ],
    faqs: [
      {
        q: 'How do I draw a line from one point to another?',
        a: 'Click a point on the figure and pick the point to join it to under Join to, or use Add line in the Lines list and pick its two ends. The line is named for what it is: a radius, diameter, chord or secant.',
      },
      {
        q: 'Can I draw a point outside the circle?',
        a: 'Yes. Drag a point on the circle well away from it, or type its distance from the center in radii, where 1 is on the circle. Its popup then draws either or both tangents from it, and lines from it that run on through the circle are secants.',
      },
      {
        q: 'How do I shade a sector or a segment?',
        a: 'Draw the lines that close it off, two radii for a sector or a chord for a segment, then click inside it and pick a color. Its area appears under Measures in terms of π and as a decimal, worked out from the radius you give.',
      },
      {
        q: 'How do I draw the line from the center to the middle of a chord?',
        a: 'Click the middle of the chord on the figure and join its midpoint to the center, or use Add midpoint line. It meets the chord at a right angle, marked with a square, and the chord’s congruence ticks move onto its two halves.',
      },
      {
        q: 'Can a figure not match the measures, for a problem with numbers that don’t fit the drawing?',
        a: 'Measure labels are always exact, since the figure is drawn to scale. For other numbers, label the angle, arc or line with text instead, and type what you want it to say.',
      },
    ],
    imageAlt: 'A printable circle with center O, a central angle of 120° and an inscribed angle x on the same arc, made with the Circle Generator',
    educationalLevel: ['High school', 'Geometry'],
  },
  'length-reading': {
    heading: 'Ruler figures for measuring length',
    intro: [
      'The Length Reading Generator draws a centimeter or inch ruler with an object lying along it: marbles, a rock, a cube or a metal cylinder. You type the object’s length and where its left end sits, and students measure it, either lined up with 0 or starting partway along so they read both ends and subtract.',
      'An inch ruler is read in fractions of an inch, marked down to halves, quarters, eighths or sixteenths, for measuring to the nearest quarter or eighth inch. A metric ruler can be marked in millimeters or only in centimeters, and read to the nearest mark or to one estimated digit past it. Magnifiers on the object’s ends keep the marks readable in print, and the answer key prints the length.',
    ],
    settings: [
      'An inch ruler, 6, 8, 12 or 20 in long, marked every 1, 1/2, 1/4, 1/8 or 1/16 in',
      'A metric ruler, 15, 20, 30, 50 or 100 cm long, marked every 1 mm, 0.5 cm or 1 cm (or 5 or 10 cm on the long ones)',
      'Metric lengths read to the nearest mark or to one estimated digit',
      'The object’s length and left end, typed, picked at random, or set by dragging the object along the ruler',
      'The object: 1 to 5 marbles in a row, a rock, a cube or a metal cylinder, with dashed lines down from its ends if you like',
      'Magnifiers on its ends, a chart title, and an answer key line',
    ],
    faqs: [
      {
        q: 'Can I make questions for measuring to the nearest quarter inch?',
        a: 'Yes. Choose Imperial (in) and mark the ruler every 1/4 in. Lengths land on a mark and are read as fractions of an inch, so an object can be 3 1/4 in long. Mark it every 1/8 or 1/16 in for finer measuring.',
      },
      {
        q: 'Can the object start somewhere other than 0?',
        a: 'Yes. Type where its left end sits, or drag the object along the ruler in the figure. Students then read both ends and subtract, and the answer key gives both ends as well as the length.',
      },
      {
        q: 'Can I show a ruler marked only in centimeters?',
        a: 'Yes. Under Ruler, choose Metric (cm) and mark it every 1 cm, then read to the nearest mark for whole centimeters. Mark it every 1 mm for lengths like 8.4 cm, or 84 mm.',
      },
      {
        q: 'What are the dashed lines at the object’s ends for?',
        a: 'A marble or a rock touches the ruler below its widest point, so its ends sit above the marks they line up with. The dashed lines drop from each end down to the ruler to show where to read.',
      },
    ],
    imageAlt: 'A printable 6 inch ruler marked in quarter inches with a metal cylinder lying along it and a magnified view of its right end, made with the Length Reading Generator',
    educationalLevel: ['Elementary school', 'Middle school'],
  },
}

/** The copy for a generator; every generator on the site has some. */
export function copyFor(id: string): GeneratorCopy {
  const copy = COPY[id]
  if (!copy) throw new Error(`No page copy for the ${id} generator`)
  return copy
}
