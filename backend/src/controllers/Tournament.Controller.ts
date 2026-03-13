import { Request, Response } from "express";
import Tournament from "../models/Tournament.model";
import { TournamentCreationDto, tournamentCreationSchema } from "../dto/TournamentCreation.dto";
import { TeamRegistrationDto, teamRegistrationSchema } from "../dto/TeamRegistration.dto";
import Team from "../models/Team.model";
import TournamentTeams from "../models/TournamentTeams.model";
import { GenerateMatchesDto, generateMatchesSchema } from "../dto/GenerateMatches.dto";
import Match from "../models/Match.model";
import { TournamentRankingDto, tournamentRankingSchema } from "../dto/TournamentRanking.dto";


export async function createTournament(req: Request, res: Response) {
    try {
        // Validation avec JOI
        const { error, value } = tournamentCreationSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: "Données invalides",
                details: error.details.map(detail => detail.message)
            });
            return;
        }

        const { name, date }: TournamentCreationDto = value;

        // Créer le tournoi
        const newTournament = await Tournament.create({
            name,
            date: new Date(date), // Assurer que c'est une Date
        });

        res.status(201).json({
            message: "Tournoi créé avec succès",
            tournament: newTournament,
        });
    } catch (err: any) {
        console.error("Erreur lors de la création du tournoi :", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}

export async function registerTeamToTournament(req: Request, res: Response) {
    try {
        // Validation du body avec JOI
        const { error, value } = teamRegistrationSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: "Données invalides",
                details: error.details.map(detail => detail.message)
            });
            return;
        }

        const { tournamentId, teamId }: TeamRegistrationDto = value;

        // Vérifier que le tournoi existe
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) {
            res.status(404).json({ message: "Tournoi non trouvé" });
            return;
        }

        // Vérifier que les matchs n'ont pas déjà été générés
        if (tournament.generated) {
            res.status(409).json({ message: "Impossible d'inscrire une équipe : les matchs ont déjà été générés pour ce tournoi" });
            return;
        }

        // Vérifier que l'équipe existe
        const team = await Team.findByPk(teamId);
        if (!team) {
            res.status(404).json({ message: "Équipe non trouvée" });
            return;
        }

        // Vérifier que l'équipe n'est pas déjà inscrite
        const existing = await TournamentTeams.findOne({
            where: { tournamentId, teamId },
        });
        if (existing) {
            res.status(409).json({ message: "Équipe déjà inscrite à ce tournoi" });
            return;
        }

        // Inscrire l'équipe au tournoi via la table de jointure
        await TournamentTeams.create({
            tournamentId,
            teamId,
        });

        res.status(200).json({
            message: "Équipe inscrite au tournoi avec succès",
            tournamentId,
            teamId,
        });
    } catch (err: any) {
        console.error("Erreur lors de l'inscription de l'équipe :", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}

export async function generateMatches(req: Request, res: Response) {
    try {
        // Validation du body avec JOI
        const { error, value } = generateMatchesSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: "Données invalides",
                details: error.details.map(detail => detail.message)
            });
            return;
        }

        const { tournamentId }: GenerateMatchesDto = value;

        // Vérifier que le tournoi existe
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) {
            res.status(404).json({ message: "Tournoi non trouvé" });
            return;
        }

        // Vérifier que les matchs n'ont pas déjà été générés
        if (tournament.generated) {
            res.status(409).json({ message: "Les matchs ont déjà été générés pour ce tournoi" });
            return;
        }

        // Récupérer les équipes inscrites au tournoi
        const tournamentTeams = await TournamentTeams.findAll({
            where: { tournamentId },
            include: [Team],
        });

        const teams = tournamentTeams.map(tt => tt.teamId);

        if (teams.length < 2) {
            res.status(400).json({ message: "Au moins 2 équipes sont nécessaires pour générer des matchs" });
            return;
        }

        // Générer les paires (round-robin)
        const matches = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matches.push({
                    tournamentId,
                    teamAId: teams[i],
                    teamBId: teams[j],
                    scoreA: 0,
                    scoreB: 0,
                });
            }
        }

        // Insérer les matchs en base
        await Match.bulkCreate(matches);

        // Marquer le tournoi comme ayant ses matchs générés
        tournament.generated = true;
        await tournament.save();

        res.status(201).json({
            message: `${matches.length} matchs générés pour le tournoi`,
            tournamentId,
            matchesCount: matches.length,
        });
    } catch (err: any) {
        console.error("Erreur lors de la génération des matchs :", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}

export async function getTournamentRanking(req: Request, res: Response) {
    try {
        const { tournamentId } = req.params;

        // Validation du param avec JOI (bien que GET, on peut valider)
        const { error } = tournamentRankingSchema.validate({ tournamentId: parseInt(tournamentId) });
        if (error) {
            res.status(400).json({
                message: "ID de tournoi invalide",
                details: error.details.map(detail => detail.message)
            });
            return;
        }

        // Vérifier que le tournoi existe
        const tournament = await Tournament.findByPk(tournamentId);
        if (!tournament) {
            res.status(404).json({ message: "Tournoi non trouvé" });
            return;
        }

        // Récupérer les équipes inscrites
        const tournamentTeams = await TournamentTeams.findAll({
            where: { tournamentId: parseInt(tournamentId) },
            include: [Team],
        });

        // Récupérer les matchs joués
        const matches = await Match.findAll({
            where: { tournamentId: parseInt(tournamentId), playedAt: { [require('sequelize').Op.ne]: null } },
        });

        // Calculer les stats pour chaque équipe
        const teamStats: { [key: number]: { team: Team, wins: number, draws: number, losses: number, points: number, goalsFor: number, goalsAgainst: number } } = {};

        tournamentTeams.forEach(tt => {
            teamStats[tt.teamId] = {
                team: (tt as any).Team,
                wins: 0,
                draws: 0,
                losses: 0,
                points: 0,
                goalsFor: 0,
                goalsAgainst: 0,
            };
        });

        matches.forEach(match => {
            const teamA = teamStats[match.teamAId];
            const teamB = teamStats[match.teamBId];

            if (teamA && teamB) {
                teamA.goalsFor += match.scoreA;
                teamA.goalsAgainst += match.scoreB;
                teamB.goalsFor += match.scoreB;
                teamB.goalsAgainst += match.scoreA;

                if (match.scoreA > match.scoreB) {
                    teamA.wins++;
                    teamA.points += 3;
                    teamB.losses++;
                } else if (match.scoreA < match.scoreB) {
                    teamB.wins++;
                    teamB.points += 3;
                    teamA.losses++;
                } else {
                    teamA.draws++;
                    teamB.draws++;
                    teamA.points += 1;
                    teamB.points += 1;
                }
            }
        });

        // Trier par points décroissants, puis différence de buts
        const ranking = Object.values(teamStats)
            .map(stat => ({
                id: stat.team.id,
                name: stat.team.name,
                wins: stat.wins,
                draws: stat.draws,
                losses: stat.losses,
                points: stat.points,
                goalsFor: stat.goalsFor,
                goalsAgainst: stat.goalsAgainst,
                goalDifference: stat.goalsFor - stat.goalsAgainst,
            }))
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return b.goalDifference - a.goalDifference;
            });

        res.status(200).json({
            tournamentId,
            ranking,
        });
    } catch (err: any) {
        console.error("Erreur lors de la récupération du classement :", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}

