<script setup lang="ts">    
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router";
import type { Tournament } from "@/models/Tournament";
import {getTournamentById} from "@/services/tournament.service";

let tournament:Tournament = ref(null) as unknown as Tournament;

const route = useRoute()
const tournamentId = route.params.id as string

onMounted(() => {
    if (tournamentId) {
        getTournamentById(+tournamentId).then((t) => {
            tournament = t;
        }).catch((error) => {
            console.error("Erreur lors du chargement du tournoi:", error);
        });
    }
})
</script>

<template>

</template>

<style>

</style>