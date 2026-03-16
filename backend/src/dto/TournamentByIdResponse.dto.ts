import Team from "../models/Team.model";

export interface TournamentByIdResponseDto {
    id: number;
    name: string;
    date: Date;
    teams: Team[];
}