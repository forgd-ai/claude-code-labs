<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { base } from '$app/paths';
	import type { Session, ParsedLab, Participant, Progress } from '$lib/types';

	let { session, lab }: { session: Session; lab: ParsedLab } = $props();

	let participants = $state<Participant[]>([]);
	let allProgress = $state<Progress[]>([]);
	let search = $state('');
	let loading = $state(true);

	let filtered = $derived(
		search
			? participants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
			: participants
	);

	let avgCompletion = $derived(() => {
		if (participants.length === 0) return 0;
		const totalSteps = lab.steps.length;
		const totalCompleted = participants.reduce((sum, p) => {
			const pSteps = allProgress.filter((pr) => pr.participant_id === p.id);
			return sum + pSteps.length;
		}, 0);
		return Math.round((totalCompleted / (participants.length * totalSteps)) * 100);
	});

	let stepHistogram = $derived(
		lab.steps.map((step) => {
			const count = allProgress.filter((pr) => pr.step_id === step.id).length;
			return { step, count, pct: participants.length > 0 ? (count / participants.length) * 100 : 0 };
		})
	);

	onMount(async () => {
		if (!supabase) {
			loading = false;
			return;
		}

		const [pRes, prRes] = await Promise.all([
			supabase.from('participants').select('*').eq('session_id', session.id),
			supabase.from('progress').select('*').eq('session_id', session.id)
		]);

		participants = (pRes.data ?? []) as Participant[];
		allProgress = (prRes.data ?? []) as Progress[];
		loading = false;
	});

	function exportCsv() {
		const headers = ['Name', 'Steps Completed', 'Points', 'Joined At'];
		const rows = participants.map((p) => {
			const pProgress = allProgress.filter((pr) => pr.participant_id === p.id);
			const points = pProgress.reduce((s, pr) => s + pr.points, 0);
			return [p.name, pProgress.length, points, p.joined_at];
		});

		const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `workshop-${session.alias ?? session.id.slice(0, 8)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="admin-dashboard">
	<div class="dash-header">
		<h1>Admin Dashboard</h1>
		<div class="dash-actions">
			<a
				href="{base}/session/{session.id}/prereqs"
				target="_blank"
				class="btn btn-secondary btn-sm"
			>Prerequisites ↗</a>
			<button class="btn btn-secondary btn-sm" onclick={exportCsv}>Export CSV</button>
		</div>
	</div>

	{#if loading}
		<p class="loading-text">Loading admin data...</p>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{participants.length}</span>
				<span class="stat-label">Participants</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{avgCompletion()}%</span>
				<span class="stat-label">Avg Completion</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{allProgress.length}</span>
				<span class="stat-label">Total Steps Done</span>
			</div>
		</div>

		<section class="section">
			<h2>Step Completion</h2>
			<div class="histogram">
				{#each stepHistogram as item}
					<div class="histo-row">
						<span class="histo-label" title={item.step.title}>
							{item.step.title.length > 30 ? item.step.title.slice(0, 30) + '...' : item.step.title}
						</span>
						<div class="histo-bar-track">
							<div class="histo-bar-fill" style="width: {item.pct}%"></div>
						</div>
						<span class="histo-count">{item.count}/{participants.length}</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<div class="section-header">
				<h2>Participants</h2>
				<input
					type="text"
					bind:value={search}
					placeholder="Search by name..."
					class="search-input"
				/>
			</div>
			<table class="participants-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Steps</th>
						<th>Points</th>
						<th>Joined</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as p}
						{@const pProgress = allProgress.filter((pr) => pr.participant_id === p.id)}
						{@const points = pProgress.reduce((s, pr) => s + pr.points, 0)}
						<tr>
							<td>{p.name}</td>
							<td>{pProgress.length}/{lab.steps.length}</td>
							<td>{points}</td>
							<td>{new Date(p.joined_at).toLocaleTimeString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}
</div>

<style>
	.admin-dashboard {
		animation: taskSlideIn 0.3s ease;
	}

	.dash-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.dash-actions {
		display: flex;
		gap: 0.5rem;
	}

	.loading-text {
		color: var(--text-muted);
		text-align: center;
		padding: 3rem 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2.5rem;
	}

	.stat-card {
		background: var(--light-surface);
		border: 1px solid var(--light-border);
		border-radius: var(--radius);
		padding: 1.25rem;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: var(--orange);
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section {
		margin-bottom: 2.5rem;
	}

	.section h2 {
		margin-bottom: 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.search-input {
		max-width: 240px;
	}

	.histogram {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.histo-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.histo-label {
		width: 200px;
		font-size: 0.8rem;
		color: var(--text-secondary);
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.histo-bar-track {
		flex: 1;
		height: 6px;
		background: var(--light-surface);
		border-radius: 3px;
		overflow: hidden;
	}

	.histo-bar-fill {
		height: 100%;
		background: var(--orange);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.histo-count {
		font-size: 0.75rem;
		color: var(--text-muted);
		width: 50px;
		text-align: right;
		flex-shrink: 0;
	}

	.participants-table {
		width: 100%;
		border-collapse: collapse;
	}

	.participants-table th {
		padding: 0.625rem 0.75rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		border-bottom: 2px solid var(--light-border);
	}

	.participants-table td {
		padding: 0.625rem 0.75rem;
		border-bottom: 1px solid var(--light-border);
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.histo-label {
			width: 120px;
		}
	}
</style>
