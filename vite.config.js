import { defineConfig } from "vite";

export default defineConfig({
    base: '/Lyn/',
    build:{
        commonjsOptions: {include: []}
    },
    optimizeDeps: {
        disabled: false
    }
})