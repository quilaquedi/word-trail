<script>
	import '../app.postcss';
	import Menu from './Menu.svelte';
</script>

<div class="app">
	<main>
		<Menu>
			<slot />
		</Menu>
	</main>
</div>
