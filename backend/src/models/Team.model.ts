import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Tournament from "./Tournament.model";

interface TeamAttributes {
    id?: number;
    name: string;
    createdAt?: Date;
}

class Team extends Model<TeamAttributes> implements TeamAttributes {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
}

Team.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "teams",
        timestamps: true,
        updatedAt: false,
    }
);

Tournament.belongsToMany(Team, {
    through: "tournament_teams",
    foreignKey: "tournamentId",
    otherKey: "teamId",
    as: "teams",
});

Team.belongsToMany(Tournament, {
    through: "tournament_teams",
    foreignKey: "teamId",
    otherKey: "tournamentId",
    as: "tournaments",
});

export default Team;
