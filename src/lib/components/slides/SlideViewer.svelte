<script lang="ts">
	import type { ParsedSlide } from '$lib/types';

	let {
		slides,
		placeholders = {}
	}: {
		slides: ParsedSlide[];
		placeholders?: Record<string, string>;
	} = $props();

	let current = $state(0);
	let isFullscreen = $state(false);
	let container = $state<HTMLElement | undefined>(undefined);

	function substituteTokens(html: string): string {
		return html.replace(/\{\{(\w+)\}\}/g, (_, key) => placeholders[key] ?? `{{${key}}}`);
	}

	function next() {
		if (current < slides.length - 1) current++;
	}

	function prev() {
		if (current > 0) current--;
	}

	function toggleFullscreen() {
		if (!container) return;
		if (!document.fullscreenElement) {
			container.requestFullscreen().then(() => { isFullscreen = true; }).catch(() => {});
		} else {
			document.exitFullscreen().then(() => { isFullscreen = false; }).catch(() => {});
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowRight':
			case ' ':
				e.preventDefault();
				next();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				prev();
				break;
			case 'f':
			case 'F':
				toggleFullscreen();
				break;
			case 'Escape':
				if (isFullscreen) document.exitFullscreen().catch(() => {});
				break;
		}
	}

	function handleClick(e: MouseEvent) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const midpoint = rect.left + rect.width / 2;
		if (e.clientX >= midpoint) {
			next();
		} else {
			prev();
		}
	}

	function handleFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
	}

	$effect(() => {
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	});

	const slide = $derived(slides[current]);
	const progress = $derived(slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100);
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="slide-viewer theme-{slide?.theme ?? 'light'}"
	bind:this={container}
	onclick={handleClick}
	role="presentation"
>
	<!-- Progress bar -->
	<div class="progress-bar">
		<div class="progress-fill" style="width: {progress}%"></div>
	</div>

	<!-- Logo chrome -->
	<div class="slide-chrome">
		<img src="/logos/anthropic-wordmark.png" alt="Anthropic" class="logo-anthropic" />
		<img src="/logos/forgd.png" alt="forgd" class="logo-forgd" />
	</div>

	<!-- Slide content -->
	{#if slide}
		<div class="slide slide-{slide.type}">
			<div class="slide-inner">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html substituteTokens(slide.html)}
			</div>
		</div>
	{/if}

	<!-- Controls overlay -->
	<div class="controls" onclick={(e) => e.stopPropagation()} role="toolbar" aria-label="Slide controls">
		<button
			class="ctrl-btn"
			onclick={prev}
			disabled={current === 0}
			aria-label="Previous slide"
		>←</button>

		<span class="counter">{current + 1} / {slides.length}</span>

		<button
			class="ctrl-btn"
			onclick={next}
			disabled={current === slides.length - 1}
			aria-label="Next slide"
		>→</button>

		<button class="ctrl-btn" onclick={toggleFullscreen} aria-label="Toggle fullscreen">
			{isFullscreen ? '⤢' : '⤡'}
		</button>
	</div>
</div>

