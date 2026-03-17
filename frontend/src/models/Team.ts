export interface Team {
    id?: number;
    name: string;
    createdAt?: Date;
}

export interface TeamRegistrationPayload {
    tournamentId: number;
    teamName: string;
}