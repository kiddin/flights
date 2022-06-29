<script>
	import 'flatpickr/dist/flatpickr.css';

	export let value = '';

	let hour = '',
		date = '';

	$: {
		let now = new Date(Date.parse(value));
		hour = value
			? String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
			: undefined;
		date = value
			? now.getFullYear() +
			  '-' +
			  String(now.getMonth() + 1).padStart(2, '0') +
			  '-' +
			  String(now.getDate()).padStart(2, '0')
			: undefined;
	}
	// const dispatch = createEventDispatcher();

	// $: dispatch('update', {
	// 	value: value
	// });
</script>

<div class="input-button" class:empty={!value} data-toggle>
	<big>{hour || '??:??'}</big><br /><small>{date || '????-??-??'}</small>
</div>


<style>
	.input-button {
		text-align: left;
		font-family: inherit;
		border: none;
		padding: 0;
		background-color: transparent;
	}
	.input-button.empty {
		opacity: .1;
	}
	.input-button big {
		font-size: 2vw;
	}
	.input-button small {
		font-size: min(13px, 1.5vw);
		position: absolute;
		white-space: nowrap;
		opacity: .5;
	}
</style>
