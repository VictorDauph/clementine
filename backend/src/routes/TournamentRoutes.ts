import express from "express";
import { createTournament, registerTeamToTournament, generateMatches, getTournamentRanking } from "../controllers/Tournament.Controller";

const router = express.Router();

// Route pour créer un tournoi
router.post("/", createTournament);

// Route pour inscrire une équipe à un tournoi
router.post("/register-team", registerTeamToTournament);

// Route pour générer les matchs d'un tournoi
router.post("/generate-matches", generateMatches);

// Route pour obtenir le classement d'un tournoi
router.get("/:tournamentId/ranking", getTournamentRanking);

export default router;