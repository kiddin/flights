<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import debounce from 'lodash';
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';
	import { clickOutside } from '../../../hooks/clickOutside';

	import icon_times from '/static/icon-times.svg'
	import icon_check from '/static/icon-check.svg'

	const dispatch = createEventDispatcher();

	function remove() {
		dispatch('remove', { flight });
	}

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

	function toggleStatus() {
		dispatch('update', {
			flight: {
				...flight,
				fieldComplete: !flight.fieldComplete
			}
		});
	}

	export let flight;
	let intentDelete = false;

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			intentDelete = false;
		}
	}
	let isLoaded = false;

	onMount(() => {
		isLoaded = true;
	})
</script>

<svelte:window on:keydown={handleKeydown} />

<form on:submit|preventDefault={updateFields} >
	<div class="td">
		<div class="toggle-status" on:click={toggleStatus}>
			{#if flight.fieldComplete}Y{:else}N{/if}
		</div>
	</div>

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
		<Datepicker bind:value={flight.fieldETA} id={'flightETA-' + flight._id + Math.round(Math.random()*100)} />
	</div>
	<div class="td">
		<Datepicker bind:value={flight.fieldETD} id={'flightETD-' + flight._id + Math.round(Math.random()*100)} />
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
		<button type="submit"><img src="{icon_check}" alt="update" /></button>
		{#if !intentDelete}
			<button
				on:click={() => {
					intentDelete = true;
				}}><img src="{icon_times}" alt="remove" /></button
			>
		{:else}
			<button
				class="delete"
				on:click={remove}
				use:clickOutside
				on:click_outside={() => {
					intentDelete = false;
				}}><img src="{icon_times}" alt="remove" /></button
			>
		{/if}
	</div>
</form>

<style>
	.toggle-status {
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
		cursor: pointer;
	}

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
