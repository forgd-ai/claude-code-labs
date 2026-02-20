import type { PageLoad } from './$types';
import { labs } from 'virtual:labs';
import { fetchSession } from '$lib/stores/session';
import { html, title, notice } from 'virtual:prereqs';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const session = await fetchSession(params.id);
	if (!session) error(404, 'Session not found');

	const lab = labs.find((l) => l.slug === session.lab_slug) ?? null;

	return { session, lab, prereqsHtml: html, prereqsTitle: title, prereqsNotice: notice };
};
