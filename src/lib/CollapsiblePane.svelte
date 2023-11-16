<script lang="ts">
	export let attrs: object;
	export let openCondition: boolean;
	export let heading: string;
	export let headingAttrs: object;
	export let bodyAttrs: object;

	bodyAttrs.class = (bodyAttrs.class ?? '') + ' overflow-y-auto';
</script>

<details {...attrs} bind:open={openCondition}>
	<summary {...headingAttrs}>
		<div class="flex justify-between">
			<div class="">{heading}</div>
			{#if openCondition}
				<div class="text-right">-</div>
			{:else}
				<div class="text-right">+</div>
			{/if}
		</div>
	</summary>
	<div {...bodyAttrs}>
		<slot />
	</div>
</details>
