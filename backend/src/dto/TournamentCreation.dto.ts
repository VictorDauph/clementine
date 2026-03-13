import Joi from "joi";

export interface TournamentCreationDto {
    name: string;
    date: string; // Format ISO string, e.g., "2026-06-15"
}

export const tournamentCreationSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    date: Joi.date().iso().required(), // Valide une date ISO
});