import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5175,
    host: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    {
      name: 'patch-react-typing-effect',
      transform(code, id) {
        if (id.includes('react-typing-effect') && code.includes('e.exports=r(3)')) {
          return code.replace('e.exports=r(3)', 'e.exports=require("react")');
        }
      }
    },
    react(),
    tailwindcss(),
  ],
});
