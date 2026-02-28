// src/store/index.js
import { reactive, watch } from 'vue';

// 读取设置的时间
const savedTime = localStorage.getItem('customGameTime');
// 读取历史最高分字典
const savedScores = localStorage.getItem('fastMathHighScores');

export const globalStore = reactive({
  gameTime: savedTime ? parseInt(savedTime) : 60,
  // 如果本地有记录就解析出来，没有就初始化一个空对象
  highScores: savedScores ? JSON.parse(savedScores) : {}
});

// 监听时间设置变化
watch(() => globalStore.gameTime, (newVal) => {
  localStorage.setItem('customGameTime', newVal);
});

// 监听最高分变化（开启 deep 深度监听，因为是对象）
watch(() => globalStore.highScores, (newVal) => {
  localStorage.setItem('fastMathHighScores', JSON.stringify(newVal));
}, { deep: true });