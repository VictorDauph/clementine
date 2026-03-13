process.env.DATABASE_URL = "postgres://user:password@localhost:5432/testdb";

import { createTournament } from "../controllers/Tournament.Controller";
import Tournament from "../models/Tournament.model";
import { Request, Response } from "express";

jest.mock("../../src/models/Tournament.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        belongsToMany: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    },
}));

jest.mock("../../src/models/Team.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        belongsToMany: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    },
}));

jest.mock("../../src/models/Match.model", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        belongsToMany: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    },
}));


describe("createTournament", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it("should create a tournament and return 201", async () => {
        const createdTournament = {
            id: 1,
            name: "Tournoi d'été",
            date: new Date("2026-03-20"),
        };

        req.body = {
            name: "Tournoi d'été",
            date: "2026-03-20",
        };

        (Tournament.create as jest.Mock).mockResolvedValue(createdTournament);

        await createTournament(req as Request, res as Response);

        expect(Tournament.create).toHaveBeenCalledWith({
            name: "Tournoi d'été",
            date: new Date("2026-03-20"),
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Tournoi créé avec succès",
            tournament: createdTournament,
        });
    });

    it("should return 400 if validation fails", async () => {
        req.body = {
            name: "",
            date: "not-a-date",
        };

        await createTournament(req as Request, res as Response);

        expect(Tournament.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Données invalides",
                details: expect.any(Array),
            })
        );
    });

    it("should return 500 if Tournament.create throws", async () => {
        req.body = {
            name: "Tournoi d'hiver",
            date: "2026-12-01",
        };

        (Tournament.create as jest.Mock).mockRejectedValue(
            new Error("Database failure")
        );

        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });

        await createTournament(req as Request, res as Response);

        expect(Tournament.create).toHaveBeenCalledWith({
            name: "Tournoi d'hiver",
            date: new Date("2026-12-01"),
        });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Erreur interne du serveur",
            error: "Database failure",
        });

        consoleErrorSpy.mockRestore();
    });
});