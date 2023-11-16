<script lang="ts">
	export let results:
		| {
				context: string;
				matchStart: number;
				matchEnd: number;
		  }[]
		| undefined;
	export let attrs: object;
	export let resultAttrs: object;
	export let matchAttrs: object;

	resultAttrs.class =
		(resultAttrs.class ?? '') + ' whitespace-nowrap overflow-hidden text-ellipsis max-w-0';
</script>

<table class="table table-pin-rows w-full">
	<tbody {...attrs}>
		{#if results === undefined}
			<slot name="before-search" />
		{:else if results.length === 0}
			<td
				><div class="cell">
					<slot name="no-results" />
				</div></td
			>
		{:else}
			{#each results as result}
				<tr class="hover"
					><td {...resultAttrs}>
						...{result.context.slice(0, result.matchStart)}
						<b {...matchAttrs}>{result.context.slice(result.matchStart, result.matchEnd)}</b>
						{result.context.slice(result.matchEnd)}
					</td></tr
				>
			{/each}
		{/if}
	</tbody>
</table>
