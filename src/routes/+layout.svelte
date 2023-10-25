<script lang="ts">
	import '../app.postcss';
	import Menu from './Menu.svelte';
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
