<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import debounce  from 'lodash';
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';
	import { clickOutside } from '../../../../hooks/clickOutside';

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
	let intentDelete = false;
	let deleteButton;

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			intentDelete = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<form on:submit|preventDefault={updateFields} transition:fade>
	<div class="td">
		<input
			placeholder="OPERATOR"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldOperator}
		/>
	</div>
	<div class="td">
		<input
			placeholder="A/C"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldACType}
		/>
	</div>
	<div class="td">
		<input
			placeholder="FROM"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldFrom}
		/>
	</div>
	<div class="td">
		<input
			placeholder="TO"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldTo}
		/>
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
		<input
			placeholder="PAX"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldPAX}
		/>
	</div>
	<div class="td">
		<input
			placeholder="STATUS"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldStatus}
		/>
	</div>
	<div class="td">
		<Colors color={flight.fieldColor} on:update={updateFieldColor} />
	</div>
	<div class="td">
		<input
			placeholder="PAYMENT"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldPaymentType}
		/>
	</div>
	<div class="td">
		<textarea
			placeholder="Enter notes"
			type="text"
			on:keyup={debouncedUpdateFlight}
			bind:value={flight.fieldNotes}
		/>
	</div>
	<div class="td">
		<button type="submit"><img src="/static/icon-check.svg" alt="update" /></button>
		{#if !intentDelete}
			<button
				on:click={() => {
					intentDelete = true;
				}}><img src="/static/icon-times.svg" alt="remove" /></button
			>
		{:else}
			<button
				class="delete"
				on:click={remove}
				use:clickOutside
				on:click_outside={() => {
					intentDelete = false;
				}}><img src="/static/icon-times.svg" alt="remove" /></button
			>
		{/if}
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
	form:nth-child(even) {
		background-color: #f6f6f6;
	}
	button {
		display: block;
		margin: 2px 0;
		border: none;
		width: 1.5vw;
		height: 1.5vw;
		border-radius: 2vw;
		cursor: pointer;
		background-color: #000;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	button.delete {
		background-color: red;
	}
	button img {
		display: block;
		width: 0.75vw;
		height: 0.75vw;
	}
	input[type='text'] {
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
	}
	input[type='text']::placeholder,
	textarea::placeholder,
	:global(.form-control::placeholder) {
		opacity: 0.1;
	}
	textarea {
		resize: none;
		border: none;
		height: 3.25vw;
		background-color: transparent;
	}
</style>
