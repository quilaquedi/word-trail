<script lang="ts">
	export const compId: number | string = 'a';
	export let text: string;
	export let wordLoc: number[];
</script>

...{text.slice(0, wordLoc[0])}
<b class="italic">{text.slice(...wordLoc)}</b>
{text.slice(wordLoc[1])}
