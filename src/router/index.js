import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';
import ModeSelect from '../views/Home/ModeSelect.vue';
import GameEngine from '../views/Game/GameEngine.vue';
import SettingsView from '../views/Settings/SettingsView.vue'; // 1. 引入设置页

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/select', name: 'Select', component: ModeSelect },
  { path: '/game/:mode', name: 'Game', component: GameEngine },
  { path: '/settings', name: 'Settings', component: SettingsView } // 2. 添加路由规则
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;