<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createSession, fetchAllPresenters, setSessionPresenters } from '$lib/stores/session';
	import { addToast } from '$lib/stores/ui';
	import type { ParsedLab, Presenter } from '$lib/types';
	import { decks } from 'virtual:slides';

	let { lab, onBack }: { lab: ParsedLab; onBack: () => void } = $props();

	let alias = $state('');
	let passphrase = $state('');
	let joinPassword = $state('');
	let creating = $state(false);
	let createdUrl = $state<string | null>(null);
	let showPresentation = $state(false);

	// Presentation fields
	let slideDeck = $state('');
	let selectedPresenterIds = $state<string[]>([]);
	let allPresenters = $state<Presenter[]>([]);
	let eventName = $state('');
	let companyName = $state('');
	let wifiSsid = $state('');
	let wifiPassword = $state('');
	let apiCreditUrl = $state('');

	$effect(() => {
		if (showPresentation && allPresenters.length === 0) {
			fetchAllPresenters().then((p) => { allPresenters = p; });
		}
	});

	function togglePresenter(id: string) {
		if (selectedPresenterIds.includes(id)) {
			selectedPresenterIds = selectedPresenterIds.filter((x) => x !== id);
		} else {
			// Insert and sort by display order so slides match the list
			const order = new Map(allPresenters.map((p, i) => [p.id, i]));
			selectedPresenterIds = [...selectedPresenterIds, id].sort(
				(a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)
			);
		}
	}

	async function handleCreate() {
		creating = true;
		const sessionId = await createSession(lab.slug, lab.title, {
			alias: alias || undefined,
			passphrase: passphrase || undefined,
			joinPassword: joinPassword || undefined,
			slideDeck: slideDeck || undefined,
			eventName: eventName || undefined,
			companyName: companyName || undefined,
			wifiSsid: wifiSsid || undefined,
			wifiPassword: wifiPassword || undefined,
			apiCreditUrl: apiCreditUrl || undefined
		});

		if (sessionId && selectedPresenterIds.length > 0) {
			const ok = await setSessionPresenters(sessionId, selectedPresenterIds);
			if (!ok) addToast('Session created but presenter linking failed.', 'error');
		}

		if (sessionId) {
			createdUrl = `${window.location.origin}${base}/session/${sessionId}`;
			if (selectedPresenterIds.length === 0) addToast('Session created!', 'success');
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

				<!-- Presentation Settings (collapsible) -->
				<div class="section-toggle">
					<button
						type="button"
						class="toggle-btn"
						onclick={() => { showPresentation = !showPresentation; }}
					>
						<span class="toggle-icon">{showPresentation ? '▾' : '▸'}</span>
						Presentation Settings
						{#if decks.length === 0}
							<span class="no-decks">(no decks available)</span>
						{/if}
					</button>
				</div>

				{#if showPresentation}
					<div class="presentation-fields">
						<div class="field">
							<label for="slide-deck">Slide Deck</label>
							<select id="slide-deck" bind:value={slideDeck} class="select-input">
								<option value="">— none —</option>
								{#each decks as deck}
									<option value={deck.slug}>{deck.title}</option>
								{/each}
							</select>
						</div>

						<div class="field">
							<label>Presenters</label>
							{#if allPresenters.length === 0}
								<p class="no-presenters">
									No presenters yet. <a href="/admin/presenters" target="_blank">Add some →</a>
								</p>
							{:else}
								<div class="presenter-checkboxes">
									{#each allPresenters as p (p.id)}
										<label class="presenter-check" class:selected={selectedPresenterIds.includes(p.id)}>
											<input
												type="checkbox"
												checked={selectedPresenterIds.includes(p.id)}
												onchange={() => togglePresenter(p.id)}
											/>
											<span class="check-avatar">
												{#if p.photo_url}
													<img src={p.photo_url} alt={p.full_name} />
												{:else}
													<img src="/logos/claude-robot.png" alt={p.full_name} />
												{/if}
											</span>
											<span class="check-info">
												<span class="check-name">{p.full_name}</span>
												{#if p.title}<span class="check-title">{p.title}</span>{/if}
												<span class="check-org">{p.organization}</span>
											</span>
										</label>
									{/each}
								</div>
							{/if}
						</div>

						<div class="field-row">
							<div class="field">
								<label for="event-name">Event Name</label>
								<input
									id="event-name"
									type="text"
									bind:value={eventName}
									placeholder="e.g. AWS Summit 2026"
								/>
							</div>
							<div class="field">
								<label for="company-name">Company</label>
								<input
									id="company-name"
									type="text"
									bind:value={companyName}
									placeholder="e.g. Acme Corp"
								/>
							</div>
						</div>

						<div class="field-row">
							<div class="field">
								<label for="wifi-ssid">WiFi SSID</label>
								<input
									id="wifi-ssid"
									type="text"
									bind:value={wifiSsid}
									placeholder="Network name"
								/>
							</div>
							<div class="field">
								<label for="wifi-password">WiFi Password</label>
								<input
									id="wifi-password"
									type="text"
									bind:value={wifiPassword}
									placeholder="Password"
								/>
							</div>
						</div>

						<div class="field">
							<label for="api-credit-url">API Credit URL</label>
							<input
								id="api-credit-url"
								type="text"
								bind:value={apiCreditUrl}
								placeholder="e.g. https://tinyurl.com/..."
							/>
						</div>
					</div>
				{/if}

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

	/* Presentation Settings */
	.section-toggle {
		margin-bottom: 1rem;
	}

	.toggle-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.4rem 0;
		font-family: inherit;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		text-align: left;
	}

	.toggle-btn:hover {
		color: var(--orange);
	}

	.toggle-icon {
		font-size: 0.7rem;
	}

	.no-decks {
		color: var(--text-muted);
		font-size: 0.8rem;
		opacity: 0.6;
	}

	.presentation-fields {
		background: var(--dark);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		padding: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.presentation-fields .field {
		margin-bottom: 1rem;
	}

	.presentation-fields .field:last-child {
		margin-bottom: 0;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.field-row .field {
		margin-bottom: 0;
	}

	.select-input {
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		background: var(--dark-surface);
		color: var(--light);
		width: 100%;
		transition: border-color 0.15s ease;
		cursor: pointer;
	}

	.select-input:focus {
		outline: none;
		border-color: var(--orange);
		box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.15);
	}

	/* Presenter checkboxes */
	.no-presenters {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin: 0.25rem 0 0;
	}

	.no-presenters a {
		color: var(--orange);
		text-decoration: none;
	}

	.presenter-checkboxes {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.25rem;
	}

	.presenter-check {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.45rem 0.65rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}

	.presenter-check:hover {
		border-color: var(--orange);
	}

	.presenter-check.selected {
		border-color: var(--orange);
		background: rgba(217, 119, 87, 0.08);
	}

	.presenter-check input[type="checkbox"] {
		width: auto;
		margin: 0;
		accent-color: var(--orange);
	}

	.check-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}

	.check-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}


	.check-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.check-name {
		font-size: 0.85rem;
		color: var(--light);
	}

	.check-title {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.check-org {
		font-size: 0.7rem;
		color: var(--orange);
		font-family: var(--font-mono);
	}
</style>
