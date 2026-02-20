<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { addToast } from '$lib/stores/ui';
	import type { Presenter } from '$lib/types';

	let { data } = $props();
	let presenters = $state<Presenter[]>(data.presenters);

	// Form state
	let editing = $state<Presenter | null>(null);
	let showForm = $state(false);
	let saving = $state(false);
	let deleting = $state<string | null>(null);
	let confirmingDelete = $state<string | null>(null);

	let fullName = $state('');
	let title = $state('');
	let organization = $state('forgd');
	let photoFile = $state<File | null>(null);
	let photoPreview = $state<string | null>(null);
	let existingPhotoUrl = $state<string | null>(null);

	function openAdd() {
		editing = null;
		fullName = '';
		title = '';
		organization = 'forgd';
		photoFile = null;
		photoPreview = null;
		existingPhotoUrl = null;
		showForm = true;
	}

	function openEdit(p: Presenter) {
		editing = p;
		fullName = p.full_name;
		title = p.title ?? '';
		organization = p.organization;
		photoFile = null;
		photoPreview = null;
		existingPhotoUrl = p.photo_url;
		showForm = true;
	}

	function cancelForm() {
		showForm = false;
		editing = null;
		photoPreview = null;
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		photoFile = file;
		const reader = new FileReader();
		reader.onload = (ev) => { photoPreview = ev.target?.result as string; };
		reader.readAsDataURL(file);
	}

	function resizeToDataUrl(file: File, size = 300): Promise<string> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const url = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(url);
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext('2d')!;
				// Cover crop: centre the image
				const scale = Math.max(size / img.width, size / img.height);
				const w = img.width * scale;
				const h = img.height * scale;
				ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
				resolve(canvas.toDataURL('image/jpeg', 0.85));
			};
			img.onerror = reject;
			img.src = url;
		});
	}

	async function handleSave() {
		if (!supabase || !fullName.trim()) return;
		saving = true;

		let finalPhotoUrl = existingPhotoUrl;
		if (photoFile) {
			try {
				finalPhotoUrl = await resizeToDataUrl(photoFile);
				// 300×300 JPEG at 0.85 is typically ~30–60KB; warn if somehow larger
				const base64 = finalPhotoUrl.split(',')[1] ?? '';
				const sizeKb = Math.ceil((base64.length * 3) / 4 / 1024);
				if (sizeKb > 150) {
					addToast('Photo is too large after resize. Try a different image.', 'error');
					saving = false;
					return;
				}
			} catch {
				addToast('Failed to process photo. Please try a different image.', 'error');
				saving = false;
				return;
			}
		}

		const { error: rpcErr } = await supabase.rpc('upsert_presenter', {
			p_full_name: fullName.trim(),
			p_title: title.trim() || null,
			p_organization: organization.trim() || 'forgd',
			p_photo_url: finalPhotoUrl ?? null,
			p_id: editing?.id ?? null
		});

		if (rpcErr) {
			addToast('Failed to save presenter', 'error');
			saving = false;
			return;
		}

		// Refresh list
		const { data: refreshed } = await supabase
			.from('presenters')
			.select('*')
			.order('created_at', { ascending: true });
		presenters = (refreshed ?? []) as Presenter[];

		addToast(editing ? 'Presenter updated' : 'Presenter added', 'success');
		saving = false;
		cancelForm();
	}

	async function handleDelete(p: Presenter) {
		if (!supabase) return;
		deleting = p.id;
		const { error } = await supabase.rpc('delete_presenter', { p_id: p.id });
		if (error) {
			addToast('Failed to delete presenter', 'error');
		} else {
			presenters = presenters.filter((x) => x.id !== p.id);
			addToast('Presenter deleted', 'success');
		}
		deleting = null;
		confirmingDelete = null;
	}
</script>

<svelte:head>
	<title>Presenters — Admin</title>
</svelte:head>

