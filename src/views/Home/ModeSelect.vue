<template>
  <div class="select-container">
    <h2 class="title">选择训练模式</h2>
    <div class="mode-grid">
      <div class="mode-card level-1" @click="selectMode('percent')">
        <h3>百分化</h3>
        <p>特殊分数记忆秒杀</p>
        <div class="record-tag" v-if="getHighScore('percent') > 0">🏆 {{ getHighScore('percent') }}</div>
      </div>
      <div class="mode-card level-1" @click="selectMode('base')">
        <h3>求基期量</h3>
        <p>A ÷ (1+r) 截位直除</p>
        <div class="record-tag" v-if="getHighScore('base') > 0">🏆 {{ getHighScore('base') }}</div>
      </div>
      <div class="mode-card level-1" @click="selectMode('growth')">
        <h3>求增长量</h3>
        <p>A÷(1+r)×r 百分点转化</p>
        <div class="record-tag" v-if="getHighScore('growth') > 0">🏆 {{ getHighScore('growth') }}</div>
      </div>
      <div class="mode-card level-1" @click="selectMode('rate')">
        <h3>求增长率</h3>
        <p>(A-B)÷B 截位直除</p>
        <div class="record-tag" v-if="getHighScore('rate') > 0">🏆 {{ getHighScore('rate') }}</div>
      </div>
      
      <div class="mode-card level-2" @click="selectMode('overall')">
        <h3>求整体量</h3>
        <p>部分 ÷ 比重</p>
        <div class="record-tag" v-if="getHighScore('overall') > 0">🏆 {{ getHighScore('overall') }}</div>
      </div>
      <div class="mode-card level-2" @click="selectMode('baseDiff')">
        <h3>基期和差</h3>
        <p>A/(1+a) ± B/(1+b)</p>
        <div class="record-tag" v-if="getHighScore('baseDiff') > 0">🏆 {{ getHighScore('baseDiff') }}</div>
      </div>

      <div class="mode-card level-3" @click="selectMode('baseProp')">
        <h3>基期比重</h3>
        <p>(A/B) × (1+b)/(1+a)</p>
        <div class="record-tag" v-if="getHighScore('baseProp') > 0">🏆 {{ getHighScore('baseProp') }}</div>
      </div>
      <div class="mode-card level-3" @click="selectMode('avgGrowth')">
        <h3>平均值增长率</h3>
        <p>(a-b) ÷ (1+b)</p>
        <div class="record-tag" v-if="getHighScore('avgGrowth') > 0">🏆 {{ getHighScore('avgGrowth') }}</div>
      </div>
      <div class="mode-card level-3" @click="selectMode('twoPeriod')">
        <h3>两期比重变化</h3>
        <p>(A/B) × (a-b)/(1+a)</p>
        <div class="record-tag" v-if="getHighScore('twoPeriod') > 0">🏆 {{ getHighScore('vv') }}</div>
      </div>
    </div>
    
    <button class="back-btn" @click="router.push('/')">返回主页</button>
    <button class="fab-settings" @click="router.push('/settings')">⚙️</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// 新增引入
import { globalStore } from '../../store/index.js';
const router = useRouter();
function selectMode(mode) {
  router.push(`/game/${mode}`);
}

// 辅助函数：安全地获取某个模式的最高分
function getHighScore(mode) {
  return globalStore.highScores[mode] || 0;
}
</script>

<style scoped>
.select-container { height: 100vh; background: #1a202c; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; position: relative; }
.title { font-size: 32px; margin-bottom: 40px; color: #e2e8f0; letter-spacing: 2px; }

.mode-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 40px; max-width: 850px; padding: 0 20px; }

.mode-card { background: #2d3748; padding: 25px 20px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.2s; width: 200px; border: 1px solid rgba(255,255,255,0.05); flex-grow: 1; max-width: 250px; position: relative; overflow: hidden; }
.mode-card:hover { transform: translateY(-5px); }
.mode-card h3 { margin: 0 0 10px 0; font-size: 22px; transition: 0.2s; }
.mode-card p { color: #a0aec0; font-size: 14px; margin: 0; }

/* 难度 1：绿色 */
.level-1:hover { border-color: #48bb78; box-shadow: 0 10px 20px rgba(72,187,120,0.2); }
.level-1 h3 { color: #48bb78; }

/* 难度 2：蓝色 */
.level-2 { border-color: rgba(99, 179, 237, 0.3); }
.level-2:hover { border-color: #63b3ed; box-shadow: 0 10px 20px rgba(99,179,237,0.2); }
.level-2 h3 { color: #63b3ed; }

/* 难度 3：紫色 (Boss级) */
.level-3 { border-color: rgba(183, 148, 244, 0.4); background: linear-gradient(180deg, #2d3748 0%, rgba(183, 148, 244, 0.05) 100%); }
.level-3:hover { border-color: #b794f4; box-shadow: 0 10px 20px rgba(183, 148, 244, 0.2); }
.level-3 h3 { color: #b794f4; }

.back-btn { background: transparent; color: #a0aec0; border: none; font-size: 16px; cursor: pointer; text-decoration: underline; }
.back-btn:hover { color: white; }

.fab-settings { position: fixed; bottom: 30px; right: 30px; background: #2d3748; border: 1px solid rgba(255,255,255,0.1); font-size: 24px; padding: 15px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: 0.3s; z-index: 100; }
.fab-settings:hover { transform: rotate(90deg) scale(1.1); background: #4a5568; }

.record-tag { margin-top: 12px; display: inline-block; background: rgba(246, 173, 85, 0.15); color: #fbd38d; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; border: 1px solid rgba(246, 173, 85, 0.3); }
</style>