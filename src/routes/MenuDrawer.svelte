<script lang="ts">
	import { version } from '$app/environment';
	import Menu from '$lib/Menu.svelte';
	import type { TextInfo } from '$lib/types';
	export let textInfos: TextInfo[];

	const entries = textInfos.map((textInfo) => {
		return { label: textInfo.title, target: '/texts/' + textInfo.slug, section: textInfo.language };
	});
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
		<Menu
			{entries}
			attrs={{ class: 'menu p-4 w-80 min-h-full bg-accent text-base-100' }}
			sectionAttrs={{ class: 'underline pl-2' }}
			itemAttrs={{ class: 'pl-2' }}
		>
			<header aria-label="app name" class="text-xl py-3">
				WordTrail <span class="text-xs">v{version}</span>
			</header>
		</Menu>
	</div>
</div>
