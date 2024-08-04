import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 追加: コンテナ内でViteベースのReactを開くために必要らしい
  server: {
    host: true
  },

  // default
  plugins: [react()],
})
