<script lang="ts">
	export let id: string;
	export let rawForm: string;
</script>

<button on:click name="word" class="mx-0.5" type="submit" value={id}>{rawForm}</button>
