<script setup lang="ts">
import { ref } from "vue"

const emit = defineEmits(["submit"])

function getTodayPlusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0] as string
}

const name = ref("")
const today = new Date().toISOString().split("T")[0]
const date = ref(getTodayPlusDays(7))

function submit() {
  if (!name.value || !date.value) return

  emit("submit", {
    name: name.value,
    date: date.value
  })

  name.value = ""
  date.value = getTodayPlusDays(7)
}
</script>

<template>
  <form @submit.prevent="submit">
    <h2>Créer un tournoi</h2>

    <div class="form-group">
      <label>Nom du tournoi</label>
      <input
        v-model="name"
        type="text"
        placeholder="Nom du tournoi"
      />
    </div>

    <div class="form-group">
      <label>Date du tournoi</label>
      <input
        v-model="date"
        type="date"
        :min="today"
      />
    </div>

    <button type="submit">
      Créer
    </button>
  </form>
</template>