import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Get all valults
app.get("/vaults/", async (req, res) => {
  const vaults = await prisma.vault.findMany({
    select: {
      id: true,
      shelves: true,
    },
  });

  res.json(vaults);
});

// Get a vault
app.get("/vaults/:vaultId", async (req, res) => {
  const vault = await prisma.vault.findUnique({
    select: {
      shelves: true,
    },
    where: {
      id: parseInt(req.params.vaultId),
    },
  });

  res.json(vault);
});

// Create new vault
app.post("/", async (req, res) => {});

app.listen(3132);
