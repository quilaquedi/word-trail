<script lang="ts">
	import type { PageData } from './$types';
	import RelatedContext from './RelatedContext.svelte';

	export let data: PageData;

	let similarityTypes = [
		{ id: 'A', name: 'Same Word' },
		{ id: 'B', name: 'Similar Spellings' },
		{ id: 'C', name: 'Similar Meanings' }
	];
</script>

<svelte:head>
	<title>Der Sandmann | WordTrail</title>
</svelte:head>

<button class="btn no-animation">Lookup</button>

<div class="grid grid-cols-2 grid-rows-3 grid-flow-col">
	<div class="row-span-3">
		<figure>
			<form aria-label="Text Pane">These are some words.</form>

			<figcaption><cite aria-label="Text Title">Der Sandmann</cite></figcaption>
		</figure>
		<button class="btn no-animation">Bookmark</button>
	</div>
	{#each similarityTypes as similarityType}
		<div class="...">
			<div class="overflow-x-auto overflow-y-auto">
				<div aria-label={similarityType.name + ' Pane'} class="overflow-x-auto overflow-y-auto">
					<table class="table table-pin-rows">
						<!-- head -->
						<thead>
							<tr><th>{similarityType.name} Contexts</th></tr>
						</thead>
						<tbody>
							<!-- row 1 -->
							<tr class="hover"
								><td>
									<RelatedContext
										similarityType={similarityType.id}
										widerContext={data.widerContext}
									/>
								</td></tr
							>
							<!-- row 2 -->
							<tr class="hover"><td>/param.2</td></tr>
							<!-- row 3 -->
							<tr class="hover"><td>/param.3</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/each}
</div>
