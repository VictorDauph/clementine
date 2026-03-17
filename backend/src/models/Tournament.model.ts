import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Team from "./Team.model";
import Match from "./Match.model";

// Définition des attributs d'un tournoi
interface TournamentAttributes {
    id?: number;
    name: string;
    date: Date;
    generated?: boolean;
    createdAt?: Date;
}

class Tournament extends Model<TournamentAttributes> implements TournamentAttributes {
    public id!: number;
    public name!: string;
    public date!: Date;
    public generated!: boolean;
    public teams?: Team[];
    public matches?: Match[];
    public readonly createdAt!: Date;

    public addTeam!: (team: Team) => Promise<void>;
    public getTeams!: () => Promise<Team[]>;
}

Tournament.init(
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
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        generated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "tournaments",
        timestamps: true, // Ajoute createdAt
        updatedAt: false, // On ne conserve pas updatedAt ici
    }
);

export default Tournament;
