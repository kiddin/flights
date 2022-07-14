<script>
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import { createEventDispatcher, onMount } from 'svelte';

	export let value = '';
	export let id = (Math.random() + 1).toString(36).substring(7);

	let hour = '',
		date = '';

	const MONTHS = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC'
	];

	$: {
		let now = new Date(Date.parse(value));
		hour = value
			? String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
			: undefined;
		date = value
			? String(now.getDate()).padStart(2, '0') +
			  '' +
			  MONTHS[now.getMonth()] +
			  '' +
			  now.getFullYear()
			: undefined;
	}
	// const dispatch = createEventDispatcher();

	// $: dispatch('update', {
	// 	value: value
	// });
	let isLoaded = false;
	onMount(() => {
		isLoaded = true;
	});
</script>

<Flatpickr options={{ enableTime: true, time_24hr: true }} bind:value name="date" element="#{id}">
	<div class="flatpickr" class:empty={!value} {id}>
		<input type="text" placeholder="Select Date.." data-input />
		<div class="input-button" data-toggle>
			<big>{hour || 'HH:MM'}</big><br /><small>{date || 'YYYY-MM-DD'}</small>
		</div>
	</div>
</Flatpickr>

<style>
	.flatpickr {
		display: flex;
		text-align: left;
	}
	.flatpickr.empty .input-button {
		color: #00000010;
	}
	.flatpickr input {
		width: 1px;
		visibility: hidden;
		padding: 0;
		margin: 0;
	}
	.flatpickr .input-button {
		text-align: left;
		font-family: inherit;
		border: none;
		padding: 0;
		background-color: transparent;
	}
	.flatpickr .input-button big {
		font-size: 2vw;
	}
	.flatpickr .input-button small {
		font-size: 0.85vw;
		letter-spacing: 0;
		position: absolute;
		white-space: nowrap;
		top: calc(100% - 1vw - 7px);
	}
</style>
