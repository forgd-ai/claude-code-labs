import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Plugin } from 'vite';

const VIRTUAL_MODULE_ID = 'virtual:prereqs';
const RESOLVED_ID = '\0virtual:prereqs';

async function markdownToHtml(md: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(md);
	// remark-gfm emits task-list checkboxes as disabled by default — strip so they're interactive
	return String(result).replace(/ disabled=""/g, '');
}

export function prereqsParserPlugin(): Plugin {
	let prereqsFile: string;

	return {
		name: 'vite-plugin-prereqs-parser',
		configResolved(config) {
			prereqsFile = join(config.root, 'prereqs', 'workshop.md');
		},
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return;

			let raw: string;
			try {
				raw = readFileSync(prereqsFile, 'utf-8');
			} catch {
				return `export const html = ''; export const title = ''; export const subtitle = ''; export const notice = '';`;
			}

			const { data: frontmatter, content } = matter(raw);
			const html = await markdownToHtml(content);

			return `
export const html = ${JSON.stringify(html)};
export const title = ${JSON.stringify(frontmatter.title ?? '')};
export const subtitle = ${JSON.stringify(frontmatter.subtitle ?? '')};
export const notice = ${JSON.stringify(frontmatter.notice ?? '')};
`.trim();
		},
		handleHotUpdate({ file, server }) {
			// Use direct equality (prereqsFile is already an absolute, normalized path)
			if (file === prereqsFile) {
				const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (mod) {
					server.moduleGraph.invalidateModule(mod);
					server.ws.send({ type: 'full-reload' });
				}
			}
		}
	};
}
