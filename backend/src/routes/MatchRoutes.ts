import express from "express";
import { recordMatchResult } from "../controllers/Match.Controller";

const router = express.Router();

// Route pour enregistrer le résultat d'un match
router.put("/:matchId/result", recordMatchResult);

export default router;