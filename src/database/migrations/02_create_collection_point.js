exports.up = async function (knex) {
  return knex.schema.createTable('collection_point', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.bigInteger('whatsapp').notNullable();

    table.integer('address_id')
      .notNullable()
      .references('id')
      .inTable('address');

    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('user');
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('collection_point');
}