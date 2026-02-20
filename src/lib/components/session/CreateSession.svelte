<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createSession } from '$lib/stores/session';
	import { addToast } from '$lib/stores/ui';
	import type { ParsedLab } from '$lib/types';

	let { lab, onBack }: { lab: ParsedLab; onBack: () => void } = $props();

	let alias = $state('');
	let passphrase = $state('');
	let joinPassword = $state('');
	let creating = $state(false);
	let createdUrl = $state<string | null>(null);

	async function handleCreate() {
		creating = true;
		const sessionId = await createSession(
			lab.slug,
			lab.title,
			alias || undefined,
			passphrase || undefined,
			joinPassword || undefined
		);

		if (sessionId) {
			createdUrl = `${window.location.origin}${base}/session/${sessionId}`;
			addToast('Session created!', 'success');
		} else {
			addToast('Failed to create session. Check Supabase configuration.', 'error');
		}
		creating = false;
	}

	async function copyUrl() {
		if (!createdUrl) return;
		await navigator.clipboard.writeText(createdUrl);
		addToast('URL copied to clipboard!', 'success');
	}

	function goToSession() {
		if (!createdUrl) return;
		const id = createdUrl.split('/session/')[1];
		goto(`${base}/session/${id}`);
	}
</script>

<div class="create-session">
	{#if createdUrl}
		<div class="created">
			<h2>Session Ready!</h2>
			<p class="created-lab">{lab.title}</p>
			<div class="url-box">
				<input type="text" readonly value={createdUrl} />
				<button class="btn btn-primary btn-sm" onclick={copyUrl}>Copy</button>
			</div>
			<p class="share-hint">Share this URL with your workshop participants</p>
			<div class="actions">
				<button class="btn btn-primary" onclick={goToSession}>Open Workshop</button>
				<button class="btn btn-ghost" onclick={onBack} style="color: var(--text-muted);">Create Another</button>
			</div>
		</div>
	{:else}
		<div class="form-wrapper">
			<button class="back-btn" onclick={onBack}>← Back to labs</button>
			<h2>Create Session</h2>
			<p class="lab-name">{lab.title}</p>

			<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
				<div class="field">
					<label for="alias">Session Alias (optional)</label>
					<input
						id="alias"
						type="text"
						bind:value={alias}
						placeholder="e.g. spring-workshop-jan-2026"
					/>
				</div>

				<div class="field">
					<label for="join-password">Participant Password (optional)</label>
					<span class="field-hint">If set, participants will need this to join</span>
					<input
						id="join-password"
						type="text"
						bind:value={joinPassword}
						placeholder="Leave blank for open access"
					/>
				</div>

				<div class="field">
					<label for="passphrase">Trainer Passphrase (optional)</label>
					<input
						id="passphrase"
						type="password"
						bind:value={passphrase}
						placeholder="Protects the admin panel"
					/>
				</div>

				<button class="btn btn-primary full-width" type="submit" disabled={creating}>
					{creating ? 'Creating...' : 'Create Session'}
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.create-session {
		width: 100%;
		max-width: 480px;
	}

	.form-wrapper, .created {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
	}

	.back-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0;
		margin-bottom: 1.25rem;
		font-family: inherit;
	}

	.back-btn:hover {
		color: var(--orange);
	}

	h2 {
		color: var(--light);
		margin-bottom: 0.25rem;
	}

	.lab-name, .created-lab {
		color: var(--orange);
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.field {
		margin-bottom: 1.25rem;
	}

	.field label {
		color: var(--text-muted);
	}

	.field-hint {
		display: block;
		color: var(--text-muted);
		font-size: 0.8rem;
		margin-bottom: 0.25rem;
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

	.created {
		text-align: center;
	}

	.url-box {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.url-box input {
		background: var(--dark);
		border-color: var(--dark-border);
		color: var(--orange-light);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.share-hint {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
