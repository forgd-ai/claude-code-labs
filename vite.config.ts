import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { labParserPlugin } from './src/build/parse-labs';
import { slidesParserPlugin } from './src/build/parse-slides';
import { prereqsParserPlugin } from './src/build/parse-prereqs';

export default defineConfig({
	plugins: [labParserPlugin(), slidesParserPlugin(), prereqsParserPlugin(), sveltekit()]
});
