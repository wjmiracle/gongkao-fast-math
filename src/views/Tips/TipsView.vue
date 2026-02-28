<template>
  <div class="tips-container">
    <header class="tips-header">
      <h2>📚 独家资料库</h2>
      <p class="subtitle">下载并打印讲义，配合速算训练效果翻倍</p>
    </header>

    <main class="tips-content">
      <section class="tip-card border-purple">
        <div class="card-title">
          <span class="icon">📥</span>
          <h3>全套硬核复习资料</h3>
        </div>
        <p class="desc">这里为你准备了全套的硬核复习资料，强烈建议全部下载打印，反复研读！</p>
        
        <div class="pdf-list">
          <a v-for="pdf in pdfList" :key="pdf.file" :href="pdf.file" target="_blank" class="download-btn">
            <span class="btn-icon">{{ pdf.icon }}</span> 
            <span class="btn-text">在线预览 / 下载 {{ pdf.name }}</span>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// PDF 下载列表数据（未来随时在这里增删改）
const pdfList = ref([
  { name: '完整版资料分析秘籍 (全解)', file: '/data-analysis-tips.pdf', icon: '📕' },
  { name: '重点题型与对照解题 (精华)', file: '/data-analysis-formulas.pdf', icon: '📘' },
  { name: '资料分析小技巧总结 (技巧)', file: '/data-analysis-exercises.pdf', icon: '📙' }
]);
</script>

<style scoped>
.tips-container { height: 100%; display: flex; flex-direction: column; background: #1a202c; color: white; }

.tips-header { padding: 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); background: #2d3748; }
.tips-header h2 { margin: 0; font-size: 24px; color: #e2e8f0; }
.subtitle { margin: 5px 0 0 0; font-size: 14px; color: #a0aec0; }

.tips-content { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px; }

/* 卡片基础样式 */
.tip-card { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border-top: 4px solid transparent; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.card-title .icon { font-size: 24px; }
.card-title h3 { margin: 0; font-size: 18px; color: #e2e8f0; }
.desc { color: #a0aec0; font-size: 14px; margin-bottom: 15px; }

/* PDF 卡片专属紫色主题 */
.border-purple { border-top-color: #b794f4; }

/* 多个 PDF 按钮的容器排版 */
.pdf-list { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  margin-top: 15px; 
}

/* 高颜值下载按钮 */
.download-btn { 
  display: flex; 
  align-items: center; 
  justify-content: flex-start; 
  gap: 12px; 
  background: linear-gradient(135deg, #b794f4, #805ad5); 
  color: white; 
  text-decoration: none; 
  padding: 15px 20px; 
  border-radius: 12px; 
  font-size: 16px; 
  font-weight: bold; 
  transition: 0.2s; 
  box-shadow: 0 4px 15px rgba(183, 148, 244, 0.3); 
}
.download-btn:active { transform: scale(0.98); }
.download-btn:hover { box-shadow: 0 6px 20px rgba(183, 148, 244, 0.5); transform: translateX(5px); }
.btn-icon { font-size: 22px; }
.btn-text { flex: 1; text-align: left; }
</style>