<div class="admin-page">
	<header class="page-header">
		<div class="header-inner">
			<a href="/" class="back-link">← Home</a>
			<h1>Presenters</h1>
			<button class="btn btn-primary btn-sm" onclick={openAdd}>+ Add Presenter</button>
		</div>
	</header>

	<main class="page-body">
		{#if showForm}
			<div class="form-card">
				<h2>{editing ? 'Edit Presenter' : 'New Presenter'}</h2>
				<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
					<div class="photo-section">
						<div class="avatar-wrap">
							{#if photoPreview}
								<img src={photoPreview} alt="Preview" class="avatar-preview" />
							{:else if existingPhotoUrl}
								<img src={existingPhotoUrl} alt={fullName} class="avatar-preview" />
							{:else}
								<img src="/logos/claude-robot.png" alt="placeholder" class="avatar-preview" />
							{/if}
						</div>
						<div class="photo-upload">
							<label class="upload-label" for="photo-input">
								{existingPhotoUrl || photoPreview ? 'Change photo' : 'Upload photo'}
							</label>
							<input
								id="photo-input"
								type="file"
								accept="image/*"
								onchange={handleFileChange}
								class="file-input"
							/>
							<span class="upload-hint">JPG or PNG, will be cropped to circle</span>
						</div>
					</div>

					<div class="field">
						<label for="full-name">Full Name *</label>
						<input id="full-name" type="text" bind:value={fullName} placeholder="Jane Smith" required />
					</div>

					<div class="field">
						<label for="title">Title / Role</label>
						<input id="title" type="text" bind:value={title} placeholder="e.g. Co-founder, forgd" />
					</div>

					<div class="field">
						<label for="org">Organization</label>
						<select id="org" bind:value={organization} class="select-input">
							<option value="forgd">forgd</option>
							<option value="anthropic">Anthropic</option>
							<option value="guest">Guest</option>
						</select>
					</div>

					<div class="form-actions">
						<button class="btn btn-primary" type="submit" disabled={saving || !fullName.trim()}>
							{saving ? 'Saving…' : 'Save'}
						</button>
						<button class="btn btn-ghost" type="button" onclick={cancelForm}>Cancel</button>
					</div>
				</form>
			</div>
		{/if}

		{#if presenters.length === 0 && !showForm}
			<div class="empty">No presenters yet. Add one above.</div>
		{:else}
			<div class="presenters-grid">
				{#each presenters as p (p.id)}
					<div class="presenter-card">
						<div class="card-avatar">
							<img
								src={p.photo_url ?? '/logos/claude-robot.png'}
								alt={p.full_name}
							/>
						</div>
						<div class="card-info">
							<span class="card-name">{p.full_name}</span>
							{#if p.title}
								<span class="card-title">{p.title}</span>
							{/if}
							<span class="card-org">{p.organization}</span>
						</div>
						<div class="card-actions">
							{#if confirmingDelete === p.id}
								<button
									class="action-btn danger"
									onclick={() => handleDelete(p)}
									disabled={deleting === p.id}
								>
									{deleting === p.id ? '…' : 'Confirm'}
								</button>
								<button class="action-btn" onclick={() => { confirmingDelete = null; }}>
									Cancel
								</button>
							{:else}
								<button class="action-btn" onclick={() => openEdit(p)}>Edit</button>
								<button class="action-btn danger" onclick={() => { confirmingDelete = p.id; }}>
									Delete
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

	</main>
</div>

<style>
	.admin-page {
		min-height: 100vh;
		background: var(--dark);
		color: var(--light);
	}

	.page-header {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--dark-border);
	}

	.header-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.header-inner h1 {
		flex: 1;
		font-size: 1.2rem;
		margin: 0;
	}

	.back-link {
		color: var(--text-muted);
		font-size: 0.85rem;
		text-decoration: none;
	}

	.back-link:hover { color: var(--orange); }

	.page-body {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Form */
	.form-card {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 1.75rem;
	}

	.form-card h2 {
		margin: 0 0 1.5rem;
		font-size: 1rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.8rem;
	}

	.photo-section {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.avatar-wrap {
		flex-shrink: 0;
	}

	.avatar-preview, .avatar-placeholder {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		object-fit: cover;
	}


	.photo-upload {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.upload-label {
		color: var(--orange);
		font-size: 0.85rem;
		cursor: pointer;
		text-decoration: underline;
	}

	.file-input {
		display: none;
	}

	.upload-hint {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.field {
		margin-bottom: 1.25rem;
	}

	.field label {
		display: block;
		color: var(--text-muted);
		font-size: 0.8rem;
		margin-bottom: 0.4rem;
	}

	.field input {
		background: var(--dark);
		border-color: var(--dark-border);
		color: var(--light);
		width: 100%;
	}

	.field input:focus {
		border-color: var(--orange);
	}

	.select-input {
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		background: var(--dark);
		color: var(--light);
		width: 100%;
		cursor: pointer;
	}

	.select-input:focus {
		outline: none;
		border-color: var(--orange);
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	/* Grid */
	.presenters-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}

	.presenter-card {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.card-avatar {
		flex-shrink: 0;
	}

	.card-avatar img, .avatar-initials {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		object-fit: cover;
	}


	.card-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.card-name {
		font-weight: 600;
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-title {
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	.card-org {
		color: var(--orange);
		font-size: 0.75rem;
		font-family: var(--font-mono);
	}

	.card-actions {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.action-btn {
		background: none;
		border: 1px solid var(--dark-border);
		color: var(--text-muted);
		border-radius: var(--radius);
		padding: 0.25rem 0.6rem;
		font-size: 0.75rem;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s;
	}

	.action-btn:hover {
		border-color: var(--orange);
		color: var(--orange);
	}

	.action-btn.danger:hover {
		border-color: #e05252;
		color: #e05252;
	}

	.empty {
		color: var(--text-muted);
		text-align: center;
		padding: 3rem 0;
	}

</style>
