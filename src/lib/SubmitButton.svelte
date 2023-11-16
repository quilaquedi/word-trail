<script lang="ts">
	export let label: string;
	export let name: string;
	export let value: string;
	export let attrs: object;
</script>

<button on:click type="submit" {name} {value} {...attrs}>{label}</button>
