import type { PageLoad } from './$types';
import { decks } from 'virtual:slides';
import { fetchSession, fetchSessionPresenters } from '$lib/stores/session';
import { error } from '@sveltejs/kit';
import type { Presenter } from '$lib/types';

export const prerender = false;

function buildSpeakersHtml(presenters: Presenter[]): string {
	if (presenters.length === 0) return '';
	const cards = presenters.map((p) => {
		const avatar = p.photo_url
			? `<img src="${p.photo_url}" alt="${p.full_name}" class="sp-photo" />`
			: `<div class="sp-initial">${p.full_name[0]?.toUpperCase() ?? '?'}</div>`;
		const titleHtml = p.title ? `<span class="sp-title">${p.title}</span>` : '';
		const orgHtml = p.organization ? `<span class="sp-org">${p.organization}</span>` : '';
		return `<div class="sp-card">${avatar}<span class="sp-name">${p.full_name}</span>${titleHtml}${orgHtml}</div>`;
	}).join('');
	return `<div class="sp-cards">${cards}</div>`;
}

export const load: PageLoad = async ({ params }) => {
	const [session, presenters] = await Promise.all([
		fetchSession(params.id),
		fetchSessionPresenters(params.id)
	]);
	if (!session) error(404, 'Session not found');

	const deck = session.slide_deck ? decks.find((d) => d.slug === session.slide_deck) : null;
	if (!deck) error(404, 'No slide deck configured for this session');

	const placeholders: Record<string, string> = {
		speakers: buildSpeakersHtml(presenters),
		event_name: session.event_name ?? '',
		company_name: session.company_name ?? '',
		wifi_ssid: session.wifi_ssid ?? '',
		wifi_password: session.wifi_password ?? '',
		api_credit_url: session.api_credit_url ?? '',
		lab_title: session.lab_title ?? ''
	};

	return { session, deck, placeholders };
};
