<script setup lang="ts">    
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router";
import type { Tournament } from "@/models/Tournament";
import {addTeamToTournament, generateMatchesService, getTournamentById, getTournamentRanking} from "@/services/tournament.service";
import Modal from "@/components/Modal.vue";
import TeamForm from "@/components/TeamForm.vue";
import type { TeamRegistrationPayload } from "@/models/Team";
import type { Match } from "@/models/Match";
import { updateMatchScoreService } from "@/services/match.service";
import ScoreForm from "@/components/ScoreForm.vue";
import type { TournamentRankingResponseDto } from "@/dto/TournamentRankingResponse.dto";


const tournament = ref<Tournament | null>(null)
const route = useRoute()
const tournamentId = route.params.id as string
const modalOpen = ref(false)
const errorMessage = ref("")
const ranking = ref<TournamentRankingResponseDto | null>(null)

// modal score match
const scoreModalOpen = ref(false)
const selectedMatch = ref<Match | null>(null)

onMounted(() => {
  loadTournament();
})

function openTeamModal() {
  modalOpen.value = true
}

function closeTeamModal() {
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
      loadTournament();
    });
  closeTeamModal()
}

function loadTournament() {
  getTournamentById(+tournamentId)
    .then((t) => {
      tournament.value = t;
      console.log("Tournoi rechargé:", t);
    }).then(async () => {
      if (tournament.value?.generated) {
        ranking.value = await fetchRanking();
      }
    })
    .catch((error) => {
      console.error("Erreur lors du rechargement du tournoi:", error);
    });
}

function generateMatches() {
  console.log("Générer les matchs pour le tournoi", tournament.value?.id)
  generateMatchesService(+tournamentId)
    .then(() => {
      loadTournament();
    });

}

function isMatchPlayed(match: Match): boolean {
  return match.scoreA !== undefined
    && match.scoreB !== undefined
    && match.scoreA !== null
    && match.scoreB !== null
    && match.scoreA >= 0
    && match.scoreB >= 0
}

function openScoreModal(match: Match) {
  selectedMatch.value = match
  scoreModalOpen.value = true
}

function closeScoreModal() {
  scoreModalOpen.value = false
  selectedMatch.value = null
}

function submitScoreFromForm(payload: { scoreA: number; scoreB: number }) {
  selectedMatch.value!.scoreA = payload.scoreA
  selectedMatch.value!.scoreB= payload.scoreB
  console.log("Soumettre score pour le match", selectedMatch.value)

  updateMatchScoreService(selectedMatch.value!)
    .then(() => loadTournament())
    .catch((error) => {
      console.error("Erreur lors de la mise à jour du score:", error)
      errorMessage.value = "Impossible d'enregistrer le score."
    })
  closeScoreModal()
}

function fetchRanking() {
  getTournamentRanking(+tournamentId)
    .then((rankingRes) => {
      console.log("Classement du tournoi:", ranking);
      ranking.value = rankingRes;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du classement:", error);
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
          <button v-if="!tournament.generated" class="primary-button" @click="openTeamModal">
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
            v-if="tournament.teams.length >= 2 && !tournament.generated"
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
            <span v-if="isMatchPlayed(match)">
             | {{ match.scoreA }} |
            </span>
            <strong>vs</strong>
            <span v-if="isMatchPlayed(match)">
             | {{ match.scoreB }} |
            </span>
            <span>{{ tournament.teams.find((t) => t.id === match.teamBId)?.name }}</span>
              <template v-if="!isMatchPlayed(match)">
                <button class="secondary-button" @click="openScoreModal(match)">
                  Saisir le score
                </button>
              </template>
          </div>
        </div>
      </section>

      <!-- Classement -->

      <section v-if="tournament.generated" class="section">
<h2>Classement</h2>

  <div v-if="!ranking || ranking.ranking.length === 0" class="empty">
    Classement disponible après les matchs
  </div>

  <div v-else class="ranking-table-wrapper">
    <table class="ranking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Équipe</th>
          <th>Pts</th>
          <th>V</th>
          <th>N</th>
          <th>D</th>
          <th>BP</th>
          <th>BC</th>
          <th>Diff</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in ranking.ranking"
          :key="team.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ team.name }}</td>
          <td><strong>{{ team.points }}</strong></td>
          <td>{{ team.wins }}</td>
          <td>{{ team.draws }}</td>
          <td>{{ team.losses }}</td>
          <td>{{ team.goalsFor }}</td>
          <td>{{ team.goalsAgainst }}</td>
          <td>
            <span :class="team.goalDifference >= 0 ? 'positive-diff' : 'negative-diff'">
              {{ team.goalDifference > 0 ? "+" : "" }}{{ team.goalDifference }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
      </section>

      <Modal :isOpen="modalOpen" @close="closeTeamModal">
        <TeamForm @submit="submitTeam" />
      </Modal>

      <Modal :isOpen="scoreModalOpen" @close="closeScoreModal">
      <ScoreForm
        v-if="selectedMatch && tournament"
        :teamAName="tournament.teams.find(t => t.id === selectedMatch!.teamAId)?.name || ''"
        :teamBName="tournament.teams.find(t => t.id === selectedMatch!.teamBId)?.name || ''"
        :initialScoreA="selectedMatch.scoreA"
        :initialScoreB="selectedMatch.scoreB"
        @submit="submitScoreFromForm"
      />
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
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.secondary-button {
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
.secondary-button:hover {
  background: #041526;
}

.ranking-table-wrapper {
  overflow-x: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th,
.ranking-table td {
  padding: 0.9rem 0.75rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.ranking-table th:nth-child(2),
.ranking-table td:nth-child(2) {
  text-align: left;
}

.ranking-table thead {
  background: #f1f5f9;
}

.ranking-table tbody tr:hover {
  background: #f8fafc;
}

.positive-diff {
  color: #16a34a;
  font-weight: 600;
}

.negative-diff {
  color: #dc2626;
  font-weight: 600;
}
</style>