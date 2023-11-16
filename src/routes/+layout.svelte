<script lang="ts">
	import '../app.postcss';
	import Menu from './MenuDrawer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="app">
	<main>
		<Menu textInfos={data.textInfos}>
			<slot />
		</Menu>
	</main>
</div>
