import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

function inlineAssets() {
  return {
    name: 'inline-assets',
    enforce: 'post',
    generateBundle(options, bundle) {
      const htmlFile = Object.values(bundle).find(f => f.fileName.endsWith('.html'));
      const cssFiles = Object.values(bundle).filter(f => f.fileName.endsWith('.css'));
      const jsFiles = Object.values(bundle).filter(f => f.fileName.endsWith('.js') && f.type === 'chunk');
      
      if (htmlFile) {
        // --- Inline CSS ---
        if (cssFiles.length > 0) {
          let cssContent = '';
          for (const css of cssFiles) {
            cssContent += css.source;
            delete bundle[css.fileName];
          }
          htmlFile.source = htmlFile.source.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
          htmlFile.source = htmlFile.source.replace('</head>', `<style>${cssContent}</style></head>`);
        }

        // --- Inline JS ---
        if (jsFiles.length > 0) {
          let jsContent = '';
          for (const js of jsFiles) {
            jsContent += js.code;
            delete bundle[js.fileName];
          }
          htmlFile.source = htmlFile.source.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/gi, '');
          htmlFile.source = htmlFile.source.replace(/<link[^>]*rel="modulepreload"[^>]*>/gi, '');
          htmlFile.source = htmlFile.source.replace('</body>', `<script type="module">${jsContent}</script></body>`);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [
    ViteMinifyPlugin({}),
    inlineAssets(),
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
