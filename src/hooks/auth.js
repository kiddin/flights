import { browser } from '$app/env';
import { writable } from 'svelte/store';

const admin_username = 'admin';
const admin_password = 'adminpass';
const user_username = 'user';
const user_password = 'userpass';

let lsUser;
if (browser) {
	lsUser = localStorage.getItem('user');
}
export const user = writable(lsUser);

let sessions = [];

export function logout() {
	user.set(undefined);
	localStorage.removeItem('user');
}
export const getUserDetails = async (username, password) => {
	if (username === admin_username && password === admin_password) return 'admin';
	if (username === user_username && password === user_password) return 'user';
};
