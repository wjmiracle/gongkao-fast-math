<template>
  <div class="app-layout">
    <main class="content-area">
      <div v-if="activeTab === 'practice'" class="tab-pane fade-in">
        <div class="title-area">
          <h1 class="main-title">公考速算1.0</h1>
          <p class="sub-title">资料分析 · 特殊分数秒杀训练</p>
        </div>
        <button class="start-btn" @click="startGame">开始挑战</button>
      </div>

      <div v-if="activeTab === 'exam'" class="tab-pane fade-in">
        <div class="title-area">
          <h1 class="main-title" style="color: #63b3ed;">真题演练大厅</h1>
          <p class="sub-title">真实数据极限抗压</p>
        </div>
        <button class="start-btn real-exam-btn" @click="startRealExam">开始真题速算</button>
      </div>

      <div v-if="activeTab === 'tips'" class="tab-pane fade-in">
        <TipsView style="width: 100%; height: 100%;" />
      </div>
    </main>

    <nav class="bottom-nav">
      <div class="nav-item" :class="{ active: activeTab === 'practice' }" @click="activeTab = 'practice'">
        <span class="icon">📝</span><span class="text">练习</span>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'exam' }" @click="activeTab = 'exam'">
        <span class="icon">📚</span><span class="text">真题</span>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'tips' }" @click="activeTab = 'tips'">
        <span class="icon">💡</span><span class="text">技巧</span>
      </div>
    </nav>

    <button class="global-feedback-btn" @click="showFeedback = true">
      📮 吐槽
    </button>

    <div v-if="showFeedback" class="feedback-overlay">
      <div class="feedback-modal">
        <div class="modal-header">
          <h3>💌 给作者提意见</h3>
          <button class="close-btn" @click="showFeedback = false">×</button>
        </div>
        
        <div class="modal-body">
          <p class="guide-text">无论是遇到 Bug、题目太变态，还是有什么好点子，都在这里喷吧！(作者必看)</p>
          
          <textarea 
            v-model="feedbackText" 
            class="feedback-input" 
            placeholder="哪怕是一个标点符号的建议，对我都很重要..."
            rows="4"
          ></textarea>
          
          <input 
            type="text" 
            v-model="contactInfo" 
            class="contact-input" 
            placeholder="微信号/邮箱 (直接与作者吐槽，选填)"
          />
        </div>
        
        <div class="modal-footer">
          <button class="submit-btn" :class="{ 'loading': isSubmitting }" @click="submitFeedback" :disabled="!feedbackText.trim() || isSubmitting">
            {{ isSubmitting ? '发送中...' : '🚀 一键发送' }}
          </button>
        </div>

        <div v-if="submitSuccess" class="success-msg">
          ✅ 发送成功！感谢你的宝贵意见！
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TipsView from '../Tips/TipsView.vue';

const router = useRouter();
const activeTab = ref('practice');

function startGame() { router.push('/select'); }
function startRealExam() { router.push('/game/realExam'); }

