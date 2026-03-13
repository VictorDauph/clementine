import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

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

    public readonly createdAt!: Date;
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
