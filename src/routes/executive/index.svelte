<script>
	import PouchDB from 'pouchdb';
	import { user, logout } from '../../hooks/auth';

	import { onMount } from 'svelte';
	import Flight from './Flight.svelte';

	import logo from '/static/logo.png';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	import icon_logout from '../../../static/icon-logout.svg';

	$: if ($user == null && browser) goto('/executive/login');

	let db = new PouchDB('db');
	const replication = PouchDB.sync(
		'db',
		'http://admin:Xdream12345@78.83.69.35:5984/svelte-flight-db',
		{
			live: true,
			retry: true
		}
	)
		.on('change', async function (info) {
			await updateFlights();
		})
		.on('error', function (err) {
			console.log('Replication error:', err);
		});

	let total_rows;

	let isLoading = true;
	// All the flights directly from the PouchDB. Sorting and filtering comes later
	let flights = [];

	async function updateFlights() {
		const allDocs = await db
			.query('docs', {
				include_docs: true
			})
			.then(function (result) {
				console.log(result);
				return result;
			})
			.catch(function (err) {
				console.log(err);
			});

		total_rows = allDocs.total_rows;
		flights = allDocs.rows.map((row) => row.doc);
		isLoading = false;
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

	function timedRefresh(timeoutPeriod) {
		setInterval(() => {
			updateFlights();
		}, timeoutPeriod);
	}


	onMount(async () => {
		await updateFlights();

		timedRefresh(30000);
		window.onerror = () => {
			location.reload();
		};
	});

	let y, h;

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
	<button class="logout" on:click={logout}><img src={icon_logout} width="15" alt="logout" /></button
	>
</nav>

<svelte:window bind:scrollY={y} bind:innerHeight={h} />

<div class="table">
	<div class="tr thead" class:shadow={y > 1} style="top: {navHeight - 1}px">
		<div class="th">Operator</div>
		<div class="th">A/C type</div>
		<div class="th">From</div>
		<div class="th">To</div>
		<div class="th">ETA</div>
		<div class="th">ETD</div>
		<div class="th">PAX</div>
		<div class="th">Status</div>
		<div class="th" />
		<div class="th">Payment Type</div>
		<div class="th">Notes</div>
	</div>
	{#if flights.length}
		{#each flights as flight}
			{#if !flight.fieldComplete}
				<Flight {flight} on:remove={removeItem} />
			{/if}
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
