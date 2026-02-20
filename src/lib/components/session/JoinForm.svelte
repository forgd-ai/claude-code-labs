<script lang="ts">
	import { joinSession } from '$lib/stores/session';
	import { addToast } from '$lib/stores/ui';
	import { base } from '$app/paths';
	import type { Session } from '$lib/types';

	let { session, onJoined }: { session: Session; onJoined: () => void } = $props();

	let name = $state('');
	let password = $state('');
	let joining = $state(false);

	async function handleJoin() {
		if (!name.trim()) return;
		joining = true;
		try {
			const participant = await joinSession(
				session.id,
				name.trim(),
				session.has_join_password ? password : undefined
			);
			if (participant) {
				addToast(`Welcome, ${participant.name}!`, 'success');
				onJoined();
			} else {
				addToast('Failed to join session.', 'error');
			}
		} catch (err: unknown) {
			const message = (err as { message?: string })?.message ?? String(err);
			if (message.includes('Incorrect join password')) {
				addToast('Incorrect password. Please try again.', 'error');
			} else {
				addToast('Failed to join session.', 'error');
			}
		}
		joining = false;
	}
</script>

<div class="join-page dark-theme">
	<div class="join-container">
		<div class="join-header">
			<div class="logo-mark">✦</div>
			<h1>Claude Code Workshop</h1>
			<p class="lab-title">{session.lab_title}</p>
		</div>

		<div class="join-form-card">
			<h2>Join the Workshop</h2>
			<form onsubmit={(e) => { e.preventDefault(); handleJoin(); }}>
				<div class="field">
					<label for="name">Your Name</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Enter your name"
						autofocus
					/>
				</div>

				{#if session.has_join_password}
					<div class="field">
						<label for="password">Session Password</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Enter the session password"
						/>
					</div>
				{/if}

				{#if session.alias}
					<div class="field">
						<label>Workshop Code</label>
						<input type="text" readonly value={session.alias} />
					</div>
				{/if}

				<button class="btn btn-primary full-width" type="submit" disabled={joining || !name.trim()}>
					{joining ? 'Joining...' : 'Enter Workshop'}
				</button>
			</form>
		</div>
		<p class="prereqs-link">
			Need help setting up? <a href="{base}/session/{session.id}/prereqs" target="_blank">View prerequisites checklist →</a>
		</p>
	</div>
</div>

<style>
	.join-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.join-container {
		width: 100%;
		max-width: 400px;
	}

	.join-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo-mark {
		font-size: 2.5rem;
		color: var(--orange);
		margin-bottom: 0.5rem;
	}

	h1 {
		color: var(--orange);
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.lab-title {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.join-form-card {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
	}

	h2 {
		color: var(--light);
		font-size: 1.125rem;
		margin-bottom: 1.25rem;
	}

	.field {
		margin-bottom: 1.25rem;
	}

	.field label {
		color: var(--text-muted);
	}

	.field input {
		background: var(--dark);
		border-color: var(--dark-border);
		color: var(--light);
	}

	.field input:focus {
		border-color: var(--orange);
	}

	.full-width {
		width: 100%;
	}

	.prereqs-link {
		text-align: center;
		margin-top: 1.25rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.prereqs-link a {
		color: var(--text-muted);
		text-decoration: underline;
	}

	.prereqs-link a:hover {
		color: var(--orange);
	}
</style>
