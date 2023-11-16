<script lang="ts">
	type Entry = {
		label: string;
		target: string;
		section: string;
	};
	export let entries: Entry[];
	export let attrs: object;
	export let sectionAttrs: object;
	export let itemAttrs: object;

	const sections = Array(...new Set(entries.map((e) => e.section))).sort((a, b) =>
		a < b ? -1 : 1
	);
</script>

<div {...attrs}>
	<slot />
	<li>
		{#each sections as section}
			<details open>
				<summary {...sectionAttrs}>{section}</summary>
				<ul>
					{#each entries.filter((e) => e.section == section) as entry}
						<li {...itemAttrs}>
							<a href={entry.target}>{entry.label}</a>
						</li>
					{/each}
				</ul>
			</details>
		{/each}
	</li>
</div>
