exports.up = async function (knex) {
  return knex.schema.createTable('address', table => {
    table.increments('id').primary();
    table.float('latitude', 14, 10).notNullable();
    table.float('longitude', 14, 10).notNullable();
    table.integer('number').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('address')
}