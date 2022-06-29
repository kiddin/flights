<script>
	import PouchDB from 'pouchdb';
	import { user, logout } from '../../hooks/auth';

	import { onMount } from 'svelte';
	import Colors from './Colors.svelte';
	import Datepicker from './Datepicker.svelte';
	import Flight from './Flight.svelte';

	import logo from '/static/logo.png';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	$: if ($user == null && browser) goto('/executive/login');

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

	let total_rows;
	let page = 1;
	let per_page = 20;

	let isLoading = true;
	// All the flights directly from the PouchDB. Sorting and filtering comes later
	let flights = [];


	function emit(val) {}

	function emap(doc) {
		// sort by last name, first name, and age
		emit([doc.createdAt]);
	}
	// Helper for reloading all flights from the local PouchDB. It’s on-device and haso basically zero latency,
	// so we can use it quite liberally instead of keeping our local state up to date like you’d do
	// in a Redux reducer. It also saves us from having to rebuild the local state flights from the data we sent
	// to the database and the `_id` and `_rev` values that were sent back.
	async function updateFlights() {
		const allDocs = await db
			.query(emap, {
				include_docs: true,
				descending: true,
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
	<button class="logout" on:click={logout}><img src="/static/icon-logout.svg" width="15" alt="logout"></button>
</nav>

<svelte:window bind:scrollY={y} bind:innerHeight={h} />

<div class="table" bind:this={table}>
	<div class="tr thead" class:shadow={y > 1} style="top: {navHeight - 1}px">
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
	</div>
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
	}
	.thead {
		position: sticky;
		z-index: 199998;
		background-color: #fff;
	}
	.thead .th {
		padding-bottom: 4px;
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
	.th {
		font-size: 12px;
		text-transform: uppercase;
		display: table-cell;
		padding: 0 4px;
		vertical-align: middle;
		position: relative;
	}
	.tr {
		display: table-row;
	}
	:global(.form-control) {
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
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
