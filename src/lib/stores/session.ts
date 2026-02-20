import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Session, Participant } from '$lib/types';

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
		.select('*')
		.eq('id', sessionId)
		.single();
	if (error) return null;
	return data as Session;
}

export async function createSession(
	labSlug: string,
	labTitle: string,
	alias?: string,
	passphrase?: string,
	joinPassword?: string
): Promise<string | null> {
	if (!supabase) return null;
	const { data, error } = await supabase.rpc('create_session', {
		p_lab_slug: labSlug,
		p_lab_title: labTitle,
		p_alias: alias || null,
		p_passphrase: passphrase || null,
		p_join_password: joinPassword ?? 'claude_code_wizards'
	});
	if (error) {
		console.error('Failed to create session:', error);
		return null;
	}
	return data as string;
}

export async function joinSession(sessionId: string, name: string): Promise<Participant | null> {
	if (!supabase) return null;
	const { data, error } = await supabase
		.from('participants')
		.upsert({ session_id: sessionId, name }, { onConflict: 'session_id,name' })
		.select()
		.single();
	if (error) {
		console.error('Failed to join session:', error);
		return null;
	}
	const participant = data as Participant;
	currentParticipant.set(participant);
	return participant;
}

export function leaveSession() {
	currentSession.set(null);
	currentParticipant.set(null);
}
