exports.up = async function (knex) {
  return knex.schema.createTable('item', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('title').notNullable();
    table.string('information');
    table.boolean('isDonationItem').notNullable();
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('item');
}