export interface Match {
    id?: number;
    tournamentId: number;
    teamAId: number;
    teamBId: number;
    scoreA?: number;
    scoreB?: number;
    playedAt?: Date;
}
