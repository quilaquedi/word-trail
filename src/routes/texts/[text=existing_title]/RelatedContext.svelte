<script lang="ts">
	export let wordId: string;
	export let text: string;
	export let wordPosition;
</script>

...{text.slice(0, wordPosition[0])}
<b class="italic">{text.slice(...wordPosition)}</b>
{text.slice(wordPosition[1])}