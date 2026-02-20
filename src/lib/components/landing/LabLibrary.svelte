<script lang="ts">
	import { labs } from 'virtual:labs';
	import { base } from '$app/paths';
	import CreateSession from '$lib/components/session/CreateSession.svelte';
	import type { ParsedLab } from '$lib/types';

	let selectedLab = $state<ParsedLab | null>(null);

	const allTags = [...new Set(labs.flatMap((l) => l.tags))].sort();

	let selectedTags = $state<Set<string>>(new Set());

	const filteredLabs = $derived(
		selectedTags.size === 0
			? labs
			: labs.filter((lab) => lab.tags.some((t) => selectedTags.has(t)))
	);

	function toggleTag(tag: string) {
		const next = new Set(selectedTags);
		if (next.has(tag)) next.delete(tag);
		else next.add(tag);
		selectedTags = next;
	}

	function clearFilters() {
		selectedTags = new Set();
	}
</script>

{#if selectedLab}
	<CreateSession lab={selectedLab} onBack={() => (selectedLab = null)} />
{:else}
	<div class="lab-library">
		<h2>Available Labs</h2>
		{#if allTags.length > 0}
			<div class="filter-bar">
				{#each allTags as tag}
					<button
						class="filter-tag"
						class:active={selectedTags.has(tag)}
						aria-pressed={selectedTags.has(tag)}
						onclick={() => toggleTag(tag)}
					>{tag}</button>
				{/each}
				{#if selectedTags.size > 0}
					<button class="filter-clear" onclick={clearFilters}>Clear</button>
				{/if}
			</div>
			{#if selectedTags.size > 0}
				<p class="filter-count">Showing {filteredLabs.length} of {labs.length} labs</p>
			{/if}
		{/if}
		<div class="lab-grid">
			{#each filteredLabs as lab}
				<button class="lab-card" onclick={() => (selectedLab = lab)}>
					<div class="lab-card-header">
						<span class="difficulty-badge {lab.difficulty}">{lab.difficulty}</span>
						{#if lab.estimated_duration}
							<span class="duration">{lab.estimated_duration}</span>
						{/if}
					</div>
					<h3>{lab.title}</h3>
					{#if lab.description}
						<p class="lab-desc">{lab.description}</p>
					{/if}
					<div class="lab-meta">
						<span class="step-count">{lab.steps.length} steps</span>
						<span class="points">{lab.total_points} pts</span>
					</div>
					<div class="lab-tags">
						{#each lab.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<div class="lab-card-actions">
						<a href="{base}/preview/{lab.slug}" class="preview-link" onclick={(e) => e.stopPropagation()}>Preview</a>
					</div>
				</button>
			{/each}
		</div>
		{#if labs.length === 0}
			<p class="empty">No labs available yet. Add markdown files to the <code>labs/</code> directory.</p>
		{:else if filteredLabs.length === 0}
			<p class="empty">No labs match the selected filters. <button class="filter-clear inline" onclick={clearFilters}>Clear filters</button></p>
		{/if}
	</div>
{/if}

<style>
	.lab-library {
		width: 100%;
		max-width: 800px;
	}

	h2 {
		color: var(--light);
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
	}

	.lab-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 1.25rem;
	}

	.lab-card {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--light);
		font-family: inherit;
		width: 100%;
	}

	.lab-card:hover {
		border-color: var(--orange);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(217, 119, 87, 0.15);
	}

	.lab-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.difficulty-badge {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
	}

	.difficulty-badge.beginner { background: rgba(76, 175, 80, 0.15); color: #4caf50; }
	.difficulty-badge.intermediate { background: rgba(255, 152, 0, 0.15); color: #ff9800; }
	.difficulty-badge.advanced { background: rgba(244, 67, 54, 0.15); color: #f44336; }

	.duration {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	h3 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.lab-desc {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.lab-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}

	.lab-tags {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		background: rgba(217, 119, 87, 0.1);
		color: var(--orange-light);
		border-radius: 4px;
	}

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.filter-tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--dark-border);
		background: var(--dark-surface);
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s ease;
		font-family: inherit;
	}

	.filter-tag:hover {
		border-color: var(--orange);
		color: var(--orange-light);
	}

	.filter-tag:focus-visible {
		outline: 2px solid var(--orange);
		outline-offset: 2px;
	}

	.filter-tag.active {
		background: var(--orange);
		border-color: var(--orange);
		color: #fff;
	}

	.filter-clear {
		font-size: 0.75rem;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--dark-border);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font-family: inherit;
		transition: all 0.15s ease;
	}

	.filter-clear:hover {
		border-color: var(--text-muted);
		color: var(--light);
	}

	.filter-clear:focus-visible {
		outline: 2px solid var(--orange);
		outline-offset: 2px;
	}

	.filter-clear.inline {
		display: inline;
		padding: 0;
		border: none;
		border-radius: 0;
		color: var(--orange-light);
		text-decoration: underline;
	}

	.filter-count {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin-bottom: 1rem;
	}

	.empty {
		color: var(--text-muted);
		text-align: center;
		padding: 3rem 0;
	}

	.empty code {
		color: var(--orange-light);
		background: var(--dark-surface);
		border-color: var(--dark-border);
	}

	.lab-card-actions {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--dark-border);
	}

	.preview-link {
		font-size: 0.8rem;
		color: var(--text-muted);
		text-decoration: none;
	}

	.preview-link:hover {
		color: var(--orange-light);
		text-decoration: underline;
	}
</style>
