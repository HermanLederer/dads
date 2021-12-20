import { randomUUID } from "crypto";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// Maps
const shelfcopies = new Map<string, string>();
const shelfcopyids = new Map<string, string>();

//
//
// Get a new shelfcopy
app.get("/shelfcopy", async (req, res) => {
  const { vault, shelf, timeout } = req.query;

  if (!vault || !shelf) {
    res.sendStatus(400);
    return;
  }

  const shelfContent = await prisma.shelf.findFirst({
    select: {
      id: true,
      label: true,
      content: true,
    },
    where: {
      vault_id: vault as string,
      label: shelf as string,
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

      // Create new shelfcopies entry
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

//
//
// Get data from a shelfcopy
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
