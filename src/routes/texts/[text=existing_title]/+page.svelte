<script lang="ts">
	import type { PageData } from './$types';
	import type { Contexts } from '$lib/types';
	import SubmitButton from '$lib/SubmitButton.svelte';
	import SearchResults from '$lib/SearchResults.svelte';
	import CollapsiblePane from '$lib/CollapsiblePane.svelte';

	export let data: PageData;

	type SimilarityType = {
		id: keyof Contexts;
		name: string;
		heading: string;
	};
	let similarityTypes: SimilarityType[] = [
		{ id: 'same', name: 'Same Word', heading: 'In other contexts...' }
	];
	let isOpen = { same: true, spelling: false, meaning: false };

	function openOnContextLoad() {
		if (!isOpen.same) {
			// hide previous contexts before opening
			data.contexts = undefined;

			isOpen.same = true;
		}
	}
</script>

<svelte:head>
	<title>{data.textTitle} | WordTrail</title>
</svelte:head>
<div class="grid grid-cols-2 gap-x-10 grid-rows-[10vh,25vh,25vh,25vh,6vh] grid-flow-col mx-16">
	<div class="" />
	<div class="row-span-3 rounded bg-neutral p-3 text-xs text-primary overflow-y-auto">
		<form aria-label="Text Pane">
			{#each data.text as word, i}
				<!-- Insert a newline if there's a missing textPos between two
				adjacent words -->
				{#if i > 1 && word.textPos > data.text[i - 1].textPos + 1}
					<br />
					<br />
				{/if}
				<SubmitButton
					label={word.rawForm}
					name="word"
					value={String(word.id)}
					attrs={{ class: 'mx-0.5' }}
					on:click={openOnContextLoad}
				/>
			{/each}
		</form>
	</div>
	<div>
		<cite aria-label="Text Title" class="text-sm text-accent font-light">{data.textTitle}</cite>
	</div>

	<div class="relative" />

	<div class="grid gap-8">
		{#each similarityTypes as similarityType}
			<CollapsiblePane
				attrs={{ 'aria-label': similarityType.name + ' Pane', class: 'text-xs rounded' }}
				openCondition={isOpen[similarityType.id]}
				heading={similarityType.heading}
				headingAttrs={{ class: 'min-h-0 p-2 font-semibold uppercase text-accent list-none' }}
				bodyAttrs={{ class: 'bg-neutral px-0 h-24' }}
			>
				<SearchResults
					results={data.contexts == undefined ? undefined : data.contexts[similarityType.id]}
					attrs={{ class: 'text-primary text-xs' }}
					resultAttrs={{ class: 'p-2' }}
					matchAttrs={{ class: 'italic' }}
				>
					<p slot="before-search" />
					<p slot="no-results" class="text-primary text-center italic align-middle">
						No results found.
					</p>
				</SearchResults>
			</CollapsiblePane>
		{/each}
	</div>
</div>
