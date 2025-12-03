import * as SQLite from "expo-sqlite";

async function criaBanco() {
  try {
    const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync(
      "fatecVotorantim.db"
    );
    console.log("Banco de dados criado com sucesso!");
    return db;
  } catch (error) {
    console.log("Erro ao criar o banco de dados:", error);
  }
}

async function criaTabela(db: SQLite.SQLiteDatabase) {
  const query = `PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS USUARIO (
        ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
        NOME_US VARCHAR(100) NOT NULL,
        EMAIL_US VARCHAR(100) UNIQUE NOT NULL
        );`;
  try {
    await db.execAsync(query);
    console.log("Tabela criada com sucesso!");
  } catch (error) {
    console.log("Erro ao criar a tabela:", error);
  }
}

async function inserirDados(
  db: SQLite.SQLiteDatabase,
  nome: string, email: string
) {
  const query = `INSERT INTO USUARIO (NOME_US, EMAIL_US) VALUES (?, ?)`;
  try {
    await db.runAsync(query, [nome, email]);
    console.log("Dados inseridos com sucesso!");
  } catch (error) {
    console.log("Erro ao inserir dados:", error);
  }
}

async function listarDados(db: SQLite.SQLiteDatabase) {
  const query = `SELECT * FROM USUARIO`;
  try {
    const results = await db.getAllAsync(query);
    console.log("Dados listados com sucesso!");
    return results;
  } catch (error) {
    console.log("Erro ao listar dados:", error);
  }
}

async function deletaUsuario(db: SQLite.SQLiteDatabase, id: number) {
  const query = `DELETE FROM USUARIO WHERE ID_US = ?`;
  try {
    await db.runAsync(query, [id]);
    console.log("Usuário deletado com sucesso!");
  } catch (error) {
    console.log("Erro ao deletar usuário:", error);
  }
}

export { criaBanco, criaTabela, inserirDados, listarDados, deletaUsuario };
