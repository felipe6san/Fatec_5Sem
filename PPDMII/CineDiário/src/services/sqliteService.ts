import * as SQLite from 'expo-sqlite';
import { Production } from '../types/Production';

let db: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('catalogo_filmes.db');
  }
  return db;
};

export const initializeSQLiteDatabase = async (): Promise<void> => {
  const database = await getDatabase();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS productions (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      anoLancamento INTEGER NOT NULL,
      genero TEXT NOT NULL,
      tipo TEXT NOT NULL,
      minhaNotas INTEGER NOT NULL,
      ondeAssistiu TEXT NOT NULL,
      posterUrl TEXT,
      resumo TEXT,
      dateCriacao TEXT NOT NULL,
      dataAtualizacao TEXT NOT NULL
    )
  `);
};

export const addProduction = async (production: Production): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO productions (id, titulo, anoLancamento, genero, tipo, minhaNotas, ondeAssistiu, posterUrl, resumo, dateCriacao, dataAtualizacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      production.id,
      production.titulo,
      production.anoLancamento,
      production.genero,
      production.tipo,
      production.minhaNotas,
      production.ondeAssistiu,
      production.posterUrl || '',
      production.resumo || '',
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
};

export const getAllProductions = async (): Promise<Production[]> => {
  const database = await getDatabase();
  const result = await database.getAllAsync<Production>(
    `SELECT * FROM productions ORDER BY dateCriacao DESC`
  );
  return result;
};

export const getProductionById = async (id: string): Promise<Production | null> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<Production>(
    `SELECT * FROM productions WHERE id = ?`,
    [id]
  );
  return result || null;
};

export const updateProduction = async (id: string, production: Partial<Production>): Promise<void> => {
  const database = await getDatabase();
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (production.titulo !== undefined) {
    updates.push('titulo = ?');
    values.push(production.titulo);
  }
  if (production.anoLancamento !== undefined) {
    updates.push('anoLancamento = ?');
    values.push(production.anoLancamento);
  }
  if (production.genero !== undefined) {
    updates.push('genero = ?');
    values.push(production.genero);
  }
  if (production.tipo !== undefined) {
    updates.push('tipo = ?');
    values.push(production.tipo);
  }
  if (production.minhaNotas !== undefined) {
    updates.push('minhaNotas = ?');
    values.push(production.minhaNotas);
  }
  if (production.ondeAssistiu !== undefined) {
    updates.push('ondeAssistiu = ?');
    values.push(production.ondeAssistiu);
  }
  if (production.posterUrl !== undefined) {
    updates.push('posterUrl = ?');
    values.push(production.posterUrl);
  }
  if (production.resumo !== undefined) {
    updates.push('resumo = ?');
    values.push(production.resumo);
  }

  updates.push('dataAtualizacao = ?');
  values.push(new Date().toISOString());

  values.push(id);

  await database.runAsync(
    `UPDATE productions SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
};

export const deleteProduction = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `DELETE FROM productions WHERE id = ?`,
    [id]
  );
};
