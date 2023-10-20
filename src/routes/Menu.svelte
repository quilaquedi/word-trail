<script>
	import { tutorial_route } from './titles';
</script>

<div class="drawer">
	<input id="menu-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<label for="menu-drawer" aria-label="open menu" class="btn btn-accent drawer-button absolute top-12 left-0 rounded-none"
			/>
		<slot />
	</div>
	<div class="drawer-side">
		<label for="menu-drawer" aria-label="close menu" class="drawer-overlay" />
		<div class="menu p-4 w-80 min-h-full bg-accent">
			<header aria-label="app name">WordTrail</header>
			<li>
				<details open>
					<summary>Deutsch</summary>
					<ul>
						<li><a href="/texts/der-sandmann">Der Sandmann</a></li>
					</ul>
				</details>
				<details open>
					<summary>English</summary>
					<ul>
						<li><a href={tutorial_route}>Tutorial</a></li>
					</ul>
				</details>
			</li>
		</div>
	</div>
</div>
