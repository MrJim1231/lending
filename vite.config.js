import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

function inlineCSS() {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      const htmlFile = Object.values(bundle).find(f => f.fileName.endsWith('.html'));
      const cssFiles = Object.values(bundle).filter(f => f.fileName.endsWith('.css'));
      
      if (htmlFile && cssFiles.length > 0) {
        let cssContent = '';
        for (const css of cssFiles) {
          cssContent += css.source;
          delete bundle[css.fileName];
        }
        
        htmlFile.source = htmlFile.source.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
        htmlFile.source = htmlFile.source.replace('</head>', `<style>${cssContent}</style></head>`);
      }
    }
  };
}

export default defineConfig({
  plugins: [
    ViteMinifyPlugin({}),
    inlineCSS(),
  ],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
