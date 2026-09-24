import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// Carga la configuración del entorno seleccionado al iniciar o compilar.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const dataSource = env.VITE_DATA_SOURCE || 'json';

  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_PATH || '/',
    // Alias de carpetas para mantener legibles los imports.
    resolve: {
      alias: {
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url),
        ),
        '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@repositories': fileURLToPath(
          new URL('./src/repositories', import.meta.url),
        ),
        '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
        '@tests': fileURLToPath(new URL('./src/tests', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@router': fileURLToPath(new URL('./src/router', import.meta.url)),

        // Selecciona el repositorio sin cambiar servicios ni hooks.
        '@data-source': fileURLToPath(
          new URL(
            dataSource === 'api'
              ? './src/repositories/api'
              : './src/repositories/json',
            import.meta.url,
          ),
        ),
      },
    },
  };
});
