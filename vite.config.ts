// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
export default defineConfig({
    build: {
        target: 'node16',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'jspp',
            fileName: 'jspp',
        },
        rollupOptions: {
            external: ['fs'],
        },
    },
});