import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

const isCi = Boolean(process.env.CI || process.env.VERCEL)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Skip in CI/Vercel: visualizer + Rolldown can fail or bloat logs; not needed for production bundles.
    ...(isCi
      ? []
      : [
          visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]),
  ],
  server: {
    proxy: {
      // Same-origin embed for shrimbly/node-banana (npm run dev on :3000). See NodeBananaLab.jsx.
      '/node-banana-dev': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        rewrite: (p) => p.replace(/^\/node-banana-dev/, '') || '/',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@xyflow/react')) {
              return 'vendor-flow';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  },
  resolve: {
    // Extensionless imports: .jsx before .tsx so co-located JSX twins keep winning (e.g. InspectorPanel.jsx over .tsx).
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      // Linked blue-ether sources import external deps; Rolldown/Vite may not walk up to app node_modules.
      gsap: path.resolve(__dirname, 'node_modules/gsap'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
      '@reduxjs/toolkit': path.resolve(__dirname, 'node_modules/@reduxjs/toolkit'),
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@nodes': path.resolve(__dirname, './src/nodes'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
