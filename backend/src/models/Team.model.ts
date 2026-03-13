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


// Relation many-to-many (table de jointure créée automatiquement par Sequelize)
Tournament.belongsToMany(Team, {
    through: "TournamentTeams",
    foreignKey: "tournamentId",
    otherKey: "teamId",
});
Team.belongsToMany(Tournament, {
    through: "TournamentTeams",
    foreignKey: "teamId",
    otherKey: "tournamentId",
});

export default Team;
