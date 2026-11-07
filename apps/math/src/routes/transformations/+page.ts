// A 404 while this editor is turned off (`off` in its catalog entry).
import { error } from '@sveltejs/kit'
import { findGenerator } from '$lib/generators/index'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => {
  if (!findGenerator(url.pathname)) error(404, 'Not found')
}
