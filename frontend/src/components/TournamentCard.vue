<script setup lang="ts">
import { useRouter } from "vue-router"
import type { Tournament } from "@/models/Tournament";

const router = useRouter()

const props = defineProps<{
  tournament: Tournament
}>()

const emit = defineEmits<{
  select: [tournament: Tournament]
}>()

function handleClick(): void {
  emit("select", props.tournament)
  router.push({ name: "tournament", params: { id: props.tournament.id } })
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}
</script>

<template>
  <article
    class="tournament-card"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="card-content">
      <p class="card-label">Tournoi</p>
      <h2 class="card-title">{{ tournament.name }}</h2>
      <p class="card-date">{{ formatDate(tournament.date) }}</p>
    </div>

    <div class="card-arrow">
      <span>Voir</span>
    </div>
  </article>
</template>

<style scoped>
.tournament-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  width: 95%;
  padding: 1.25rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);

  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.tournament-card:hover,
.tournament-card:focus-visible {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  outline: none;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-label {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.card-date {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

.card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 40px;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .tournament-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-arrow {
    min-width: auto;
  }
}
</style>