exports.up = knex => knex.schema.createTable("links", table => {
  //id da tag incrementado automaticamente 
  table.increments("id");
  table.text("url").notNullable();
  
  //pegar a chave estrangeira note_id da tabela notes. onDelete para a nota ser apagada junto com a nota
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");

  table.timestamp("created_at").default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("links");
