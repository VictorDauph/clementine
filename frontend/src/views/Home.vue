<script setup lang="ts">
import type { Tournament } from "@/models/Tournament";
import { getTournaments } from "@/services/tournament.service";
import { onMounted, ref } from "vue"
import Modal from "@/components/Modal.vue";
import TournamentForm from "@/components/TournamentForm.vue";
import { createTournamentService } from "@/services/tournament.service";
import type { CreateTournamentPayload } from "@/models/Tournament";
import TournamentCard from "@/components/TournamentCard.vue";

const tournaments = ref<Tournament[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const modalOpen = ref(false)
const shrink = ref(false)

function openModal() {
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

function createTournament(data: { name: string; date: string }) {
  console.log("Créer tournoi:", data)
  const payload: CreateTournamentPayload  = {
    name: data.name,
    date: data.date
  }
  createTournamentService(payload)
    .then(() => {
      loadTournaments();
    })
    .catch((error) => {
      console.error("Erreur lors de la création du tournoi:", error);
    });

  closeModal()
}

async function loadTournaments(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    tournaments.value = await getTournaments();
  } catch (error) {
    errorMessage.value = "Impossible de charger les tournois.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }

}
  onMounted(() => {
    loadTournaments();
    setTimeout(() => {
      shrink.value = true
    }, 50)
    
  });

</script>

<template>
  <div class="page">
    <header class="page-header">
      <h1>Clementine Tournament Manager</h1>
      <p class="subtitle">Organisez et gérez vos tournois simplement</p>
    </header>

    <main class="container">

      <div class="actions">
        <button class="primary-button" @click="openModal">
          Créer un tournoi
        </button>
      </div>

      <section class="tournament-list">
        <TournamentCard
          v-for="tournament in tournaments"
          :key="tournament.id"
          :tournament="tournament"
        />
      </section>

      <Modal :isOpen="modalOpen" @close="closeModal">
        <TournamentForm @submit="createTournament" />
      </Modal>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

    </main>
  </div>
  <img :class="['splash-image', { 'splash-image-shrink': shrink }]" src="/ballon.png" />
</template>

<style scoped>

.page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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

.container {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;

  background: #2563eb;
  color: white;

  border: none;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.primary-button:active {
  transform: translateY(0);
}

.tournament-list {
  display: grid;
  gap: 1rem;
  justify-items: center;
}

.error {
  margin-top: 1rem;
  text-align: center;
  color: #dc2626;
  font-weight: 500;
}


</style>