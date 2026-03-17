import Joi from "joi";

export interface TeamRegistrationDto {
    tournamentId: number;
    teamName: string;
}

export const teamRegistrationSchema = Joi.object({
    tournamentId: Joi.number().integer().positive().required(),
    teamName: Joi.string().min(1).max(255).required()
});