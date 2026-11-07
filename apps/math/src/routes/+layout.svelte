<script lang="ts">
  // Every page: the top bar (editors go without, having their own way home), the page, then the footer (generators go without,
  // so the figure gets the whole window), plus the Help and request dialogs and any news.
  import type { Snippet } from 'svelte'
  import '../app.css'
  import { page } from '$app/state'
  import { findGenerator } from '$lib/generators/index'
  import Footer from '$lib/site/Footer.svelte'
  import GeneratorLead from '$lib/site/GeneratorLead.svelte'
  import Help from '$lib/site/Help.svelte'
  import News from '$lib/site/News.svelte'
  import RequestDialog from '$shared/RequestDialog.svelte'
  import { setGeneratorLead } from '$shared/generatorLead'
  import TopBar from '$lib/site/TopBar.svelte'

  let { children }: { children: Snippet } = $props()
  // Each generator's settings open with what it makes and its examples.
  setGeneratorLead(GeneratorLead)

  // Cloudflare Web Analytics beacon; the token is set in Vercel's production env only.
  const beacon = import.meta.env.CF_BEACON_TOKEN
  const onGenerator = $derived(!!findGenerator(page.url.pathname))
  // An editor fills the whole window, with its own way home, except the
  // Transformations Editor, which is laid out like a generator.
  const onEditor = $derived.by(() => {
    const entry = findGenerator(page.url.pathname)
    return entry?.kind === 'editor' && entry.id !== 'transformations'
  })
</script>

<svelte:head>
  {#if beacon}
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: beacon, spa: false })}></script>
  {/if}
</svelte:head>

{#if !onEditor}<TopBar />{/if}
<main>{@render children()}</main>
{#if !onGenerator}<Footer />{/if}
<Help />
<News />
<RequestDialog />
