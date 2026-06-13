import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function handler(req, res) {
  const db = await open({
    filename: "./db/vacinas.db",
    driver: sqlite3.Database
  });

  const rows = await db.all("SELECT * FROM vacinacao");
  res.status(200).json(rows);
}
