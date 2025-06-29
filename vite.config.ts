import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast']
        }
      }
    }
  },
  define: {
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://txhcadkcdvbwysrwpdvd.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aGNhZGtjZHZid3lzcndwZHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTM1MjksImV4cCI6MjA2NjcyOTUyOX0.qG8TNx76IwDn1TwKaG7dXc1rJGc1CwtzWqwJDbSq3Tw'),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || 'AIzaSyB1XxKTeuQWoU7fABqM00_US7jC233bREQ'),
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY || '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'),
    'import.meta.env.VITE_LLM_PROVIDER': JSON.stringify(process.env.VITE_LLM_PROVIDER || 'auto'),
    'import.meta.env.VITE_DEBUG': JSON.stringify(process.env.VITE_DEBUG || 'false'),
  }
}));