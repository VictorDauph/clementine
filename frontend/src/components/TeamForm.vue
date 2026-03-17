<script setup lang="ts">
import { ref } from "vue"

const emit = defineEmits<{
  (e: "submit", payload: { name: string }): void
}>()

const name = ref("")

function submit() {
  if (!name.value.trim()) return

  emit("submit", {
    name: name.value
  })

  name.value = ""
}
</script>

<template>
  <form @submit.prevent="submit">
    <h2>Ajouter une équipe</h2>

    <div class="form-group">
      <label>Nom de l'équipe</label>
      <input
        v-model="name"
        type="text"
        placeholder="Ex: Les Dragons"
      />
    </div>

    <button type="submit">
      Ajouter
    </button>
  </form>
</template>