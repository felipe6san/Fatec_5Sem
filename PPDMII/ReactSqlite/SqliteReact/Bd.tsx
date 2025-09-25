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
    try {
        await database.execAsync(
            `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIOS (
            ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
            NOME_US VARCHAR(100),
            EMAIL_US VARCHAR(100) UNIQUE
            ); 
            `
        )
        console.log('Tabela criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar a tabela:', error);
    }
}

async function InserirDados(db: SQLite.SQLiteDatabase, nome: string, email: string) {
    try {
        await db.runAsync(
            `
            INSERT INTO USUARIOS (NOME_US, EMAIL_US) VALUES (?, ?);
            `,
            [nome, email]
        );
        console.log('Dados inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }

}

async function selectTodos(db: SQLite.SQLiteDatabase) {
    try {
        let arrayReg = await db.getAllAsync("SELECT * FROM USUARIOS;");
        console.log(arrayReg);
    } catch (error) {
        console.error('Erro ao selecionar dados:', error);
    }
}

export { CriaBanco, CriaTabela, InserirDados, selectTodos };