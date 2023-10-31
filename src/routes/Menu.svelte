<script lang="ts">
	import { version } from '$app/environment';
	import type { TextInfo } from '$lib/types';
	export let textInfos: TextInfo[];

	const languages = ['English', 'Deutsch'];
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
		<div class="menu p-4 w-80 min-h-full bg-accent text-base-100">
			<header aria-label="app name" class="text-xl py-3">
				WordTrail <span class="text-xs">v{version}</span>
			</header>
			<li class="pl-2">
				{#each languages as language}
					<details open class="text-base">
						<summary class="underline">{language}</summary>
						<ul>
							{#each textInfos.filter((ti) => ti.language == language) as textInfo}
								<li>
									<a
										on:click={() => document.getElementById('close-menu').click()}
										href={'/texts/' + textInfo.slug}>{textInfo.title}</a
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
