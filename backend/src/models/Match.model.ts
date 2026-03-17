import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Tournament from "./Tournament.model";
import Team from "./Team.model";

interface MatchAttributes {
    id?: number;
    tournamentId: number;
    teamAId: number;
    teamBId: number;
    scoreA?: number;
    scoreB?: number;
    playedAt?: Date;
}

class Match extends Model<MatchAttributes> implements MatchAttributes {
    public id!: number;
    public tournamentId!: number;
    public teamAId!: number;
    public teamBId!: number;
    public scoreA!: number;
    public scoreB!: number;
    public playedAt!: Date;
}

Match.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tournamentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tournament,
                key: "id",
            },
        },
        teamAId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Team,
                key: "id",
            },
        },
        teamBId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Team,
                key: "id",
            },
        },
        scoreA: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        scoreB: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        playedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "matches",
        timestamps: false,
    }
);

// Associations
Match.belongsTo(Tournament, { foreignKey: "tournamentId" });
Tournament.hasMany(Match, { foreignKey: "tournamentId", as: "matches" });

Match.belongsTo(Team, { as: "teamA", foreignKey: "teamAId" });
Match.belongsTo(Team, { as: "teamB", foreignKey: "teamBId" });

Team.hasMany(Match, { as: "matchesAsA", foreignKey: "teamAId" });
Team.hasMany(Match, { as: "matchesAsB", foreignKey: "teamBId" });


export default Match;
