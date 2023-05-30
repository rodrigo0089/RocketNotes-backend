exports.up = knex => knex.schema.createTable("tags", table => {
  //id da tag incrementado automaticamente 
  table.increments("id");
  table.text("name").notNullable();
  
  //pegar a chave estrangeira note_id da tabela notes. onDelete para a nota ser apagada junto com a nota
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
  //pegar a chave estrangeira user_id da tabela users
  table.integer("user_id").references("id").inTable("users");

});


exports.down = knex => knex.schema.dropTable("tags");
