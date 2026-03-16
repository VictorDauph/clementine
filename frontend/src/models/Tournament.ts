export interface Tournament {
    id: number;
    name: string;
    date: string;
}

export interface CreateTournamentPayload {
    name: string;
    date: string;
}

export interface CreateTournamentResponse {
    message: string;
    tournament: Tournament;
}