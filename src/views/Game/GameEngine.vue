<template>
  <div class="game-container">
    <template v-if="!isGameOver">
      <header class="dashboard">
        <div class="time-bar" :style="{ width: (timeLeft / globalStore.gameTime * 100) + '%' }"></div>
        
        <div class="stats-header">
          <button class="exit-btn" @click="exitGame">
            <span class="icon">⬅️</span> 撤退
          </button>
          
          <div class="stats">
            <span v-if="combo > 1" class="combo">COMBO x{{ combo }} 🔥</span>
            <span>Score: {{ score }}</span>
          </div>
        </div>
      </header>
      
      <main class="arena">
        <div class="card">
          <div class="hint">{{ currentQ.hint }}</div>
          
          <div class="question-container">
            <template v-if="currentQ.question.type === 'text'">
              <div class="text-question">{{ currentQ.question.content }}</div>
            </template>
            
            <template v-else-if="currentQ.question.type === 'html'">
              <div class="math-html-container" v-html="currentQ.question.content"></div>
            </template>
          </div>

        </div>
      </main>
      
      <footer class="controls">
        <div class="grid">
          <button v-for="opt in currentQ.options" :key="opt" @click="checkAnswer(opt)" class="btn">
            {{ opt }}
          </button>
        </div>
      </footer>

      <div v-if="showErrorModal" class="error-overlay">
        <div class="error-modal">
          <div class="error-header">
            <span class="error-icon">❌</span>
            <h2>回答错误</h2>
          </div>
          
          <div class="compare-box">
            <div class="compare-item">
              <span class="label">你的选择</span>
              <span class="wrong-ans">{{ feedbackData.wrongAns }}</span>
            </div>
            <div class="compare-item">
              <span class="label">正确答案</span>
              <span class="correct-ans">{{ feedbackData.correctAns }}</span>
            </div>
          </div>

          <div class="explanation-box">
            <h4>💡 秒杀思路</h4>
            <p>{{ feedbackData.explanation }}</p>
          </div>

          <button class="continue-btn" @click="resumeGame">记住了，下一题</button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="game-over-screen">
        <h1 class="game-over-title">挑战结束</h1>
        <div class="result-card">
          <div class="rating-box">
            <div class="rating-label">最终评级</div>
            <div :class="['rating-value', 'grade-' + getRating.toLowerCase()]">{{ getRating }}</div>
          </div>
          <div class="data-list">
            <div class="data-item">
              <span class="data-label">答题总数</span>
              <span class="data-value">{{ totalAnswered }} 道</span>
            </div>
            <div class="data-item">
              <span class="data-label">答对题数</span>
              <span class="data-value">{{ correctAnswered }} / {{ totalAnswered }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">正确率</span>
              <span class="data-value">{{ accuracy }}%</span>
            </div>
            <div class="data-item">
              <span class="data-label">最终得分</span>
              <span class="data-value highlight">{{ score }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">最终得分</span>
              <div class="score-wrapper">
                <span v-if="isNewRecord" class="new-record-badge">🎉 新纪录!</span>
                <span class="data-value highlight">{{ score }}</span>
              </div>
            </div>
            <div class="data-item">
              <span class="data-label">历史最高</span>
              <span class="data-value" style="color: #f6ad55;">{{ globalStore.highScores[gameMode] || score }}</span>
            </div>

          </div>
        </div>
        <div class="action-buttons">
          <button class="action-btn restart" @click="restartGame">再来一局</button>
          <button class="action-btn home" @click="goHome">返回模式选择</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { questionGenerators } from '../../utils/mathEngine.js';
import { globalStore } from '../../store/index.js';

const router = useRouter();
const route = useRoute();
const gameMode = route.params.mode; 

const isGameOver = ref(false);
const currentQ = ref({ hint: '', question: { type: 'text', content: '' }, correctAnswer: '', options: [], explanation: '' });
const score = ref(0);
const combo = ref(0);
const timeLeft = ref(globalStore.gameTime);
let timer = null;

const totalAnswered = ref(0);
const correctAnswered = ref(0);

// 新增：错题反馈相关状态
const showErrorModal = ref(false);
const feedbackData = ref({ wrongAns: '', correctAns: '', explanation: '' });

const accuracy = computed(() => {
  if (totalAnswered.value === 0) return 0;
  return Math.round((correctAnswered.value / totalAnswered.value) * 100);
});

const getRating = computed(() => {
  if (totalAnswered.value === 0) return 'D';
  const acc = accuracy.value;
  if (acc === 100) return 'SSS';
  if (acc >= 90) return 'S';
  if (acc >= 80) return 'A';
  if (acc >= 70) return 'B';
  if (acc >= 60) return 'C';
  return 'D';
});

function loadNext() {
  const generator = questionGenerators[gameMode];
  if (generator) {
    currentQ.value = generator();
  } else {
    currentQ.value = questionGenerators['percent']();
  }
}

function checkAnswer(ans) {
  // 如果弹窗已经显示，拦截任何多余点击
  if (showErrorModal.value) return; 

  totalAnswered.value++; 
  if (ans === currentQ.value.correctAnswer) {
    correctAnswered.value++; 
    score.value += 10 + combo.value * 5;
    combo.value++;
    loadNext();
  } else {
    // 答错逻辑：中断连击，扣分，展示弹窗并暂停时间！
    combo.value = 0;
    score.value -= 5;
    
    clearInterval(timer); // 核心：时间静止！
    
    feedbackData.value = {
      wrongAns: ans,
      correctAns: currentQ.value.correctAnswer,
      explanation: currentQ.value.explanation
    };
    showErrorModal.value = true;
  }
}

// 新增：关闭弹窗并恢复游戏
function resumeGame() {
  showErrorModal.value = false;
  loadNext();
  startTimer(); // 核心：恢复时间流动
}

// 新增：记录本局是否打破了记录
const isNewRecord = ref(false);

// 新增：游戏结束的核心逻辑
function endGame() {
  clearInterval(timer);
  isGameOver.value = true;
  
  // 破纪录判定！
  const currentHighScore = globalStore.highScores[gameMode] || 0;
  if (score.value > currentHighScore) {
    globalStore.highScores[gameMode] = score.value; // 更新全局最高分（会自动存入本地）
    isNewRecord.value = true; // 触发 UI 特效
  } else {
    isNewRecord.value = false;
  }
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      endGame(); // 时间到，调用结束逻辑
    }
  }, 1000);
}

