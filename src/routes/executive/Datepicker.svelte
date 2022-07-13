<script>
	import 'flatpickr/dist/flatpickr.css';

	export let value = '';

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
</script>

<div class="input-button" class:empty={!value} data-toggle>
	<big>{hour || ''}</big><br /><small>{date || ''}</small>
</div>

<style>
	.input-button {
		letter-spacing: -.1vw;
		text-align: left;
		font-family: inherit;
		border: none;
		padding: 0;
		background-color: transparent;
	}
	.input-button.empty {
		opacity: 0.1;
	}
	.input-button big {
		font-size: 2vw;
	}
	.input-button small {
		font-size: .85vw;
		letter-spacing: 0;
		position: absolute;
		white-space: nowrap;
		top: calc(100% - 1vw - 7px);
	}
</style>
