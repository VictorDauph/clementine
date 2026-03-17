import type { Match } from "./Match";
import type { Team } from "./Team";

export interface Tournament {
    id: number;
    name: string;
    date: string;
    teams: Team[];
    matches: Match[];
}

export interface CreateTournamentPayload {
    name: string;
    date: string;
}

export interface CreateTournamentResponse {
    message: string;
    tournament: Tournament;
}