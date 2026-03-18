<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

function goHome() {
  router.push({ name: 'home' });
}

</script>
<template>
    <header class="page-header">
      <h1> <a @click="goHome">🍊</a> Clementine Tournament Manager</h1>
      <p class="subtitle">Organisez et gérez vos tournois simplement</p>
    </header>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.page-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin: 0;
  color: #0f172a;
}

.subtitle {
  margin-top: 0.5rem;
  color: #64748b;
}
</style>