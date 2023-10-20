<script lang="ts">
	import type { PageData } from './$types';
	import RelatedContext from './RelatedContext.svelte';
	import Word from './Word.svelte';

	export let data: PageData;

	let similarityTypes = [
		{ id: 'same', name: 'Same Word', heading: 'In other contexts...' },
		{ id: 'spelling', name: 'Similar Spellings', heading: 'Similar Spellings...' },
		{ id: 'meaning', name: 'Similar Meanings', heading: 'Similar Meanings...' }
	];

	let text = [
		{ id: 'A', rawForm: 'This', normalForm: 'this' },
		{ id: 'B', rawForm: 'is', normalForm: 'is' },
		{ id: 'C', rawForm: 'a', normalForm: 'a' },
		{ id: 'D', rawForm: 'text.', normalForm: 'text' }
	];
</script>

<svelte:head>
	<title>Der Sandmann | WordTrail</title>
</svelte:head>
<div class="grid grid-cols-2 gap-x-10 grid-rows-[10vh,80vh,6vh] grid-flow-col mx-16">
	<div class="" />
	<div class="rounded bg-neutral p-3 text-xs text-primary overflow-y-auto">
		<form aria-label="Text Pane">
			{#each text as word}
				<Word id={word.id} rawForm={word.rawForm} />
			{/each}
		</form>
	</div>
	<div>
		<cite aria-label="Text Title" class="text-sm text-accent font-light">Der Sandmann</cite>
	</div>

	<div class="relative">
		<button
			class="btn btn-base-200 btn-xs border-primary rounded-sm no-animation text-primary my-2 absolute bottom-0"
		>
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
						{#each data.contexts[similarityType.id] as context}
							<tr class="hover"
								><td class="p-2">
									<RelatedContext {...context} />
								</td></tr
							>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
</div>
