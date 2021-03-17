exports.up = async function (knex) {
  return knex.schema.createTable('address', table => {
    table.increments('id').primary();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.integer('number').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('address')
}