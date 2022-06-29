<script>
	import PouchDB from 'pouchdb';
	import { user, logout } from '../../../hooks/auth';

	import { onMount } from 'svelte';
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';
	import Flight from './Flight.svelte';

	import logo from '/static/logo.png';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	$: if ($user != 'admin' && browser) goto('/executive/login');

	let db = new PouchDB('db');
	const replication = PouchDB.sync('db', 'http://46.233.0.11:5984/svelte-flight-db', {
		live: true,
		retry: true,
		withCredentials: false,
		ajax: {
			withCredentials: false
		}
	})
		.on('change', async function (info) {
			await updateFlights();
		})
		.on('error', function (err) {
			console.log('Replication error:', err);
		});

	let fieldOperator = '';
	let fieldACType = '';
	let fieldFrom = '';
	let fieldTo = '';
	let fieldETA = '';
	let fieldETD = '';
	let fieldPAX = '';
	let fieldStatus = '';
	let fieldColor = 'grey';
	let fieldPaymentType = '';
	let fieldNotes = '';
	let fieldComplete = false;

	let total_rows;
	let page = 1;
	let per_page = 20;

	let isLoading = true;
	// All the flights directly from the PouchDB. Sorting and filtering comes later
	let flights = [];

	let myDate = '2021-11-11';

	function emit(val) {}

	function emap(doc) {
		// sort by last name, first name, and age
		emit([doc.fieldETA + doc.fieldETD]);
	}
	// Helper for reloading all flights from the local PouchDB. It’s on-device and haso basically zero latency,
	// so we can use it quite liberally instead of keeping our local state up to date like you’d do
	// in a Redux reducer. It also saves us from having to rebuild the local state flights from the data we sent
	// to the database and the `_id` and `_rev` values that were sent back.
	async function updateFlights() {
		const allDocs = await db
			.query(emap, {
				include_docs: true,
				// descending: true,
				limit: page * per_page
			})
			.then(function (result) {
				return result;
			})
			.catch(function (err) {
				console.log(err);
			});
		total_rows = allDocs.total_rows;
		flights = allDocs.rows.map((row) => row.doc);
		isLoading = false;
	}

	async function loadMoreFlights() {
		isLoading = true;
		if (flights.length >= total_rows || !flights.length) {
			isLoading = false;
			return;
		}
		page++;
		const allDocs = await db
			.query(emap, {
				include_docs: true,
				descending: true,
				limit: per_page,
				skip: per_page * (page - 1)
			})
			.then(function (result) {
				isLoading = false;
				return result;
			})
			.catch(function (err) {
				console.log(err);
			});
		if (allDocs.rows) {
			flights = [...flights, ...allDocs.rows.map((row) => row.doc)];
		}
		isLoading = false;
	}

	// Event handlers for adding, updating and removing flights
	async function add(event) {
		const newFlight = {
			fieldOperator: fieldOperator,
			fieldACType: fieldACType,
			fieldFrom: fieldFrom,
			fieldTo: fieldTo,
			fieldETA: fieldETA,
			fieldETD: fieldETD,
			fieldPAX: fieldPAX,
			fieldStatus: fieldStatus,
			fieldColor: fieldColor,
			fieldPaymentType: fieldPaymentType,
			fieldNotes: fieldNotes,
			createdAt: new Date().toISOString()
		};
		const addition = await db.post(newFlight);
		if (addition.ok) {
			await updateFlights();
		}
		fieldOperator = '';
		fieldACType = '';
		fieldFrom = '';
		fieldTo = '';
		fieldETA = '';
		fieldETD = '';
		fieldPAX = '';
		fieldStatus = '';
		fieldColor = 'grey';
		fieldPaymentType = '';
		fieldNotes = '';
	}

	async function updateFlight(event) {
		const { flight } = event.detail;
		const update = await db.put(flight);
		if (update.ok) {
			await updateFlights();
		}
	}

	async function removeItem(event) {
		const { flight: flightToRemove } = event.detail;
		const removal = await db.remove(flightToRemove);
		if (removal.ok) {
			// For removal, we can just update the local state instead of reloading everything from PouchDB,
			// since we no longer care about the doc’s revision.
			flights = flights.filter((flight) => {
				return flight._id !== flightToRemove._id;
			});
		}
	}

	// Load flights on first run
	onMount(async () => {
		await updateFlights();
	});

	let y, h, table;

	$: if (flights.length && !isLoading) {
		if (table.offsetTop + table.offsetHeight <= y + h + 20) {
			loadMoreFlights();
		}
	}

	let nav, navHeight;
	$: if (nav) navHeight = nav.offsetHeight;
