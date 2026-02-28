import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';
import ModeSelect from '../views/Home/ModeSelect.vue';
import GameEngine from '../views/Game/GameEngine.vue';
import SettingsView from '../views/Settings/SettingsView.vue'; 

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/select', name: 'Select', component: ModeSelect },
  { path: '/game/:mode', name: 'Game', component: GameEngine },
  { path: '/settings', name: 'Settings', component: SettingsView } 
];

const router = createRouter({
  // 核心神级配置：使用 Hash 模式！彻底消灭静态服务器的 404 白屏问题！
  history: createWebHashHistory(),
  routes
});

export default router;
