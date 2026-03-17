<script setup lang="ts">    
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router";
import type { Tournament } from "@/models/Tournament";
import {addTeamToTournament, generateMatchesService, getTournamentById} from "@/services/tournament.service";
import Modal from "@/components/Modal.vue";
import TeamForm from "@/components/TeamForm.vue";
import type { TeamRegistrationPayload } from "@/models/Team";

const tournament = ref<Tournament | null>(null)
const route = useRoute()
const tournamentId = route.params.id as string
const modalOpen = ref(false)
const errorMessage = ref("")

onMounted(() => {
    if (tournamentId) {
        getTournamentById(+tournamentId).then((t) => {
            tournament.value = t;
            console.log("Tournoi chargé:", t);
        }).catch((error) => {
            console.error("Erreur lors du chargement du tournoi:", error);
        });
    }
})

function openModal() {
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

function submitTeam(data: { name: string }) {
  console.log("Ajouter équipe:", data)
  const teamPayload: TeamRegistrationPayload = {
    tournamentId: +tournamentId,
    teamName: data.name
  }
  addTeamToTournament(teamPayload)
    .then(() => {
      // Recharger les données du tournoi pour afficher la nouvelle équipe
      return getTournamentById(+tournamentId);
    })
    .then((updatedTournament) => {
      tournament.value = updatedTournament;
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de l'équipe:", error);
      errorMessage.value = "Impossible d'ajouter l'équipe.";
    });
  closeModal()
}

function generateMatches() {
  console.log("Générer les matchs pour le tournoi", tournament.value?.id)
  generateMatchesService(+tournamentId)
    .then(() => {
      // Recharger les données du tournoi pour afficher les matchs générés
      return getTournamentById(+tournamentId);
    })
    .then((updatedTournament) => {
      tournament.value = updatedTournament;
    })
    .catch((error) => {
      console.error("Erreur lors de la génération des matchs:", error);
      errorMessage.value = "Impossible de générer les matchs.";
    });

}


</script>


<template>
  <div v-if="tournament != null" class="page">

    <header class="page-header">
      <h1>{{ tournament.name || "Tournoi" }}</h1>
      <p class="subtitle">
        {{ new Date(tournament.date).toLocaleDateString('fr-FR') || "Date à définir" }}
      </p>
    </header>

    <main class="container">

      <!-- Section équipes -->

      <section class="section">
        <div class="section-header">
          <h2>Équipes</h2>
          <button class="primary-button" @click="openModal">
            Ajouter une équipe
          </button>
        </div>

        <div v-if="tournament.teams?.length === 0" class="empty">
          Aucune équipe enregistrée
        </div>

        <ul class="team-list">
          <li v-for="team in tournament.teams" :key="team.id">
            {{ team.name }}
          </li>
        </ul>
      </section>

      <!-- Génération des matchs -->

      <section class="section">
        <div class="section-header">
          <h2>Matchs</h2>

          <button
            class="primary-button"
            @click="generateMatches"
          >
            Générer les matchs
          </button>
        </div>

        <div v-if="tournament.matches?.length === 0" class="empty">
          Aucun match généré
        </div>

        <div class="match-list">
          <div
            v-for="match in tournament.matches"
            :key="match.id"
            class="match-card"
          >
            <span>{{ tournament.teams.find((t) => t.id === match.teamAId)?.name }}</span> 
            <span v-if="match.scoreA === -1 && match.scoreB === -1">
              {{ match.scoreA }}
            </span>
            <strong>vs</strong>
            <span v-if="match.scoreA === -1 && match.scoreB === -1">
              {{ match.scoreB }}
            </span>
            <span>{{ tournament.teams.find((t) => t.id === match.teamBId)?.name }}</span>
          </div>
        </div>
      </section>

      <!-- Classement -->

      <section class="section">
        <h2>Classement</h2>

        <div class="empty">
          Classement disponible après les matchs
        </div>
      </section>

      <Modal :isOpen="modalOpen" @close="closeModal">
        <TeamForm @submit="submitTeam" />
      </Modal>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

    </main>
  </div>
</template>

<style scoped>

.page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}

.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.primary-button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.primary-button:hover {
  background: #1d4ed8;
}

.empty {
  padding: 1rem;
  text-align: center;
  color: #64748b;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list li {
  padding: 0.6rem;
  border-bottom: 1px solid #e2e8f0;
}

.match-list {
  display: grid;
  gap: 0.75rem;
}

.match-card {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.8rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

</style>