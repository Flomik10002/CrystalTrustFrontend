import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4200,

    /** Разрешаем любой *.ngrok-free.app */
    // @ts-expect-error — Vite ждёт string, мы даём RegExp
    allowedHosts: [/\.ngrok-free\.app$/],

    /** HMR — можно оставить локальный */
    // hmr: false,
  },
});
