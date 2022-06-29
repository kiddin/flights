<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { debounce } from 'lodash';
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';

	const dispatch = createEventDispatcher();

	function remove() {
		dispatch('remove', { flight });
	}

	// We don’t want to clobber the local DB, so we debounce saving on every keystroke
	const debouncedUpdateFlight = debounce(updateFields, 500);

	function updateFieldColor(e) {
		flight.fieldColor = e.detail.color;
		updateFields();
	}
	function updateFields() {
		dispatch('update', {
			flight: flight
		});
	}

	export let flight;
</script>

<form on:submit|preventDefault={updateFields}>
	<div class="td">
		<div class="input-preview">{flight.fieldACType}</div>
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
		<!-- <input
			placeholder="DD/MM/YY HH:MM"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldETA}
		/> -->
		<Datepicker bind:value={flight.fieldETA} id={'flightETA-' + flight._id} />
	</div>
	<div class="td">
		<!-- <input
			placeholder="DD/MM/YY HH:MM"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldETD}
		/> -->
		<Datepicker bind:value={flight.fieldETD} id={'flightETD-' + flight._id} />
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
</form>

<style>
	.td {
		display: table-cell;
		padding: 4px;
		vertical-align: middle;
		position: relative;
	}
	form {
		display: table-row;
	}
	form:nth-child(odd) {
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
        font-size: 12px;
		max-width: 10vw;
	}
</style>
