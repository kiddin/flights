<script>
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';

	// We don’t want to clobber the local DB, so we debounce saving on every keystroke

	export let flight;
</script>

<div class="tr" >
	<div class="td">
		<div class="input-preview">{flight.fieldOperator}</div>
	</div>
	<div class="td">
		<div class="input-preview">{flight.fieldACType}</div>
	</div>
	<div class="td">
		<div class="input-preview">{flight.fieldFrom}</div>
	</div>
	<div class="td">
		<div class="input-preview">{flight.fieldTo}</div>
	</div>
	<div class="td">
		<Datepicker bind:value={flight.fieldETA} />
	</div>
	<div class="td">
		<Datepicker bind:value={flight.fieldETD} />
	</div>
	<div class="td">
		<div class="input-preview">{flight.fieldPAX}</div>
	</div>
	<div class="td">
		<div class="input-preview">{flight.fieldStatus}</div>
	</div>
	<div class="td">
		<Colors color={flight.fieldColor} />
	</div>
	<div class="td"><div class="input-preview">{flight.fieldPaymentType}</div></div>
	<div class="td">
		<div class="textarea-preview">{flight.fieldNotes}</div>
	</div>
</div>

<style>
	.td {
		display: table-cell;
		padding: 4px;
		vertical-align: middle;
		position: relative;
	}
	.tr {
		display: table-row;
	}
	.tr:nth-child(odd) {
		background-color: #f6f6f6;
	}
	.input-preview {
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
		display: flex;
		align-items: center;
		white-space: nowrap;
	}

	.textarea-preview {
		resize: none;
		border: none;
		height: 3.25vw;
		background-color: transparent;
		font-size: 16px;
		max-width: 10vw;
	}
</style>
