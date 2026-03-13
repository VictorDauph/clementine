import Joi from "joi";

export interface MatchResultDto {
    scoreA: number;
    scoreB: number;
}

export const matchResultSchema = Joi.object({
    scoreA: Joi.number().integer().min(0).required(),
    scoreB: Joi.number().integer().min(0).required(),
});