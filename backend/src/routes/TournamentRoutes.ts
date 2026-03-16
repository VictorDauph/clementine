import express from "express";
import { createTournament, registerTeamToTournament, getAllTournaments, getTournamentById } from "../controllers/Tournament.Controller";

const router = express.Router();

// Route pour récupérer un tournoi par son ID
router.get("/:id", getTournamentById);

// Route pour récupérer tous les tournois
router.get("/", getAllTournaments);

// Route pour créer un tournoi
router.post("/", createTournament);

// Route pour inscrire une équipe à un tournoi
router.post("/register-team", registerTeamToTournament);

/*
// Route pour générer les matchs d'un tournoi
router.post("/generate-matches", generateMatches);

// Route pour obtenir le classement d'un tournoi
router.get("/:tournamentId/ranking", getTournamentRanking);
*/

export default router;