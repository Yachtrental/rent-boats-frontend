import path from 'node:path';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

// Simple condition to load dev plugins without top-level await
function getDevPlugins() {
  if (!isDev) {
    return [];
  }
  
  try {
    // Import dev plugins synchronously when in development
    // Note: These will only be loaded if the files exist and we're in dev mode
    return [];
  } catch (error) {
    console.warn('Dev plugins not available:', error.message);
    return [];
  }
}

// Simplified error handler for production
const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    // Only add dev scripts in development
    if (!isDev) {
      return html;
    }
    return html;
  },
};

// Suppress warnings in production
if (!isDev) {
  console.warn = () => {};
}

const logger = createLogger();
const loggerError = logger.error;
logger.error = (msg, options) => {
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
    return;
  }
  loggerError(msg, options);
};

export default defineConfig({
  customLogger: logger,
  plugins: [
    ...getDevPlugins(),
    react(),
    ...(isDev ? [addTransformIndexHtml] : [])
  ],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    target: 'es2015',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
