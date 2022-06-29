<script>
	import { getUserDetails } from '../../hooks/auth';
	import { user } from '../../hooks/auth';

	let username = '';
	let password = '';
	let error = '';

	async function login() {
		const role = await getUserDetails(username, password);

		if (role) {
			console.log(role);
			$user = role;
			localStorage.setItem('user', role);
			if (error) error = '';
		} else {
			error = 'Incorrect username and password.';
			console.log('Incorrect username and password.');
		}
	}
</script>

<nav>
	<h1 />
	<div class="logo">
		<img alt="swissport logo" src="/static/logo.png" />
		EXECUTIVE
	</div>
</nav>

<form on:submit|preventDefault={login}>
	<input
		placeholder="username"
		type="text"
		class="login-control"
		id="username"
		bind:value={username}
	/>

	<input
		placeholder="password"
		type="password"
		class="login-control"
		id="password"
		bind:value={password}
	/>

	<button type="submit"><img src="/static/icon-arrow-right.svg" alt="login" /></button>
	<div id="error_message">
		<small>{error}</small>
	</div>
</form>

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
	nav .logo {
		font-size: 10px;
		font-weight: 800;
	}
	nav .logo img {
		height: 20px;
		display: block;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 300px;
		margin: 10vw auto;
	}
	.login-control {
		text-align: center;
		width: 100%;
		border: none;
		font-size: 2vw;
		letter-spacing: -0.15vw;
		background-color: transparent;
		height: 4vw;
	}
	.login-control::placeholder {
		opacity: 0.1;
	}
	button {
		display: block;
		margin: 2px 0;
		border: none;
		width: 3vw;
		height: 3vw;
		border-radius: 2vw;
		cursor: pointer;
		background-color: #000;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 24px auto;
	}
	button img {
		display: block;
		width: 1.5vw;
		height: 1.5vw;
	}
	#error_message {
		color: red;
		text-align: center;
	}
</style>
