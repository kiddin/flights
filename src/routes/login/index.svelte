<script>
	import { goto } from '$app/navigation';
	import { user } from '../../hooks/auth';
	import Login from './Login.svelte';

	$: if ($user == "admin") goto('/admin');
	$: if ($user == "user") goto('/');
</script>

{#if $user != null}
	logging you in...
{:else}
	<Login />
{/if}
