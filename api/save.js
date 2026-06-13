import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function handler(req, res) {
  const db = await open({
    filename: "./db/vacinas.db",
    driver: sqlite3.Database
  });

  if (req.method === "POST") {
    const { numero, vacina1, vacina2 } = req.body;

    await db.run(
      "UPDATE vacinacao SET vacina1 = ?, vacina2 = ? WHERE numero = ?",
      [vacina1 ? 1 : 0, vacina2 ? 1 : 0, numero]
    );

    res.status(200).json({ message: "Dados atualizados com sucesso!" });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
