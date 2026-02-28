<template>
  <div class="settings-container">
    <h2 class="title">⚙️ 设置与反馈</h2>
    
    <div class="setting-card">
      <div class="setting-item">
        <div class="label-area">
          <h3>单局答题时间</h3>
          <p>调整每局游戏的总时长（秒）</p>
        </div>
        <div class="input-area">
          <input 
            type="number" 
            v-model="globalStore.gameTime" 
            min="10" 
            max="300"
            class="time-input"
          />
          <span class="unit">秒</span>
        </div>
      </div>
    </div>

    <div class="feedback-card">
      <div class="feedback-header">
        <span class="icon">💌</span>
        <h3>致所有考公战友</h3>
      </div>
      
      <div class="philosophy-box">
        <p>“一个好的产品需要大众的认可才能做得优秀。只有不断吸取大家的意见并落实，才能做出真正有价值的东西。”</p>
      </div>
      
      <p class="promise">
        如果你在使用中遇到任何 Bug，或者有任何能让这个 APP 变得更好的脑洞和建议，请务必联系我！<br>
        <strong>作者一定会第一时间回复，并持续优化更新！</strong>
      </p>

      <div class="contact-actions">
        <a href="mailto:your_email@example.com?subject=公考速算外挂APP反馈" class="contact-btn email-btn">
          <span class="btn-icon">📧</span> 
          <span>发邮件给我</span>
        </a>
        
        <button class="contact-btn wechat-btn" @click="copyWechat">
          <span class="btn-icon">💬</span> 
          <span>{{ wechatBtnText }}</span>
        </button>
      </div>
    </div>

    <button class="back-btn" @click="router.back()">返回</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { globalStore } from '../../store/index.js'; //

const router = useRouter();

// --- 微信复制逻辑 ---
const wechatBtnText = ref('复制作者微信反馈');
// 👇 请把这里换成你真实的微信号！
const myWechatId = 'your_wechat_id'; 

function copyWechat() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(myWechatId).then(() => {
      wechatBtnText.value = '✅ 复制成功！去微信加我';
      // 2.5秒后恢复原状
      setTimeout(() => {
        wechatBtnText.value = '复制作者微信反馈';
      }, 2500);
    }).catch(() => {
      fallbackCopy();
    });
  } else {
    fallbackCopy();
  }
}

// 兼容老版本浏览器的复制方法
function fallbackCopy() {
  alert(`复制失败，请手动添加作者微信号：${myWechatId}`);
}
</script>

<style scoped>
.settings-container { height: 100vh; background: #1a202c; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; overflow-y: auto; padding: 20px 0; }
.title { font-size: 32px; margin-bottom: 30px; color: #e2e8f0; letter-spacing: 2px; flex-shrink: 0; }

/* 设置卡片 */
.setting-card { background: #2d3748; padding: 30px; border-radius: 15px; width: 90%; max-width: 500px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; flex-shrink: 0; }
.setting-item { display: flex; justify-content: space-between; align-items: center; }
.label-area h3 { margin: 0 0 5px 0; color: #48bb78; font-size: 20px; }
.label-area p { margin: 0; color: #a0aec0; font-size: 14px; }
.input-area { display: flex; align-items: center; gap: 10px; }
.time-input { width: 80px; padding: 10px; border-radius: 8px; border: 2px solid #4a5568; background: #1a202c; color: white; font-size: 20px; text-align: center; outline: none; transition: 0.2s; }
.time-input:focus { border-color: #48bb78; }
.unit { color: #a0aec0; font-size: 16px; }

/* 反馈卡片 */
.feedback-card { background: linear-gradient(145deg, #2d3748, #232b38); padding: 30px; border-radius: 15px; width: 90%; max-width: 500px; border: 1px solid rgba(252, 129, 129, 0.3); margin-bottom: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); flex-shrink: 0; }
.feedback-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.feedback-header .icon { font-size: 24px; }
.feedback-header h3 { margin: 0; color: #fc8181; font-size: 20px; }

.philosophy-box { background: rgba(0,0,0,0.2); border-left: 4px solid #fc8181; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 15px; }
.philosophy-box p { margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.6; font-style: italic; }

.promise { color: #a0aec0; font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
.promise strong { color: #fbd38d; }

/* 联系按钮区 */
.contact-actions { display: flex; flex-direction: column; gap: 15px; }
.contact-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; border: none; text-decoration: none; }
.contact-btn:active { transform: scale(0.98); }

.email-btn { background: #4a5568; color: white; border: 1px solid rgba(255,255,255,0.1); }
.email-btn:hover { background: #2d3748; }

.wechat-btn { background: #48bb78; color: white; box-shadow: 0 4px 15px rgba(72,187,120,0.3); }
.wechat-btn:hover { background: #38a169; box-shadow: 0 6px 20px rgba(72,187,120,0.4); }

.back-btn { background: transparent; color: #a0aec0; border: 2px solid #4a5568; padding: 12px 40px; font-size: 18px; border-radius: 50px; cursor: pointer; transition: 0.2s; flex-shrink: 0; }
.back-btn:hover { background: #4a5568; color: white; }
</style>