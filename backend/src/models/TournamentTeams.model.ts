import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface TournamentTeamsAttributes {
    id?: number;
    tournamentId: number;
    teamId: number;
}

class TournamentTeams extends Model<TournamentTeamsAttributes> implements TournamentTeamsAttributes {
    public id!: number;
    public tournamentId!: number;
    public teamId!: number;
}

TournamentTeams.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tournamentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "tournament_teams",
        timestamps: false,
    }
);

export default TournamentTeams;