</script>

<nav bind:this={nav}>
	{#if isLoading}
		<h1>Loading flights</h1>
	{:else if flights.length === 0}
		<h1>No flights found</h1>
	{:else}
		<h1>
			Showing {flights.length} of {total_rows} flights
		</h1>
	{/if}
	<div class="logo">
		<img alt="swissport logo" src={logo} />
		EXECUTIVE
	</div>
	<button class="logout" on:click={logout}
		><img src="/static/icon-logout.svg" width="15" alt="logout" /></button
	>
</nav>

<svelte:window bind:scrollY={y} bind:innerHeight={h} />

<div class="table" bind:this={table}>
	<div class="tr thead" class:shadow={y > 1} style="top: {navHeight - 1}px">
		<div class="th" >Comp</div>
		<div class="th">Operator</div>
		<div class="th">A/C type</div>
		<div class="th">From</div>
		<div class="th">To</div>
		<div class="th">ETA</div>
		<div class="th">ETD</div>
		<div class="th">PAX</div>
		<div class="th">Status</div>
		<div class="th" style="text-align: center;">Color</div>
		<div class="th">Payment Type</div>
		<div class="th">Notes</div>
		<div class="th" />
	</div>
	<form on:submit|preventDefault={add}>
		<div class="td" />
		<div class="td">
			<input placeholder="OPERATOR" type="text" bind:value={fieldOperator} />
		</div>
		<div class="td">
			<input placeholder="AC" type="text" bind:value={fieldACType} />
		</div>
		<div class="td">
			<input placeholder="FROM" type="text" bind:value={fieldFrom} />
		</div>
		<div class="td">
			<input placeholder="TO" type="text" bind:value={fieldTo} />
		</div>
		<div class="td">
			<Datepicker bind:value={fieldETA} id={'newETA'} />
		</div>
		<div class="td">
			<Datepicker bind:value={fieldETD} id={'newETD'} />
		</div>
		<div class="td">
			<input placeholder="PAX" type="text" bind:value={fieldPAX} />
		</div>
		<div class="td">
			<input placeholder="STATUS" type="text" bind:value={fieldStatus} />
		</div>
		<div class="td">
			<Colors bind:color={fieldColor} />
		</div>
		<div class="td">
			<input placeholder="PAYMENT" type="text" bind:value={fieldPaymentType} />
		</div>
		<div class="td">
			<textarea placeholder="Enter notes" type="text" bind:value={fieldNotes} />
		</div>
		<div class="td">
			<button type="submit"><img src="/static/icon-plus.svg" alt="add" /></button>
		</div>
	</form>
	{#if flights.length}
		{#each flights as flight (flight._id)}
			<Flight {flight} on:remove={removeItem} on:update={updateFlight} />
		{/each}
	{/if}
</div>

<style>
	nav {
		display: flex;
		position: sticky;
		top: 0;
		background-color: #fff;
		box-sizing: border-box;
		z-index: 199999;
		padding: 1vw 8px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.thead.shadow {
		box-shadow: 0 0 10px #00000030;
	}
	nav .logo {
		font-size: 10px;
		font-weight: 800;
	}
	nav .logo img {
		height: 20px;
		display: block;
	}
	h1 {
		padding: 0;
		margin: 0;
		flex-grow: 1;
	}
	.table {
		width: 100%;
		display: table;
	}
	.thead {
		position: sticky;
		z-index: 199998;
		background-color: #fff;
	}
	.thead .th {
		padding-bottom: 4px;
	}
	.th,
	.td {
		font-size: 12px;
		text-transform: uppercase;
		display: table-cell;
		padding: 0 4px;
		vertical-align: middle;
		position: relative;
	}
	.th {
		padding: 0 8px;
	}
	form,
	.tr {
		display: table-row;
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
	button img {
		display: block;
		width: 0.75vw;
		height: 0.75vw;
	}
	input[type='text'],
	:global(.form-control) {
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
	}
	input[type='text']::placeholder,
	textarea::placeholder {
		opacity: 0.1;
	}
	textarea {
		resize: none;
		border: none;
		height: 3.25vw;
		background-color: transparent;
		font-size: 12px;
	}
	.logout {
		border: none;
		border-radius: 8px;
		padding: 8px;
		margin: 0 10px;
		background-color: transparent;
		cursor: pointer;
	}
</style>
