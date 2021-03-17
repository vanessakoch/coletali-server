exports.up = async function (knex) {
  return knex.schema.createTable('donation_point_items', table => {
    table.increments('id').primary();

    table.integer('donate_id')
      .notNullable()
      .references('id')
      .inTable('donation_point');

    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('item');
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('donation_point_items');
}