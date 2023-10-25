<script type="ts">
	import { page } from '$app/stores';
</script>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<p class="text-accent text-7xl">{$page.error.message}</p>
			<a class="my-5 btn btn-accent" href="/">Go home</a>
		</div>
	</div>
</div>
