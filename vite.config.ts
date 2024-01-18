import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true, // Don't forget!
        environment: 'vprisma',
        setupFiles: ['vitest-environment-vprisma/setup'],
    },
});
