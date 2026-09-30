import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-oxc";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            ssr: "resources/js/ssr.tsx",
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        hmr: {
            host: "localhost",
        },
        watch: {
            usePolling: true, // Required for Docker on Windows/WSL2
            interval: 100, // Reduces CPU usage during polling
        },
    },
    ssr: {
        noExternal: ["@inertiajs/server"],
    },
    build: {
        chunkSizeWarningLimit: 1000,
    },
});