<style>
	.slide-viewer {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		cursor: pointer;
		user-select: none;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
	}

	/* Fullscreen overrides */
	:global(.slide-viewer:fullscreen) {
		border-radius: 0;
		aspect-ratio: unset;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* === Themes === */
	.theme-light {
		background: #ede4cc;
		color: #1a1a19;
	}

	.theme-dark {
		background: #18180f;
		color: #f5f1e8;
	}

	.theme-orange {
		background: #c4714f;
		color: #1a1a19;
	}

	/* === Progress bar === */
	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.theme-dark .progress-bar {
		background: rgba(255, 255, 255, 0.1);
	}

	.progress-fill {
		height: 100%;
		background: #c4714f;
		transition: width 0.25s ease;
	}

	.theme-light .progress-fill {
		background: #c4714f;
	}

	.theme-orange .progress-fill {
		background: rgba(0, 0, 0, 0.2);
	}

	/* === Slide === */
	.slide {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6% 8%;
	}

	.slide-inner {
		width: 100%;
		max-width: 900px;
	}

	/* Type-specific layouts */
	.slide-title .slide-inner,
	.slide-welcome .slide-inner,
	.slide-section .slide-inner {
		text-align: center;
	}

	/* === Slide typography — theme: light === */
	.theme-light .slide-inner :global(h1) {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		color: #1a1a19;
		margin-bottom: 0.5em;
		line-height: 1.15;
	}

	.theme-light .slide-inner :global(h2) {
		font-size: clamp(1.5rem, 3.5vw, 2.5rem);
		font-weight: 600;
		color: #1a1a19;
		margin-bottom: 0.5em;
	}

	.theme-light .slide-inner :global(h3) {
		font-size: clamp(1.1rem, 2.5vw, 1.75rem);
		font-weight: 500;
		color: #5a5348;
		margin-bottom: 0.75em;
	}

	.theme-light .slide-inner :global(p) {
		font-size: clamp(0.9rem, 2vw, 1.25rem);
		line-height: 1.6;
		margin-bottom: 0.75em;
		color: #1a1a19;
	}

	.theme-light .slide-inner :global(ul),
	.theme-light .slide-inner :global(ol) {
		font-size: clamp(0.85rem, 1.8vw, 1.15rem);
		padding-left: 1.5em;
		margin-bottom: 0.75em;
		color: #1a1a19;
	}

	.theme-light .slide-inner :global(li) {
		margin-bottom: 0.4em;
		line-height: 1.5;
	}

	.theme-light .slide-inner :global(li::marker) {
		color: #c4714f;
	}

	.theme-light .slide-inner :global(strong) {
		font-weight: 700;
		color: #1a1a19;
	}

	.theme-light .slide-inner :global(blockquote) {
		border-left: 4px solid #c4714f;
		padding: 0.75em 1em;
		margin: 1em 0;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 0 var(--radius) var(--radius) 0;
		font-style: italic;
		font-size: clamp(0.85rem, 1.8vw, 1.1rem);
	}

	.theme-light .slide-inner :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: rgba(255, 255, 255, 0.5);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		color: #1a1a19;
	}

	.theme-light .slide-inner :global(pre) {
		font-family: var(--font-mono);
		font-size: clamp(0.7rem, 1.4vw, 0.9rem);
		background: #18180f;
		color: #e8e0d0;
		padding: 1em 1.25em;
		border-radius: var(--radius);
		overflow-x: auto;
		margin: 0.75em 0;
		line-height: 1.5;
	}

	.theme-light .slide-inner :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
	}

	/* === theme: dark === */
	.theme-dark .slide-inner :global(h1) {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		color: var(--light);
		margin-bottom: 0.5em;
		line-height: 1.15;
	}

	.theme-dark .slide-inner :global(h2) {
		font-size: clamp(1.5rem, 3.5vw, 2.5rem);
		font-weight: 600;
		color: var(--light);
		margin-bottom: 0.5em;
	}

	.theme-dark .slide-inner :global(h3) {
		font-size: clamp(1.1rem, 2.5vw, 1.75rem);
		font-weight: 500;
		color: var(--orange-light);
		margin-bottom: 0.75em;
	}

	.theme-dark .slide-inner :global(p) {
		font-size: clamp(0.9rem, 2vw, 1.25rem);
		line-height: 1.6;
		margin-bottom: 0.75em;
		color: rgba(250, 249, 245, 0.85);
	}

	.theme-dark .slide-inner :global(ul),
	.theme-dark .slide-inner :global(ol) {
		font-size: clamp(0.85rem, 1.8vw, 1.15rem);
		padding-left: 1.5em;
		margin-bottom: 0.75em;
		color: rgba(250, 249, 245, 0.85);
	}

	.theme-dark .slide-inner :global(li) {
		margin-bottom: 0.4em;
		line-height: 1.5;
	}

	.theme-dark .slide-inner :global(strong) {
		color: var(--orange-light);
	}

	.theme-dark .slide-inner :global(em) {
		color: var(--text-muted);
	}

	.theme-dark .slide-inner :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: rgba(255,255,255,0.08);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		border: 1px solid rgba(255,255,255,0.12);
		color: var(--orange-light);
	}

	.theme-dark .slide-inner :global(pre) {
		font-family: var(--font-mono);
		font-size: clamp(0.7rem, 1.4vw, 0.9rem);
		background: rgba(0, 0, 0, 0.4);
		color: #e0ddd5;
		padding: 1em 1.25em;
		border-radius: var(--radius);
		overflow-x: auto;
		margin: 0.75em 0;
		line-height: 1.5;
		border: 1px solid rgba(255,255,255,0.08);
	}

	.theme-dark .slide-inner :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
	}

	/* === theme: orange === */
	.theme-orange .slide-inner :global(h1) {
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 700;
		color: #1a1a19;
		margin-bottom: 0.5em;
		line-height: 1.1;
	}

	.theme-orange .slide-inner :global(h2) {
		font-size: clamp(1.5rem, 3.5vw, 2.5rem);
		font-weight: 600;
		color: #1a1a19;
		margin-bottom: 0.5em;
	}

	.theme-orange .slide-inner :global(p) {
		font-size: clamp(0.9rem, 2vw, 1.25rem);
		color: #1a1a19;
		margin-bottom: 0.75em;
	}

	/* === two-col layout === */
	.slide-two-col .slide-inner :global(h2) {
		grid-column: 1 / -1;
		margin-bottom: 1em;
	}

	.slide-two-col .slide-inner :global(ul):first-of-type {
		float: left;
		width: 46%;
		margin-right: 4%;
	}

	.slide-two-col .slide-inner :global(ul):last-of-type {
		float: right;
		width: 46%;
	}

	/* === Logo chrome === */
	.slide-chrome {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 2.5% 3.5%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 5;
		pointer-events: none;
	}

	.logo-anthropic {
		height: clamp(10px, 1.8vw, 18px);
		width: auto;
	}

	.logo-forgd {
		height: clamp(12px, 2vw, 20px);
		width: auto;
	}

	/* On dark slides invert both logos to white */
	.theme-dark .logo-anthropic,
	.theme-dark .logo-forgd {
		filter: brightness(0) invert(1);
	}

	/* Anthropic wordmark is dark on transparent — works on light/orange as-is */
	/* forgd logo is colored — keep as-is on light/orange */

	/* === Controls === */
	.controls {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		z-index: 20;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.slide-viewer:hover .controls {
		opacity: 1;
	}

	.ctrl-btn {
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		border: none;
		border-radius: var(--radius);
		padding: 0.35rem 0.65rem;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1;
		transition: background 0.15s ease;
	}

	.ctrl-btn:hover:not(:disabled) {
		background: rgba(0, 0, 0, 0.7);
	}

	.ctrl-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.counter {
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		border-radius: var(--radius);
		padding: 0.35rem 0.65rem;
		font-size: 0.8rem;
		font-family: var(--font-mono);
		min-width: 3.5rem;
		text-align: center;
	}
</style>
