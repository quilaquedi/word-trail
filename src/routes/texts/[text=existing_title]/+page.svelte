<svelte:head>
	<title>Der Sandmann | WordTrail</title>
</svelte:head>

<button class="btn no-animation">Lookup</button>

<div class="grid grid-cols-2 grid-rows-3 grid-flow-col">
	<div class="row-span-3">
		<h1>Der Sandmann</h1>
		<form aria-label="Text Pane">These are some words.</form>
		<button class="btn no-animation">Bookmark</button>
	</div>
	{#each ['Same Word', 'Similar Spellings', 'Similar Meanings'] as category}
		<div class="...">
			<div class="overflow-x-auto overflow-y-auto">
				<div aria-label={category + ' Pane'} class="overflow-x-auto overflow-y-auto">
					<table class="table table-pin-rows">
						<!-- head -->
						<thead>
							<tr><th>{category} Contexts</th></tr>
						</thead>
						<tbody>
							<!-- row 1 -->
							<tr class="hover"><td>/param.1</td></tr>
							<!-- row 2 -->
							<tr class="hover"><td>/param.2</td></tr>
							<!-- row 3 -->
							<tr class="hover"><td>/param.3</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/each}
</div>
