<script lang="ts">
	import type { PageData } from './$types';
	import type { Contexts } from '$lib/types';
	import RelatedContext from './RelatedContext.svelte';
	import Word from './Word.svelte';

	export let data: PageData;

	type SimilarityType = {
		id: keyof Contexts;
		name: string;
		heading: string;
	};
	let similarityTypes: SimilarityType[] = [
		{ id: 'same', name: 'Same Word', heading: 'In other contexts...' }
	];
	let isOpen = { same: false };

	function openOnContextLoad() {
		data.contexts = undefined;
		setTimeout(() => {
			isOpen.same = true;
		}, 150);
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
				<Word id={word.id} rawForm={word.rawForm} on:click={openOnContextLoad} />
			{/each}
		</form>
	</div>
	<div>
		<cite aria-label="Text Title" class="text-sm text-accent font-light">{data.textTitle}</cite>
	</div>

	<div class="relative" />

	<div class="grid gap-8">
		{#each similarityTypes as similarityType}
			<details
				aria-label={similarityType.name + ' Pane'}
				class="text-xs rounded"
				bind:open={isOpen[similarityType.id]}
			>
				<summary class="min-h-0 p-2 font-semibold uppercase text-accent list-none">
					<div class="flex justify-between">
						<div class="">{similarityType.heading}</div>
						{#if isOpen[similarityType.id]}
							<div class="text-right">-</div>
						{:else}
							<div class="text-right">+</div>
						{/if}
					</div>
				</summary>
				<div class="bg-neutral px-0 h-24 overflow-y-auto">
					<table class="table table-pin-rows w-full">
						<tbody class="text-primary text-xs">
							{#if data.contexts === undefined}
								<p />
							{:else if data.contexts[similarityType.id].length === 0}
								<td
									><div class="cell">
										<p class="text-primary text-center italic align-middle">No results found.</p>
									</div></td
								>
							{:else}
								{#each data.contexts[similarityType.id] as context}
									<tr class="hover"
										><td class="p-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-0">
											<RelatedContext {...context} />
										</td></tr
									>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</details>
		{/each}
	</div>
</div>
