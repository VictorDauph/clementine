import type { Match } from "@/models/Match";
import api from "./api.service";


export async function updateMatchScoreService(match: Match) {
    const matchId = match.id
    const payload = { scoreA: match.scoreA, scoreB: match.scoreB }
    const response = await api.put(`/matches/${matchId}/result`, payload);
    return response.data;
}