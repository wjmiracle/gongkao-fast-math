import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 核心修复：告诉 Vite，我们的网站放在哪个子目录下！必须和你的 GitHub 仓库名一模一样！
  base: '/gongkao-fast-math/', 
})
