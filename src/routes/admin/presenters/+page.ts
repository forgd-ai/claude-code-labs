import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';
import type { Presenter } from '$lib/types';

export const load: PageLoad = async () => {
	if (!supabase) return { presenters: [] };
	const { data } = await supabase
		.from('presenters')
		.select('*')
		.order('created_at', { ascending: true });
	return { presenters: (data ?? []) as Presenter[] };
};
