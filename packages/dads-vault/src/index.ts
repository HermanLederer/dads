import { randomUUID } from "crypto";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// // Get all valults
// app.get("/vaults/", async (req, res) => {
//   const vaults = await prisma.vault.findMany({
//     select: {
//       id: true,
//       shelves: true,
//     },
//   });

//   res.json(vaults);
// });

// // Get a vault
// app.get("/vaults/:vaultId", async (req, res) => {
//   const vault = await prisma.vault.findUnique({
//     select: {
//       shelves: true,
//     },
//     where: {
//       id: req.params.vaultId,
//     },
//   });

//   res.json(vault);
// });

// Shelfcopies
const shelfcopies = new Map<string, string>();
const shelfcopyids = new Map<string, string>();

app.get("/shelfcopy", async (req, res) => {
  const { vault, shelve, timeout } = req.query;

  const shelfContent = await prisma.shelf.findFirst({
    select: {
      id: true,
      content: true,
    },
    where: {
      vault_id: vault as string,
      label: shelve as string,
    },
  });

  if (shelfContent) {
    if (shelfcopies.has(shelfContent.id)) {
      // There already is a public shelfcopy of this shelf

      // Return existsing uuid
      const uuid = shelfcopies.get(shelfContent.id);
      res.status(200).send(uuid);
    } else {
      // There is no public shelfcopy of this shelf yet

      // Create new shelfcopyies entry
      const uuid = randomUUID();
      shelfcopies.set(shelfContent.id, uuid);
      shelfcopyids.set(uuid, shelfContent.id);

      // Delete the shelfcopy after timout
      setTimeout(
        () => {
          const uuid = shelfcopies.get(shelfContent.id);
          if (uuid) {
            shelfcopies.delete(shelfContent.id);
            shelfcopyids.delete(uuid);
          }
        },
        timeout ? parseInt(timeout as string) : 10000
      );

      // Return generated uuid
      res.status(200).send(uuid);
    }
  } else {
    res.sendStatus(400);
  }
});

app.get("/shelfcopies/:uuid", async (req, res) => {
  if (shelfcopyids.has(req.params.uuid)) {
    const shelf = shelfcopyids.get(req.params.uuid);

    const shelfContent = await prisma.shelf.findFirst({
      select: {
        content: true,
      },
      where: {
        id: shelf,
      },
    });

    res.status(200).send(shelfContent?.content);
  } else res.sendStatus(404);
});

app.listen(3132);
