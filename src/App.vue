<template>
  <div>
    <button @click="fetchMessage">Fetch Message</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');

const fetchMessage = async () => {
  try {
    const response = await fetch('/api/message');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error('Fetch 失败:', error);
    message.value = '获取消息失败，请重试。';
  }
};
</script>
