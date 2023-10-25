<script lang="ts">
	import { tutorial_route } from './titles';
	import type { TextInfo } from '$lib/types';
	export let textInfos: TextInfo[];

	const languages = ["English", "Deutsch"];
</script>

<div class="drawer">
	<input id="menu-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<label
			for="menu-drawer"
			aria-label="open menu"
			class="btn btn-accent drawer-button absolute top-12 left-0 rounded-none"
		/>
		<slot />
	</div>
	<div class="drawer-side">
		<label id="close-menu" for="menu-drawer" aria-label="close menu" class="drawer-overlay" />
		<div class="menu p-4 w-80 min-h-full bg-accent">
			<header aria-label="app name">WordTrail</header>
			<li>
				{#each languages as language}
				<details open>
					<summary>{language}</summary>
					<ul>
						{#each textInfos.filter((ti) => ti.language == language) as textInfo}
							<li>
								<a
									on:click={() => document.getElementById('close-menu').click()}
									href={"/texts/"+textInfo.slug}>{textInfo.title}</a
								>
							</li>
						{/each}
					</ul>
				</details>					
				{/each}
			</li>
		</div>
	</div>
</div>