// === 反馈功能状态 ===
const showFeedback = ref(false);
const feedbackText = ref('');
const contactInfo = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// === 无后端发送逻辑 (利用 Formspree 免费转发到你的邮箱) ===
async function submitFeedback() {
  if (!feedbackText.value.trim()) return;
  
  isSubmitting.value = true;
  submitSuccess.value = false;

  // 组装数据
  const payload = {
    message: feedbackText.value,
    contact: contactInfo.value || '匿名用户',
    source: '公考速算外挂App'
  };

  try {
    // 这里的 URL 是你需要去 Formspree.io 免费获取的接口 ID！
    // 教程：去 formspree.io 注册个号，创建一个 form，把拿到的专属 URL 填在这里👇
    await fetch('https://formspree.io/f/mvzbyabd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // 发送成功后的 UI 反馈
    isSubmitting.value = false;
    submitSuccess.value = true;
    feedbackText.value = ''; // 清空内容
    
    // 2秒后自动关闭弹窗
    setTimeout(() => {
      showFeedback.value = false;
      submitSuccess.value = false;
    }, 2000);

  } catch (error) {
    alert('网络出小差了，稍后再试一下吧~');
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* 原有的 App 布局样式 */
.app-layout { height: 100vh; background: #1a202c; color: white; display: flex; flex-direction: column; font-family: sans-serif; overflow: hidden; position: relative; }
.content-area { flex: 1; position: relative; overflow-y: auto; }
.tab-pane { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.title-area { text-align: center; margin-bottom: 60px; }
.main-title { font-size: 48px; font-weight: bold; color: #f56565; margin: 0 0 10px 0; text-shadow: 0 0 20px rgba(245,101,101,0.5); }
.sub-title { font-size: 18px; color: #a0aec0; letter-spacing: 2px; }
.start-btn { background: linear-gradient(135deg, #48bb78, #38a169); color: white; border: none; padding: 20px 60px; font-size: 28px; font-weight: bold; border-radius: 50px; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 20px rgba(72,187,120,0.4); }
.start-btn:active { transform: scale(0.95); box-shadow: 0 5px 10px rgba(72,187,120,0.4); }
.real-exam-btn { background: linear-gradient(135deg, #63b3ed, #3182ce); box-shadow: 0 10px 20px rgba(99,179,237,0.4); }
.bottom-nav { display: flex; justify-content: space-around; align-items: center; background: #2d3748; height: 70px; border-top: 1px solid rgba(255,255,255,0.05); padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -4px 10px rgba(0,0,0,0.2); z-index: 10; }
.nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; height: 100%; cursor: pointer; color: #a0aec0; transition: 0.2s; }
.nav-item .icon { font-size: 24px; margin-bottom: 4px; transition: transform 0.2s; }
.nav-item .text { font-size: 12px; font-weight: bold; }
.nav-item.active { color: #48bb78; }
.nav-item.active .icon { transform: scale(1.2); }

/* === 悬浮吐槽按钮样式 === */
.global-feedback-btn {
  position: absolute;
  bottom: 90px; /* 悬浮在底部导航栏上方 */
  right: 20px;
  background: #f6ad55;
  color: #1a202c;
  border: none;
  padding: 10px 18px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(246, 173, 85, 0.4);
  cursor: pointer;
  z-index: 50;
  transition: 0.2s;
  border: 2px solid #fff;
}
.global-feedback-btn:active { transform: scale(0.95); }

/* === 反馈弹窗样式 === */
.feedback-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
.feedback-modal { background: #2d3748; width: 90%; max-width: 400px; border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 15px; position: relative; }
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
.modal-header h3 { margin: 0; color: #fbd38d; font-size: 18px; }
.close-btn { background: transparent; border: none; color: #a0aec0; font-size: 28px; cursor: pointer; line-height: 1; padding: 0; }
.close-btn:hover { color: #f56565; }

.guide-text { color: #cbd5e0; font-size: 13px; margin: 0; line-height: 1.5; }
.feedback-input { width: 100%; background: #1a202c; border: 1px solid #4a5568; color: white; border-radius: 8px; padding: 12px; font-size: 14px; resize: none; outline: none; box-sizing: border-box; font-family: inherit; }
.feedback-input:focus { border-color: #f6ad55; }
.contact-input { width: 100%; background: #1a202c; border: 1px solid #4a5568; color: white; border-radius: 8px; padding: 12px; font-size: 13px; outline: none; box-sizing: border-box; font-family: inherit; margin-top: 10px; }

.modal-footer { margin-top: 5px; }
.submit-btn { width: 100%; background: #48bb78; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.2s; }
.submit-btn:disabled { background: #4a5568; color: #a0aec0; cursor: not-allowed; }
.submit-btn:not(:disabled):active { transform: scale(0.98); background: #38a169; }

.success-msg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(72,187,120,0.95); color: white; padding: 15px 20px; border-radius: 10px; font-weight: bold; font-size: 14px; text-align: center; width: 80%; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
</style>