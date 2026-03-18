import type { Tournament } from "@/models/Tournament";
import api from "./api.service";
import type { TeamRegistrationPayload } from "@/models/Team";
import type { CreateTournamentPayload } from "@/dto/CreateTournamentPayload.dto";
import type { CreateTournamentResponse } from "@/dto/CreateTrounamentResponse.dto";
import type { TournamentRankingResponseDto } from "@/dto/TournamentRankingResponse.dto";

export async function getTournaments(): Promise<Tournament[]> {
    const response = await api.get<Tournament[]>("/tournaments");
    return response.data;
}

export async function getTournamentById(id: number): Promise<Tournament> {
    const response = await api.get<Tournament>(`/tournaments/by-id/${id}`);
    return response.data;
}

export async function createTournamentService(
    payload: CreateTournamentPayload
): Promise<CreateTournamentResponse> {
    const response = await api.post<CreateTournamentResponse>("/tournaments", payload);
    return response.data;
}

export async function addTeamToTournament(payload: TeamRegistrationPayload): Promise<void> {
    const response = await api.post(`/tournaments/register-team`, {
        tournamentId: payload.tournamentId,
        teamName: payload.teamName
    });
    return response.data;
}

export async function generateMatchesService(tournamentId: number): Promise<void> {
    const response = await api.post(`/tournaments/generate-matches`, {
        tournamentId
    });
    return response.data;
}

export async function getTournamentRanking(tournamentId: number): Promise<TournamentRankingResponseDto> {
    const response = await api.get(`/tournaments/ranking/${tournamentId}`);
    return response.data;
}