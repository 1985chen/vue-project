<template>
  <div>
    <div>
      <input v-model="userName" placeholder="请输入用户名" />
      <button @click="saveName">保存用户名</button>
    </div>
    <div>
      <button @click="fetchMessage">Fetch Message</button>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
    console.error('Fetch 失败:', error);
    message.value = '获取消息失败，请重试。';
  }
};
</script>
