<template>
  <main class="min-vh-100 d-flex align-items-start justify-content-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 w-xxl">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="card-title text-center mb-4 fw-bold text-primary">用户信息中心</h1>

              <form @submit.prevent="saveName">
                <div class="input-group input-group-lg mb-4">
                  <input
                    v-model="userName"
                    class="form-control"
                    placeholder="请输入用户名"
                    required
                  />
                  <button
                    type="submit"
                    class="btn btn-primary"
                  >
                    <i class="bi bi-save me-2"></i>保存
                  </button>
                </div>

                <div class="d-flex flex-column align-items-center gap-2">
                  <button
                    type="button"
                    @click="fetchMessage"
                    class="btn btn-outline-primary"
                  >
                    <i class="bi bi-arrow-repeat me-2"></i>获取消息
                  </button>
                  <output
                    class="alert w-100 text-center"
                    :class="message ? 'alert-info' : 'alert-light'"
                  >
                    {{ message || '暂无消息' }}
                  </output>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const message = ref('');
const userName = ref('');

const saveName = async () => {
  try {
    const response = await fetch('/api/save-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName.value })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error('保存失败:', error);
    message.value = '保存失败，请重试。';
  }
};

const fetchMessage = async () => {
  try {
    const response = await fetch('/api/message');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error('获取失败:', error);
    message.value = '获取消息失败，请重试。';
  }
};
</script>

<style scoped>
.w-xxl {
  max-width: 1200px;
}
</style>
