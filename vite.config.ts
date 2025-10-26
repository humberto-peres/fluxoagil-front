import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwind()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: [
			'./vitest.polyfills.ts',
			'./src/tests/setup.ts'
		],
		css: true,
		include: ['src/tests/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			reportsDirectory: './coverage'
		},
		testTimeout: 100000,
		hookTimeout: 100000,
		server: {
			deps: {
				inline: [
					/whatwg-url/,
					/webidl-conversions/,
					/tr46/,
					/punycode/,
				]
			}
		},
		pool: 'forks',
		isolate: true,
	}
});