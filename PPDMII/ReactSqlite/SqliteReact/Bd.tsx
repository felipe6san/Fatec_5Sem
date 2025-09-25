import * as SQLite from 'expo-sqlite'

async function CriaBanco() {
    try {
        const db = await SQLite.openDatabaseAsync('fatecVotorantim.db');
        console.log('Banco de dados aberto com sucesso!');
        return db;
    } catch (error) {
        console.error('Erro ao abrir o banco de dados:', error);
    }
}

async function CriaTabela(database: SQLite.SQLiteDatabase) {
    try{
        await database.runAsync(
            `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS usuarios (
            ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
            NOME_US VARCHAR(100),
            EMAIL_US VARCHAR(100)
            ); 
            `
        )
        console.log('Tabela criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar a tabela:', error);
    }

}

export { CriaBanco, CriaTabela };