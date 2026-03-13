import Joi from "joi";

export interface TeamRegistrationDto {
    tournamentId: number;
    teamId: number;
}

export const teamRegistrationSchema = Joi.object({
    tournamentId: Joi.number().integer().positive().required(),
    teamId: Joi.number().integer().positive().required(),
});