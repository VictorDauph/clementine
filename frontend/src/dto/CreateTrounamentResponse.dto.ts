import type { Tournament } from "@/models/Tournament";

export interface CreateTournamentResponse {
    message: string;
    tournament: Tournament;
}