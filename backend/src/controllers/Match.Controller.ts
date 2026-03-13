import { Request, Response } from "express";
import Match from "../models/Match.model";
import { MatchResultDto, matchResultSchema } from "../dto/MatchResult.dto";

export async function recordMatchResult(req: Request, res: Response) {
    try {
        const { matchId } = req.params;

        // Validation du body avec JOI
        const { error, value } = matchResultSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: "Données invalides",
                details: error.details.map(detail => detail.message)
            });
            return;
        }

        const { scoreA, scoreB }: MatchResultDto = value;

        // Vérifier que le match existe
        const match = await Match.findByPk(matchId);
        if (!match) {
            res.status(404).json({ message: "Match non trouvé" });
            return;
        }

        // Mettre à jour le résultat du match (considéré comme joué maintenant)
        match.scoreA = scoreA;
        match.scoreB = scoreB;
        match.playedAt = new Date();
        await match.save();

        res.status(200).json({
            message: "Résultat du match enregistré avec succès",
            match: {
                id: match.id,
                scoreA: match.scoreA,
                scoreB: match.scoreB,
                playedAt: match.playedAt,
            },
        });
    } catch (err: any) {
        console.error("Erreur lors de l'enregistrement du résultat :", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}