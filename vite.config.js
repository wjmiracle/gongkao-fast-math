import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 核心神级配置：改成相对路径！这样 Vercel 和 GitHub 都能完美识别！
  base: './', 
})
