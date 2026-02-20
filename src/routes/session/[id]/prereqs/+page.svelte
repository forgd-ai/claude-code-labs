<script lang="ts">
	import { base } from '$app/paths';

	let { data } = $props();
	const { session, lab, prereqsHtml, prereqsTitle, prereqsNotice } = data;

	let checked = $state<Record<string, boolean>>({});

	function toggle(id: string) {
		checked[id] = !checked[id];
	}

	$effect(() => {
		const container = document.querySelector('.prereqs-body');
		if (!container) return;
		const inputs = container.querySelectorAll('input[type="checkbox"]');
		inputs.forEach((input, i) => {
			const el = input as HTMLInputElement;
			const key = `general-${i}`;
			el.checked = checked[key] ?? false;
			el.addEventListener('change', () => toggle(key));
		});
	});

	function printPrereqs() {
		const win = window.open('', '_blank');
		if (!win) return;

		const logoUrl = window.location.origin + base + '/logos/forgd.png';

		const labBlock = lab && lab.prerequisites.length > 0
			? `<div class="lab-block">
				<div class="lab-tag">LAB PREREQUISITES</div>
				<h2>${lab.title}</h2>
				<ul>${lab.prerequisites.map((p: string) => `<li>${p}</li>`).join('')}</ul>
			</div>`
			: '';

		win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${prereqsTitle}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: system-ui, sans-serif; font-size: 11pt; color: #1a1a1a; background: #fff; padding: 2cm; line-height: 1.5; }
  h2 { font-size: 1.1rem; font-weight: 700; border-bottom: 2px solid #4f46e5; padding-bottom: 0.3rem; margin: 1.5rem 0 0.75rem; }
  h3 { font-size: 0.95rem; font-weight: 600; color: #4338ca; margin: 1rem 0 0.4rem; }
  h4 { font-size: 0.9rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
  p { margin-bottom: 0.5rem; font-size: 0.9rem; color: #374151; }
  ul { padding-left: 1.5rem; margin-bottom: 0.75rem; }
  li { font-size: 0.9rem; margin-bottom: 0.25rem; color: #374151; }
  a { color: #4338ca; }
  pre { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; padding: 0.5rem 0.75rem; font-size: 0.85rem; margin: 0.5rem 0; }
  code { font-family: monospace; font-size: 0.85em; background: #f3f4f6; padding: 0.1em 0.3em; border-radius: 3px; }
  pre code { background: none; padding: 0; }
  .page-header { margin-bottom: 1.5rem; border-bottom: 2px solid #1a1a1a; padding-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; }
  .page-header img { height: 20px; width: auto; }
  .page-header span { font-size: 0.8rem; color: #6b7280; }
  .notice { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #6b7280; margin-bottom: 1.5rem; }
  .lab-block { background: #fff7ed; border: 1px solid #fdba74; border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
  .lab-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; color: #c2410c; margin-bottom: 0.4rem; }
  .lab-block h2 { border: none; color: #c2410c; margin: 0 0 0.6rem; font-size: 1rem; padding: 0; }
  .lab-block ul { margin: 0; }
  input[type=checkbox] { margin-right: 0.4rem; }
  @media print { body { padding: 1cm; } }
</style>
</head>
<body>
<div class="page-header">
  <img src="${logoUrl}" alt="forgd" />
  <span>Claude Code Workshop — ${prereqsTitle}</span>
</div>
${prereqsNotice ? `<div class="notice">${prereqsNotice}</div>` : ''}
${labBlock}
<div class="prereqs-content">${prereqsHtml}</div>
</body>
</html>`);
		win.document.close();
		win.focus();
		setTimeout(() => { win.print(); }, 600);
	}
</script>

<svelte:head>
	<title>{prereqsTitle} — {session.lab_title}</title>
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
			<h1>{prereqsTitle}</h1>
		</div>

		{#if prereqsNotice}
			<div class="notice">
				<strong>Pre-Workshop Technical Requirements</strong>
				<span class="divider">|</span>
				{prereqsNotice}
			</div>
		{/if}

		{#if lab && lab.prerequisites.length > 0}
			<div class="lab-block">
				<div class="lab-tag">LAB PREREQUISITES</div>
				<h2>{lab.title}</h2>
				<ul class="lab-prereqs">
					{#each lab.prerequisites as prereq, i}
						<li>
							<label class="check-row" class:done={checked[`lab-${i}`]}>
								<input
									type="checkbox"
									checked={checked[`lab-${i}`]}
									onchange={() => toggle(`lab-${i}`)}
								/>
								<span>{prereq}</span>
							</label>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="prereqs-body">
			{@html prereqsHtml}
		</div>
	</main>

	<div class="sticky-footer">
		<button class="pdf-btn" onclick={printPrereqs}>
			Download PDF
		</button>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: var(--dark);
		color: var(--light);
		display: flex;
		flex-direction: column;
		padding-bottom: 4rem;
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
		padding: 2.5rem 1.5rem 2rem;
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
		margin-bottom: 2rem;
		color: var(--text-muted);
	}

	.notice strong {
		color: var(--light);
	}

	.divider {
		margin: 0 0.5rem;
		opacity: 0.4;
	}

	/* Lab block */
	.lab-block {
		background: rgba(194, 65, 12, 0.08);
		border: 1px solid rgba(249, 115, 22, 0.4);
		border-radius: var(--radius-lg);
		padding: 1.25rem 1.5rem;
		margin-bottom: 2rem;
	}

	.lab-tag {
		color: var(--orange);
		font-size: 0.7rem;
		font-family: var(--font-mono);
		font-weight: 700;
		letter-spacing: 0.08em;
		margin-bottom: 0.5rem;
	}

	.lab-block h2 {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--light);
		margin: 0 0 1rem;
		border: none;
		padding: 0;
	}

	.lab-prereqs {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
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
		padding: 0.35rem 0.75rem;
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

	/* Check rows (for lab prereqs) */
	.check-row {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		font-size: 0.9rem;
	}

	.check-row:hover {
		border-color: var(--orange);
	}

	.check-row.done {
		border-color: var(--orange);
		background: rgba(194, 65, 12, 0.08);
	}

	.check-row.done span {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.check-row input[type='checkbox'] {
		flex-shrink: 0;
		margin-top: 2px;
		accent-color: var(--orange);
		width: auto;
	}

	/* Sticky footer */
	.sticky-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--dark-surface);
		border-top: 1px solid var(--dark-border);
		padding: 0.75rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.pdf-btn {
		background: var(--orange);
		color: #fff;
		border: none;
		border-radius: var(--radius);
		padding: 0.6rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.pdf-btn:hover {
		opacity: 0.85;
	}
</style>
