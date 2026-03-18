<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps<{
  teamAName: string
  teamBName: string
  initialScoreA?: number
  initialScoreB?: number
}>()

const emit = defineEmits<{
  (e: "submit", payload: { scoreA: number; scoreB: number }): void
}>()

const scoreA = ref<number | null>(null)
const scoreB = ref<number | null>(null)

// pré-remplissage si modification
watch(
  () => [props.initialScoreA, props.initialScoreB],
  ([a, b]) => {
    scoreA.value = a ?? 0
    scoreB.value = b ?? 0
  },
  { immediate: true }
)

function submit() {
  if (scoreA.value === null || scoreB.value === null) return

  emit("submit", {
    scoreA: scoreA.value,
    scoreB: scoreB.value
  })
}
</script>

<template>
  <form @submit.prevent="submit">
    <h2>Entrer le score</h2>

    <div class="form-group">
      <label>{{ teamAName }}</label>
      <input
        v-model.number="scoreA"
        type="number"
        min="0"
        required="true"
      />
    </div>

    <div class="form-group">
      <label>{{ teamBName }}</label>
      <input
        v-model.number="scoreB"
        type="number"
        min="0"
        required="true"
      />
    </div>

    <button type="submit">
      Enregistrer
    </button>
  </form>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

input {
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}
</style>