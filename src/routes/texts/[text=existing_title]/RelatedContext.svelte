<script lang="ts">
	export let similarityType: string;
	export let widerContext: string;

	let selectedSimilarityType: string;

	function setSelectedCategory() {
		selectedSimilarityType = similarityType;
	}
</script>

<form>
	<button
		class="w-full h-full"
		name="context"
		type="submit"
		on:click={setSelectedCategory}
		value="is">This is a clickable context</button
	>
</form>
{#if widerContext && selectedSimilarityType === similarityType}
	<dialog id="my_modal_3" class="modal modal-open">
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<figure>
				<p class="py-4">This gives some wider context for the word "context".</p>
				<figcaption><cite aria-label="Wider Context Title">Some other text</cite></figcaption>
			</figure>
		</div>
	</dialog>
{/if}
