import express from "express";
import dotenv from "dotenv"
import TournamentRoutes from "./routes/TournamentRoutes";
import MatchRoutes from "./routes/MatchRoutes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { testConnection } from "./config/database";
import { syncDatabase } from "./models/syncModels";
import cors from 'cors';

//Création serveur express
const app = express()

//chargement des variables d'environnement
dotenv.config()

//Définition du port du serveur
const PORT = process.env.PORT

// Activer CORS uniquement pour une seule origine
//curl ifconfig.me pour connaître l'ip publique de votre pc
const corsOptions = {
    origin: process.env.CLIENT_URL, // Placer le domaine du client pour l'autoriser
    methods: 'GET,POST,DELETE,PUT', // Restreindre les méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Définir les en-têtes acceptés
    credentials: true, // Autoriser les cookies et les headers sécurisés (dont celui qui contient le jwt)
};

app.use(cors(corsOptions));


// Middleware de rate limiting
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ⏳ temps en millisecondes
    max: 100, // 🔒 Limite à 100 requêtes par IP
    message: "⛔ Trop de requêtes. Réessayez plus tard."
});

// Appliquer le rate limiter sur toutes les routes
app.use(apiLimiter);

// Activer helmet pour sécuriser les en-têtes HTTP
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'nonce-random123'"],
                styleSrc: ["'self'"], // Supprimer 'strict-dynamic'
                imgSrc: ["'self'"], // Supprimer 'data:'
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'none'"],
                scriptSrcAttr: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);


//COnfig du serveur par défaut
app.use(express.json());


// Connecter à Sequelize
testConnection().then(() => syncDatabase());


//routeurs
app.use('/tournaments', TournamentRoutes)
app.use('/matches', MatchRoutes)


//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.API_URL}:${PORT}`);
});

