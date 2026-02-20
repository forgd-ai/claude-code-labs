export interface LabStepMeta {
	id: string;
	points: number;
	category: 'core' | 'bonus';
}

export interface LabStep {
	id: string;
	title: string;
	points: number;
	category: 'core' | 'bonus';
	html: string;
}

export interface ParsedLab {
	slug: string;
	title: string;
	description: string;
	difficulty: string;
	estimated_duration: string;
	prerequisites: string[];
	tags: string[];
	intro_html: string;
	steps: LabStep[];
	total_points: number;
}

export interface Session {
	id: string;
	lab_slug: string;
	lab_title: string;
	alias: string | null;
	join_password: string | null;
	created_at: string;
	expires_at: string | null;
}

export interface Participant {
	id: string;
	session_id: string;
	name: string;
	joined_at: string;
}

export interface Progress {
	id: string;
	participant_id: string;
	session_id: string;
	step_id: string;
	points: number;
	completed_at: string;
}

export interface LeaderboardEntry {
	participant_id: string;
	name: string;
	total_points: number;
	steps_completed: number;
	last_completed_at: string;
}

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
}
