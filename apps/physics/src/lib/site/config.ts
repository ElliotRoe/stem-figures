// Facts about the site as a whole.

import type { SiteId } from '$shared/catalog/index'

/** its name in the STEM Figures catalog */
export const SITE_ID: SiteId = 'physics'

export const SITE_NAME = 'Physics Figures'
export const SITE_URL = 'https://physicsfigures.com'

// The STEM Figures family this site belongs to, and its other sites, linked
// from the top bar.
export const FAMILY = { name: 'STEM Figures', url: 'https://stemfigures.com' }
export const SISTER_SITES = [
  { name: 'Math Figures', url: 'https://mathfigures.com' },
  { name: 'Chemistry Figures', url: 'https://chemistryfigures.com' },
  { name: 'Biology Figures', url: 'https://biologyfigures.com' }
]
