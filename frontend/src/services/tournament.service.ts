import type { CreateTournamentPayload, CreateTournamentResponse, Tournament } from "@/models/Tournament";
import api from "./api.service";

export async function getTournaments(): Promise<Tournament[]> {
    const response = await api.get<Tournament[]>("/tournaments");
    return response.data;
}

export async function getTournamentById(id: number): Promise<Tournament> {
    const response = await api.get<Tournament>(`/tournaments/${id}`);
    return response.data;
}

export async function createTournamentService(
    payload: CreateTournamentPayload
): Promise<CreateTournamentResponse> {
    const response = await api.post<CreateTournamentResponse>("/tournaments", payload);
    return response.data;
}