function restartGame() {
  isGameOver.value = false;
  isNewRecord.value = false; // 重置新纪录状态
  score.value = 0;
  combo.value = 0;
  timeLeft.value = globalStore.gameTime;
  totalAnswered.value = 0;
  correctAnswered.value = 0;
  loadNext();
  startTimer();
}

function goHome() {
  router.push('/select');
}

onMounted(() => {
  loadNext();
  startTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// 新增：中途退出游戏功能
function exitGame() {
  // 如果游戏已经结束，直接退出
  if (isGameOver.value) {
    router.back();
    return;
  }
  
  // 如果游戏还在进行中，暂停时间并询问
  clearInterval(timer); 
  
  if (confirm("确定要放弃本次训练吗？当前的连击和得分将会丢失！")) {
    router.back(); // 确认放弃，返回上一页
  } else {
    // 舍不得走，恢复倒计时继续战斗！
    startTimer(); 
  }
}


</script>

<style scoped>
/* 原有样式保留 */
.game-container { height: 100vh; background: #1a202c; color: white; display: flex; flex-direction: column; font-family: sans-serif; overflow: hidden; position: relative; }
.dashboard { padding: 20px; }
.time-bar { height: 10px; background: #48bb78; transition: width 0.1s; border-radius: 5px; margin-bottom: 10px; }
.stats { display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; }
.combo { color: #f6e05e; animation: pop 0.3s ease; }
@keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
.arena { flex: 1; display: flex; align-items: center; justify-content: center; z-index: 1; }
.card { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); width: 80%; border: 1px solid rgba(255,255,255,0.1); }
.hint { font-size: 14px; color: #a0aec0; margin-bottom: 10px; }
.controls { padding: 20px 20px 40px 20px; z-index: 1; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 200px; }
.btn { background: #2d3748; color: white; border: none; border-radius: 15px; font-size: 28px; font-weight: bold; cursor: pointer; transition: 0.1s; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.btn:active { transform: scale(0.95); background: #4a5568; }

.question-container { display: flex; justify-content: center; align-items: center; min-height: 140px; margin-top: 20px; }
.text-question { font-size: 64px; font-weight: bold; color: #fc8181; }
.fraction-box { display: inline-flex; flex-direction: column; align-items: center; font-size: 44px; font-weight: bold; color: #fc8181; line-height: 1.2; }
.numerator { padding: 0 20px 8px 20px; border-bottom: 5px solid #fc8181; }
.denominator { padding: 8px 20px 0 20px; }

/* 结算界面样式保留 */
.game-over-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.5s ease; z-index: 10; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.game-over-title { font-size: 40px; font-weight: bold; color: #e2e8f0; margin-bottom: 30px; letter-spacing: 4px; }
.result-card { background: linear-gradient(145deg, #2d3748, #1a202c); padding: 30px; border-radius: 20px; width: 90%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1); margin-bottom: 40px; }
.rating-box { text-align: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
.rating-label { font-size: 16px; color: #a0aec0; margin-bottom: 5px; }
.rating-value { font-size: 72px; font-weight: 900; font-style: italic; line-height: 1; }
.grade-sss { color: #fbd38d; text-shadow: 0 0 20px rgba(251, 211, 141, 0.8), 0 0 40px rgba(251, 211, 141, 0.4); }
.grade-s { color: #f6ad55; text-shadow: 0 0 15px rgba(246, 173, 85, 0.6); }
.grade-a { color: #68d391; text-shadow: 0 0 15px rgba(104, 211, 145, 0.6); }
.grade-b { color: #63b3ed; text-shadow: 0 0 15px rgba(99, 179, 237, 0.6); }
.grade-c { color: #b794f4; }
.grade-d { color: #a0aec0; }
.data-list { display: flex; flex-direction: column; gap: 15px; }
.data-item { display: flex; justify-content: space-between; align-items: center; font-size: 18px; }
.data-label { color: #a0aec0; }
.data-value { font-weight: bold; color: #e2e8f0; }
.data-value.highlight { color: #fc8181; font-size: 24px; }
.action-buttons { display: flex; flex-direction: column; gap: 15px; width: 90%; max-width: 400px; }
.action-btn { width: 100%; padding: 18px; border-radius: 15px; font-size: 20px; font-weight: bold; border: none; cursor: pointer; transition: 0.2s; }
.action-btn.restart { background: #48bb78; color: white; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3); }
.action-btn.restart:active { background: #38a169; transform: scale(0.98); }
.action-btn.home { background: transparent; color: #a0aec0; border: 2px solid #4a5568; }
.action-btn.home:active { background: #2d3748; transform: scale(0.98); }

/* === 新增：错题解析弹窗样式 === */
.error-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.2s; }
.error-modal { background: #2d3748; width: 85%; max-width: 400px; border-radius: 20px; padding: 30px; border: 2px solid #fc8181; box-shadow: 0 0 30px rgba(252, 129, 129, 0.3); display: flex; flex-direction: column; gap: 20px; animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes slideUp { from { transform: translateY(40px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

.error-header { display: flex; flex-direction: column; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
.error-icon { font-size: 40px; }
.error-header h2 { margin: 0; color: #fc8181; font-size: 24px; }

.compare-box { display: flex; justify-content: space-around; background: #1a202c; padding: 15px; border-radius: 12px; }
.compare-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.compare-item .label { color: #a0aec0; font-size: 14px; }
.wrong-ans { color: #fc8181; font-size: 24px; font-weight: bold; text-decoration: line-through; }
.correct-ans { color: #48bb78; font-size: 24px; font-weight: bold; }

.explanation-box { background: rgba(99, 179, 237, 0.1); border-left: 4px solid #63b3ed; padding: 15px; border-radius: 8px; }
.explanation-box h4 { margin: 0 0 8px 0; color: #63b3ed; font-size: 16px; }
.explanation-box p { margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.6; }

.continue-btn { background: #48bb78; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(72,187,120,0.3); margin-top: 10px; }
.continue-btn:active { transform: scale(0.95); }

/* === 新增：顶部数据栏与退出按钮样式 === */
.stats-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.stats { display: flex; gap: 20px; font-size: 24px; font-weight: bold; align-items: center; }

.exit-btn { background: rgba(255, 255, 255, 0.05); color: #a0aec0; border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; }
.exit-btn:hover { background: #f56565; color: white; border-color: #f56565; }
.exit-btn:active { transform: scale(0.95); }

/* === 核心：微型数学渲染引擎样式 === */
/* 注意：必须用 :deep() 才能穿透并渲染 v-html 生成的节点 */
:deep(.math-html-container) { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 5px; min-height: 150px; }
:deep(.exp-text) { font-size: 36px; font-weight: bold; color: #fc8181; margin: 0 5px; }

:deep(.fraction-box) { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; color: #fc8181; line-height: 1.2; vertical-align: middle; margin: 0 5px; }
:deep(.numerator) { display: flex; align-items: center; justify-content: center; padding: 0 15px 8px 15px; border-bottom: 5px solid #fc8181; width: 100%; box-sizing: border-box; }
:deep(.denominator) { display: flex; align-items: center; justify-content: center; padding: 8px 15px 0 15px; width: 100%; box-sizing: border-box; }

/* 针对复杂真题里的微缩版嵌套分式 */
:deep(.fraction-box.small) { font-size: 22px; margin: 0 2px; }
:deep(.fraction-box.small .numerator) { border-bottom: 3px solid #fc8181; padding: 0 8px 4px 8px; }
:deep(.fraction-box.small .denominator) { padding: 4px 8px 0 8px; }

/* 新纪录特效徽章 */
.score-wrapper { display: flex; align-items: center; gap: 10px; }
.new-record-badge { background: linear-gradient(135deg, #f6e05e, #f6ad55); color: #1a202c; padding: 4px 8px; border-radius: 6px; font-size: 14px; font-weight: bold; animation: popBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 0 10px rgba(246, 173, 85, 0.5); }
@keyframes popBounce { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }

</style>