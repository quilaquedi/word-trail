<script lang="ts">
	import type { PageData } from './$types';
	import RelatedContext from './RelatedContext.svelte';

	export let data: PageData;

	let similarityTypes = [
		{ id: 'A', name: 'Same Word', heading: 'In other contexts...' },
		{ id: 'B', name: 'Similar Spellings', heading: 'Similar Spellings...' },
		{ id: 'C', name: 'Similar Meanings', heading: 'Similar Meanings...' }
	];
	
	
	
	
</script>

<svelte:head>
	<title>Der Sandmann | WordTrail</title>
</svelte:head>
<div class="grid grid-cols-2 gap-x-10 grid-rows-[10vh,80vh,6vh] grid-flow-col mx-16">
	
	<div class=""></div>
	<div class="rounded bg-neutral p-3 text-xs text-primary overflow-y-auto">
			<form aria-label="Text Pane">These are some words.</form>
	</div>		
	<div>
		<cite aria-label="Text Title" class="text-sm text-accent font-light">Der Sandmann</cite>
	</div>

	
	<div class="relative">
		<button class="btn btn-base-200 btn-xs border-primary rounded-sm no-animation text-primary my-2 absolute bottom-0">
			Lookup
		</button>
	</div>
	
	<div class="grid gap-8">
		{#each similarityTypes as similarityType}
		<div aria-label={similarityType.name + ' Pane'} class="rounded bg-neutral overflow-y-auto">
			<table class="table table-pin-rows">
				<thead class="text-accent uppercase">
					<tr><th class="px-2 py-1 font-semibold">{similarityType.heading}</th></tr>
				</thead>
				<tbody class="text-primary text-xs">
					<tr class="hover"
						><td class="p-2">
							<RelatedContext
								similarityType={similarityType.id}
								widerContext={data.widerContext}
							/>
						</td></tr
					>
				</tbody>
			</table>
				</div>
		{/each}
	</div>
	<div class="h-60vh"></div>
</div>
