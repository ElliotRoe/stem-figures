// Chemistry Figures' generators. See ./index.ts.

import type { CatalogEntry } from './index'

export const CHEMISTRY: CatalogEntry[] = [
  {
    id: 'volume-reading',
    site: 'chemistry',
    name: 'Volume Reading',
    path: '/volume-reading',
    blurb: 'A graduated cylinder, buret, or beaker showing the volume you type.',
    description:
      'Make printable graduated cylinder, buret and beaker figures for chemistry tests. Type a volume and students read it from the meniscus, with a magnified view for the estimated digit.',
    keywords: ['graduated', 'cylinder', 'buret', 'burette', 'beaker', 'meniscus', 'volume', 'mL', 'milliliters', 'cm3', 'cm³', 'cubic', 'centimeters', 'centimetres', 'measurement', 'lab', 'glassware'],
  },
  {
    id: 'volume-by-displacement',
    site: 'chemistry',
    name: 'Volume by Displacement',
    path: '/volume-by-displacement',
    blurb: 'A graduated cylinder before and after an object is dropped in.',
    description:
      'Make printable water displacement figures for chemistry tests. Type the before and after readings and get two graduated cylinders, with an object in the second, for students to find its volume.',
    keywords: ['water', 'displacement', 'displaced', 'graduated', 'cylinder', 'object', 'marble', 'rock', 'cube', 'metal', 'irregular', 'solid', 'volume', 'density', 'mL', 'cm3', 'cm³', 'cubic', 'centimeters', 'centimetres', 'measurement', 'lab'],
  },
  {
    id: 'gas-syringe',
    site: 'chemistry',
    name: 'Gas Syringe',
    path: '/gas-syringe',
    blurb: 'A gas syringe showing the volume of gas you type, alone or collecting from a flask.',
    description:
      'Make printable gas syringe figures for chemistry tests. Type a volume of gas in cm³ or mL and students read it from the plunger of a 50 or 100 cm³ syringe, alone or set up with a conical flask and stand, with a magnified view for the estimated digit.',
    keywords: ['gas', 'syringe', 'plunger', 'collecting', 'collection', 'rate', 'reaction', 'volume', 'cm3', 'mL', 'conical', 'flask', 'delivery', 'tube', 'measurement', 'lab', 'apparatus'],
  },
  {
    id: 'structure-editor',
    site: 'chemistry',
    kind: 'editor',
    name: 'Organic Structure Editor',
    path: '/structure-editor',
    blurb: 'Draw an organic molecule once, then show it skeletal, condensed or with every bond.',
    description: 'Organic molecules as skeletal, condensed or full structural formulas.',
    keywords: ['organic', 'structural', 'formula', 'structure', 'skeletal', 'line', 'condensed', 'displayed', 'full', 'expanded', 'draw', 'drawing', 'editor', 'molecule', 'carbon', 'hydrogen', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol', 'ester', 'acid', 'amine', 'benzene', 'ring', 'isomer', 'isomers', 'functional', 'group', 'bond', 'bonds', 'double', 'triple', 'chain', 'numbering'],
  },
  {
    // Also on Math and Physics Figures, as their own copies: see docs/adr/0001-a-generator-on-two-sites.md.
    id: 'length-reading',
    site: 'chemistry',
    name: 'Length Reading',
    path: '/length-reading',
    blurb: 'A ruler, caliper or micrometer with an object to measure.',
    description:
      'Make printable length measurement figures for chemistry tests. Pick a centimeter or inch ruler, a caliper or a micrometer, set the length or reading, and students measure it, with magnified views of the scales.',
    keywords: [
      'ruler', 'length', 'measure', 'measuring', 'metric', 'imperial', 'meter', 'stick', 'meterstick', 'centimeters', 'cm', 'millimeters',
      'mm', 'inches', 'fraction', 'marble', 'rock', 'cube', 'metal', 'cylinder', 'object', 'estimated', 'digit', 'significant', 'figures',
      'measurement', 'lab', 'caliper', 'calliper', 'calipers', 'vernier', 'vernier caliper', 'vernier scale', 'micrometer',
      'micrometer screw gauge', 'screw gauge', 'least count', 'precision', 'zero error', 'diameter', 'thickness', 'wire',
    ],
  },
  {
    id: 'mass-reading',
    site: 'chemistry',
    name: 'Mass Reading',
    path: '/mass-reading',
    blurb: 'A triple beam or digital balance showing the mass you type.',
    description:
      'Make printable balance figures for chemistry tests. Type a mass and get a digital, analytical or triple beam balance showing it, for students to read.',
    keywords: ['balance', 'scale', 'digital', 'analytical', 'electronic', 'triple', 'beam', 'mass', 'grams', 'weigh', 'weight', 'marble', 'rock', 'cube', 'metal', 'object', 'density', 'measurement', 'lab'],
  },
  {
    id: 'temperature-reading',
    site: 'chemistry',
    alsoOn: ['physics'],
    name: 'Temperature Reading',
    path: '/temperature-reading',
    blurb: 'A liquid-in-glass or digital thermometer showing the temperature you type.',
    description:
      'Make printable thermometer figures for chemistry tests. Type a temperature in Celsius, Kelvin or Fahrenheit and students read it from a liquid-in-glass thermometer, with a magnified view for the estimated digit, or from a digital probe thermometer.',
    keywords: ['thermometer', 'temperature', 'celsius', 'kelvin', 'fahrenheit', 'degrees', 'digital', 'probe', 'alcohol', 'mercury', 'measurement', 'lab'],
  },
  {
    id: 'ph-reading',
    site: 'chemistry',
    alsoOn: ['biology'],
    name: 'pH Reading',
    path: '/ph-reading',
    blurb: 'A digital or analog pH meter, or pH paper, showing the pH you type.',
    description:
      'Make printable pH meter figures for chemistry tests. Type a pH and students read it from a digital pH meter, from an analog meter with a magnified view for the estimated digit, or by matching a strip of pH paper to its color chart.',
    keywords: ['pH', 'meter', 'electrode', 'probe', 'digital', 'analog', 'needle', 'dial', 'paper', 'litmus', 'universal', 'indicator', 'color', 'chart', 'acid', 'base', 'acidic', 'basic', 'neutral', 'measurement', 'lab'],
  },
  {
    id: 'titration-curve',
    site: 'chemistry',
    name: 'Titration Curve',
    path: '/titration-curve',
    blurb: 'An acid–base titration curve from molarities and pKa, or from the pH values you type.',
    description:
      'Make printable titration curves for chemistry tests. Pick a strong or weak acid or base, type the molarities, volume and pKa, or just the starting, equivalence and ending pH, and get the curve with its equivalence and half-equivalence points marked.',
    keywords: ['titration', 'titrate', 'curve', 'graph', 'pH', 'equivalence', 'half-equivalence', 'endpoint', 'end', 'point', 'pKa', 'pKb', 'Ka', 'buffer', 'acid', 'base', 'strong', 'weak', 'neutralization', 'NaOH', 'HCl', 'acetic', 'ammonia', 'molarity', 'buret', 'AP'],
  },
  {
    id: 'heating-cooling-curve',
    site: 'chemistry',
    name: 'Heating and Cooling Curve',
    path: '/heating-cooling-curve',
    blurb: 'A heating or cooling curve for water, ethanol and other substances, or your own melting and boiling points, schematic or to scale.',
    description:
      'Make printable heating and cooling curves for chemistry tests. Pick water, ethanol, acetone, mercury, sodium chloride or your own melting and boiling points, draw it schematic or to scale for a mass and heating rate, and get the curve with lettered corners, labeled states and phase changes, and the melting and boiling points marked.',
    keywords: ['heating', 'cooling', 'curve', 'graph', 'phase', 'change', 'changes', 'state', 'states', 'matter', 'melting', 'freezing', 'boiling', 'condensation', 'condensing', 'vaporization', 'fusion', 'plateau', 'point', 'temperature', 'time', 'heat', 'energy', 'specific', 'enthalpy', 'supercooling', 'solid', 'liquid', 'gas', 'ice', 'water', 'steam', 'ethanol', 'acetone', 'mercury', 'salt', 'kinetic', 'potential', 'thermochemistry', 'AP'],
  },
  {
    id: 'potential-energy-diagram',
    site: 'chemistry',
    alsoOn: ['biology'],
    name: 'Potential Energy Diagram',
    path: '/potential-energy-diagram',
    blurb: 'A reaction energy profile from the energies you type, with Ea and ΔH, a catalyst or several steps.',
    description:
      'Make printable potential energy diagrams for chemistry tests. Type the energies of the reactants, transition states, intermediates and products, or Ea and ΔH, and get the reaction energy profile for an exothermic or endothermic reaction, with or without a catalyst or an enzyme, in up to three steps, its Ea and ΔH arrows labeled, lettered or left blank for students.',
    keywords: ['potential', 'energy', 'diagram', 'reaction', 'profile', 'enthalpy', 'coordinate', 'progress', 'activation', 'Ea', 'ΔH', 'delta', 'transition', 'state', 'activated', 'complex', 'intermediate', 'catalyst', 'catalysed', 'catalyzed', 'enzyme', 'exothermic', 'endothermic', 'mechanism', 'multistep', 'step', 'rate', 'determining', 'level', 'kinetics', 'thermochemistry', 'AP', 'IB'],
  },
  {
    id: 'particle-diagram',
    site: 'chemistry',
    name: 'Particle Diagram',
    path: '/particle-diagram',
    blurb: 'Atoms, ions and molecules scattered in a box or packed in a lattice.',
    description:
      'Make printable particle diagrams for AP Chemistry tests. Pick the atoms, ions and molecules, their sizes, shades and charges, and how many of each, and get them scattered in a box or packed in an ionic or alloy lattice, with a key.',
    keywords: ['particulate', 'particles', 'atom', 'atoms', 'ion', 'ions', 'molecule', 'molecules', 'lattice', 'alloy', 'solid', 'liquid', 'gas', 'solution', 'ionic', 'AP', 'diagram', 'model', 'representation'],
  },
  {
    id: 'bohr-model',
    site: 'chemistry',
    name: 'Bohr Model',
    path: '/bohr-model',
    blurb: 'An atom or ion’s protons, neutrons and electrons on their shells.',
    description:
      'Make printable Bohr model diagrams for chemistry tests. Pick any element and charge, or set the protons, neutrons and electrons on each shell, and get the nucleus and rings in your colors, with an ion’s gained and lost electrons marked, empty rings or a blank nucleus for students to complete.',
    keywords: ['bohr', 'atom', 'atomic', 'model', 'structure', 'proton', 'protons', 'neutron', 'neutrons', 'electron', 'electrons', 'nucleus', 'shell', 'shells', 'energy', 'level', 'orbit', 'isotope', 'ion', 'ions', 'cation', 'anion', 'charge', 'element', 'periodic', 'gained', 'lost', 'valence', 'diagram'],
  },
  {
    id: 'nuclide-notation',
    site: 'chemistry',
    alsoOn: ['physics'],
    name: 'Nuclide Notation',
    path: '/nuclide-notation',
    blurb: 'An isotope, ion or nuclear particle’s symbol with its mass number, atomic number and charge.',
    description:
      'Make printable nuclide symbols for chemistry tests. Pick any element, type your own symbol or pick an alpha, beta or other nuclear particle, and get its mass number, atomic number and charge placed around it, any of them left blank for students, or written in hyphen notation like carbon-14.',
    keywords: ['nuclide', 'isotope', 'isotopes', 'notation', 'nuclear', 'atomic', 'symbol', 'AZX', 'mass', 'number', 'protons', 'neutrons', 'electrons', 'ion', 'cation', 'anion', 'charge', 'superscript', 'subscript', 'alpha', 'beta', 'positron', 'gamma', 'decay', 'hyphen', 'element', 'complete'],
  },
  {
    id: 'lewis-structures',
    site: 'chemistry',
    name: 'Lewis Structures',
    path: '/lewis-structures',
    blurb: 'The Lewis structure of a molecule or ion, correct or with mistakes to find.',
    description:
      'Make printable Lewis structures for chemistry tests. Type a formula like H2O or SO4 2- and get its Lewis dot structure, with formal charges and resonance structures, a structure for students to complete, or a wrong one for students to find the mistakes in.',
    keywords: ['lewis', 'dot', 'electron', 'structure', 'structures', 'diagram', 'lone', 'pair', 'pairs', 'bond', 'bonds', 'bonding', 'covalent', 'molecule', 'polyatomic', 'ion', 'octet', 'formal', 'charge', 'resonance', 'valence', 'VSEPR'],
  },
  {
    id: 'dot-and-cross',
    site: 'chemistry',
    name: 'Dot-and-Cross Diagram',
    path: '/dot-and-cross',
    blurb: 'A molecule, ionic compound or atom with its shells as circles and its electrons as dots and crosses.',
    description:
      'Make printable dot-and-cross diagrams for GCSE and IGCSE chemistry tests. Type a molecule like H2O or C2H4, an ionic compound like MgCl2 or one atom or ion, and get each shell as a circle around its symbol with every electron a dot or a cross, outer shells or all, with ions in brackets and the electrons left blank for students.',
    keywords: ['dot', 'cross', 'dot-and-cross', 'bonding', 'ionic', 'covalent', 'shells', 'shell', 'electron', 'electrons', 'shared', 'sharing', 'transfer', 'outer', 'brackets', 'ion', 'molecule', 'configuration', 'arrangement', 'IGCSE', 'GCSE', 'Cambridge'],
  },
  {
    id: 'orbital-diagram',
    site: 'chemistry',
    name: 'Orbital Diagram',
    path: '/orbital-diagram',
    blurb: 'Any atom or ion’s electron configuration as arrows in orbital boxes.',
    description:
      'Make printable orbital diagrams for chemistry tests. Pick an element and charge and get its electron configuration drawn as arrows in boxes, following the aufbau principle, Pauli exclusion and Hund’s rule, with exceptions, noble gas cores, blanks for students and deliberate mistakes.',
    keywords: ['electron', 'configuration', 'orbital', 'orbitals', 'notation', 'box', 'boxes', 'arrows', 'spin', 'aufbau', 'hund', 'hunds', 'pauli', 'exclusion', 'sublevel', 'subshell', 'noble', 'gas', 'core', 'shorthand', 'excited', 'ground', 'state', 'ion', 'AP'],
  },
  {
    id: 'line-spectrum',
    site: 'chemistry',
    name: 'Line Spectrum',
    path: '/line-spectrum',
    blurb: 'Bright-line or absorption spectra of elements, your own lines, or an unknown mixture.',
    description:
      'Make printable line spectra for chemistry tests. Stack hydrogen, helium, sodium and other elements’ strongest visible lines, or lines you type, on one wavelength scale, and add an unknown mixture of them for students to identify, as emission, absorption or print-friendly black-and-white spectra.',
    keywords: ['line', 'spectrum', 'spectra', 'bright-line', 'bright', 'emission', 'absorption', 'atomic', 'AAS', 'spectroscope', 'spectroscopy', 'flame', 'test', 'Bohr', 'hydrogen', 'Balmer', 'element', 'elements', 'mystery', 'unknown', 'mixture', 'wavelength', 'nm', 'nanometers', 'light', 'color', 'visible', 'star', 'fingerprint', 'electron', 'energy', 'level'],
  },
  {
    id: 'photoelectron-spectrum',
    site: 'chemistry',
    name: 'Photoelectron Spectrum',
    path: '/photoelectron-spectrum',
    blurb: 'Any element’s photoelectron spectrum, H to Xe, one peak per sublevel.',
    description:
      'Make printable photoelectron spectra (PES) for AP Chemistry tests. Pick an element from H to Xe and get a peak for each sublevel, as tall as its electrons, at its binding energy in MJ/mol or eV, on a logarithmic or broken axis, with a second element to compare and labels left blank or the element hidden for students.',
    keywords: ['PES', 'photoelectron', 'spectrum', 'spectra', 'spectroscopy', 'binding', 'energy', 'ionization', 'MJ/mol', 'eV', 'subshell', 'sublevel', 'electron', 'configuration', 'peak', 'peaks', 'core', 'valence', 'shielding', 'Coulomb', 'nuclear', 'charge', 'AP'],
  },
  {
    id: 'mass-spectrum',
    site: 'chemistry',
    name: 'Mass Spectrum',
    path: '/mass-spectrum',
    blurb: 'An element’s mass spectrum: a peak for each isotope, as tall as its abundance.',
    description:
      'Make printable mass spectra of elements for chemistry tests. Pick an element, or type your own isotopes, and get a peak at each mass number as tall as its percent or relative abundance, with the element hidden or a peak left out for students and the relative atomic mass in the answer key.',
    keywords: ['mass', 'spectrum', 'spectra', 'spectrometry', 'spectrometer', 'spec', 'isotope', 'isotopes', 'abundance', 'relative', 'percent', 'average', 'atomic', 'weighted', 'm/z', 'peak', 'peaks', 'amu', 'element', 'AP'],
  },
  {
    id: 'half-life-graph',
    site: 'chemistry',
    alsoOn: ['physics'],
    name: 'Half-Life Graph',
    path: '/half-life-graph',
    blurb: 'Radioactive decay curves for carbon-14, iodine-131 and other isotopes, up to three on one graph.',
    description:
      'Make printable half-life graphs for chemistry and physics tests. Pick carbon-14, iodine-131, uranium-238 or another isotope, or type your own half-life, and get its decay curve as percent, mass, nuclei or activity remaining, with guide lines at each half-life, a stable daughter, or up to three isotopes with their names hidden for students.',
    keywords: ['half-life', 'half', 'life', 'decay', 'radioactive', 'radioactivity', 'exponential', 'nuclear', 'isotope', 'parent', 'daughter', 'carbon', 'dating', 'radiometric', 'activity', 'becquerel', 'Bq', 'count', 'rate', 'remaining', 'iodine', 'uranium', 'curve', 'graph'],
  },
]
