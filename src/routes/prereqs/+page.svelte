<script lang="ts">
	import { base } from '$app/paths';
	import { html, title, subtitle, notice } from 'virtual:prereqs';

	let checked = $state<Record<string, boolean>>({});

	$effect(() => {
		const container = document.querySelector('.prereqs-body');
		if (!container) return;
		const inputs = Array.from(container.querySelectorAll('input[type="checkbox"]'));
		const handlers = inputs.map((input, i) => {
			const el = input as HTMLInputElement;
			const key = `item-${i}`;
			const handler = () => { checked[key] = el.checked; };
			el.addEventListener('change', handler);
			return { el, handler };
		});
		return () => { handlers.forEach(({ el, handler }) => el.removeEventListener('change', handler)); };
	});
</script>

<svelte:head>
	<title>{title} — {subtitle}</title>
</svelte:head>

<div class="page">
	<header class="page-header">
		<div class="header-inner">
			<img src="{base}/logos/forgd.png" alt="forgd" class="logo" />
			<span class="workshop-label">Claude Code Workshop</span>
		</div>
	</header>

	<main class="content">
		<div class="hero">
			<div class="hero-tag">CLAUDE CODE WORKSHOP</div>
			<h1>{title}</h1>
		</div>

		{#if notice}
			<div class="notice">
				<strong>Pre-Workshop Technical Requirements</strong>
				<span class="divider">|</span>
				{notice}
			</div>
		{/if}

		<div class="prereqs-body">
			{@html html}
		</div>

		<div class="closing">
			<p class="closing-headline">See you at the workshop!</p>
			<p class="closing-sub">Questions? Reach out to your forgd workshop coordinator.</p>
		</div>
	</main>

	<footer class="page-footer">
		<span>Confidential</span>
		<span class="divider">|</span>
		<span>forgd</span>
		<span class="divider">|</span>
		<span>{title}</span>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		background: var(--dark);
		color: var(--light);
		display: flex;
		flex-direction: column;
	}

	.page-header {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--dark-border);
	}

	.header-inner {
		max-width: 760px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		height: 24px;
		width: auto;
		filter: brightness(0) invert(1);
	}

	.workshop-label {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.content {
		flex: 1;
		max-width: 760px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
		width: 100%;
	}

	.hero {
		background: #1e1b4b;
		border-radius: var(--radius-lg);
		padding: 2rem 2.25rem;
		margin-bottom: 1.5rem;
	}

	.hero-tag {
		color: #a78bfa;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		letter-spacing: 0.08em;
		margin-bottom: 0.5rem;
	}

	.hero h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0;
		color: var(--light);
	}

	.notice {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		margin-bottom: 2.5rem;
		color: var(--text-muted);
	}

	.notice strong {
		color: var(--light);
	}

	.divider {
		margin: 0 0.5rem;
		opacity: 0.4;
	}

	/* Prereqs HTML body styles */
	.prereqs-body :global(h2) {
		font-size: 1.2rem;
		font-weight: 700;
		border-bottom: 2px solid #4f46e5;
		padding-bottom: 0.5rem;
		margin: 2rem 0 1.25rem;
		color: var(--light);
	}

	.prereqs-body :global(h3) {
		color: #818cf8;
		font-size: 0.9rem;
		font-weight: 600;
		margin: 1.25rem 0 0.6rem;
	}

	.prereqs-body :global(h4) {
		color: var(--light);
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0.75rem 0 0.4rem;
	}

	.prereqs-body :global(p) {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0.25rem 0 0.75rem;
	}

	.prereqs-body :global(ul) {
		padding-left: 1.25rem;
		margin: 0 0 1rem;
	}

	.prereqs-body :global(li) {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
		line-height: 1.5;
	}

	.prereqs-body :global(a) {
		color: #818cf8;
		text-decoration: none;
	}

	.prereqs-body :global(a:hover) {
		text-decoration: underline;
	}

	.prereqs-body :global(pre) {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		padding: 0.6rem 1rem;
		margin: 0.5rem 0;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--orange);
	}

	.prereqs-body :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--orange);
	}

	.prereqs-body :global(pre code) {
		color: inherit;
	}

	/* Task list checkboxes from GFM */
	.prereqs-body :global(input[type='checkbox']) {
		accent-color: #818cf8;
		margin-right: 0.5rem;
		width: auto;
	}

	.prereqs-body :global(li:has(input[type='checkbox'])) {
		list-style: none;
		margin-left: -1.25rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		display: flex;
		align-items: flex-start;
		gap: 0.1rem;
		transition: border-color 0.15s;
		margin-bottom: 0.4rem;
	}

	.prereqs-body :global(li:has(input[type='checkbox']):hover) {
		border-color: #818cf8;
	}

	/* Closing */
	.closing {
		background: #1e1b4b;
		border-radius: var(--radius-lg);
		padding: 2rem;
		text-align: center;
		margin-top: 2rem;
	}

	.closing-headline {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--light);
		margin: 0 0 0.4rem;
	}

	.closing-sub {
		color: var(--text-muted);
		font-size: 0.875rem;
		margin: 0;
	}

	/* Footer */
	.page-footer {
		border-top: 1px solid var(--dark-border);
		padding: 0.75rem 1.5rem;
		text-align: center;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
