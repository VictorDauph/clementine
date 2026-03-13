import Joi from "joi";

export interface TournamentRankingDto {
    tournamentId: number;
}

export const tournamentRankingSchema = Joi.object({
    tournamentId: Joi.number().integer().positive().required(),
});