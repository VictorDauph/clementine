<script setup lang="ts">
import { ref } from "vue"

const name = ref("Victor")
const apiUrl = import.meta.env.VITE_API_URL;

function changeName() {
  name.value = "Champion"
}
</script>

<template>
  <div class="card">
    <h1>{{ name }}</h1>
    <p>API URL: {{ apiUrl }}</p>
    <button @click="changeName">
      Changer
    </button>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ddd;
}

button {
  margin-top: 10px;
}
</style>