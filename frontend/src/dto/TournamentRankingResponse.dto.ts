export interface TournamentRankingResponseDto {
    tournamentId: number,
    ranking: TeamRankingDto[]
}

export interface TeamRankingDto {
    id: number
    name: string
    wins: number
    draws: number
    losses: number
    points: number
    goalsFor: number
    goalsAgainst: number
    goalDifference: number
}