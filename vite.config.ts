import { defineConfig } from 'vite';
import react from '@vitejs.plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // <-- এই লাইনটি যুক্ত বা নিশ্চিত করুন
});