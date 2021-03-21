exports.up = async function (knex) {
  return knex.schema.createTable('collection_point_items', table => {
    table.increments('id').primary();

    table.integer('collect_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('collection_point');

    table.integer('item_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('item');
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('collection_point_items');
}