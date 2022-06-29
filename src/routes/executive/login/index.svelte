<script>
	import { goto } from '$app/navigation';
	import { user } from '../../../hooks/auth';
	import Login from './Login.svelte';

	$: if ($user == "admin") goto('/executive/admin');
	$: if ($user == "user") goto('/executive');
</script>

{#if $user != null}
	logging you in...
{:else}
	<Login />
{/if}
