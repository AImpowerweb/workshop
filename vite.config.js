import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves a project repo from /<repo-name>/, not the domain root.
  // A relative base makes every built URL resolve against index.html, so the
  // same build works at the root or in any subfolder — and the repository name
  // never has to be hard-coded here.
  //
  // Safe because App.jsx uses hash routing (#/prototype/…): the document path
  // never changes, so relative URLs always resolve from the same place.
  base: './',
});
