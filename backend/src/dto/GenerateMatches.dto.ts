import Joi from "joi";

export interface GenerateMatchesDto {
    tournamentId: number;
}

export const generateMatchesSchema = Joi.object({
    tournamentId: Joi.number().integer().positive().required(),
});