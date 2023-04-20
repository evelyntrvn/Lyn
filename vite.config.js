import { defineConfig } from "vite";

export default defineConfig({
    base: '/Lyn/',
    build: {
        minify: false,
        rollupOptions:{
            treeshake: false,
        },
        commonjsOptions:{
            include: []
        }
      },
    optimizeDeps:{
        disabled:false,
    },
    
})