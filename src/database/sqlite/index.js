const sqlite3 = require("sqlite3");//essa é o drive/versão do banco de dados
const sqlite = require("sqlite");//essa é o que vai se conectar com o banco de dados
const path = require("path");

async function sqliteConnection(){
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),//filename vai dizer onde o arquivo vai ficar salvo
    driver: sqlite3.Database
  });

  return database;
}

module.exports = sqliteConnection;