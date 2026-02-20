import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Session, Participant, Presenter } from '$lib/types';

const STORAGE_KEY_SESSION = 'claude-labs-session';
const STORAGE_KEY_PARTICIPANT = 'claude-labs-participant';

function loadFromStorage<T>(key: string): T | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function saveToStorage(key: string, value: unknown) {
	if (typeof window === 'undefined') return;
	if (value === null) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
}

export const currentSession = writable<Session | null>(loadFromStorage(STORAGE_KEY_SESSION));
export const currentParticipant = writable<Participant | null>(loadFromStorage(STORAGE_KEY_PARTICIPANT));

currentSession.subscribe((v) => saveToStorage(STORAGE_KEY_SESSION, v));
currentParticipant.subscribe((v) => saveToStorage(STORAGE_KEY_PARTICIPANT, v));

export const isJoined = derived(
	[currentSession, currentParticipant],
	([$session, $participant]) => !!$session && !!$participant
);

export async function fetchSession(sessionId: string): Promise<Session | null> {
	if (!supabase) return null;
	const { data, error } = await supabase
		.from('sessions')
		.select('id, lab_slug, lab_title, alias, has_join_password, created_at, expires_at, slide_deck, event_name, company_name, wifi_ssid, wifi_password, api_credit_url')
		.eq('id', sessionId)
		.single();
	if (error) return null;
	return data as Session;
}

export async function fetchSessionPresenters(sessionId: string): Promise<Presenter[]> {
	if (!supabase) return [];
	const { data } = await supabase.rpc('get_session_presenters', { p_session_id: sessionId });
	return (data ?? []) as Presenter[];
}

export async function setSessionPresenters(sessionId: string, presenterIds: string[]): Promise<void> {
	if (!supabase) return;
	await supabase.rpc('set_session_presenters', {
		p_session_id: sessionId,
		p_presenter_ids: presenterIds
	});
}

export async function fetchAllPresenters(): Promise<Presenter[]> {
	if (!supabase) return [];
	const { data } = await supabase
		.from('presenters')
		.select('*')
		.order('created_at', { ascending: true });
	return (data ?? []) as Presenter[];
}

export interface CreateSessionOptions {
	alias?: string;
	passphrase?: string;
	joinPassword?: string;
	slideDeck?: string;
	eventName?: string;
	companyName?: string;
	wifiSsid?: string;
	wifiPassword?: string;
	apiCreditUrl?: string;
}

export async function createSession(
	labSlug: string,
	labTitle: string,
	options: CreateSessionOptions = {}
): Promise<string | null> {
	if (!supabase) return null;
	const { data, error } = await supabase.rpc('create_session', {
		p_lab_slug: labSlug,
		p_lab_title: labTitle,
		p_alias: options.alias || null,
		p_passphrase: options.passphrase || null,
		p_join_password: options.joinPassword || null,
		p_slide_deck: options.slideDeck || null,
		p_speaker_names: null,
		p_event_name: options.eventName || null,
		p_company_name: options.companyName || null,
		p_wifi_ssid: options.wifiSsid || null,
		p_wifi_password: options.wifiPassword || null,
		p_api_credit_url: options.apiCreditUrl || null
	});
	if (error) {
		console.error('Failed to create session:', error);
		return null;
	}
	return data as string;
}

export async function joinSession(
	sessionId: string,
	name: string,
	joinPassword?: string
): Promise<Participant | null> {
	if (!supabase) return null;
	const { data, error } = await supabase.rpc('join_session', {
		p_session_id: sessionId,
		p_name: name,
		p_join_password: joinPassword || null
	});
	if (error) {
		console.error('Failed to join session:', error);
		throw error;
	}
	const participant = data as Participant;
	currentParticipant.set(participant);
	return participant;
}

export function leaveSession() {
	currentSession.set(null);
	currentParticipant.set(null);
}
