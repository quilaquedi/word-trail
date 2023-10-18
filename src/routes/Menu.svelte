<script>
	import { tutorial_route } from './titles';
</script>

<div class="drawer">
	<input id="menu-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<label for="menu-drawer" class="btn btn-primary drawer-button">Menu</label>
		<slot />
	</div> 
	<div class="drawer-side">
	  <label for="menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
	  <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
		
		<li><a href="{tutorial_route}">Tutorial</a></li>
		<li><a href="/texts/der-sandmann">Der Sandmann</a></li>
		
	  </ul>
	</div>
</div>
