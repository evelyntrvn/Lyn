import { defineConfig } from "vite";

export default defineConfig({
    base: '/',
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