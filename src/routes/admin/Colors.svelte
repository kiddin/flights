<script>
	import { createEventDispatcher } from 'svelte';

	export let color = 'grey';
	let colors = ['red', 'green', 'orange', 'yellow'];

	let isOpen = false;

	const dispatch = createEventDispatcher();

	$: dispatch('update', {
		color: color
	});
</script>

<div
	class="dropdown {color}"
	on:click={() => {
		isOpen = !isOpen;
	}}
>
	{#if isOpen}
		<div class="options">
			{#each colors as c}
				<div
					class="option {c}"
					on:click={() => {
						color = c;
					}}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		cursor: pointer;
		position: relative;
		width: 3.25vw;
		height: 3.25vw;
		border-radius: 50%;
		margin: 0 auto;
	}
	.options {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 60%;
		z-index: 2;
		background-color: #fff;
		box-shadow: 0 0 10px #00000030;
		border-radius: 100px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: .5vw;
		gap: .5vw;
	}
	.option {
		width: 2vw;
		height: 2vw;
		border-radius: 50%;
	}
	.grey {
		background-color: #f0f0f0;
	}
	.red {
		background-color: red;
	}
	.green {
		background-color: green;
	}
	.orange {
		background-color: orange;
	}
	.yellow {
		background-color: yellow;
	}
</style>
