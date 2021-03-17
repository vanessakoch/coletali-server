exports.up = async function (knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id').primary();
    table.string('full_name').notNullable();
    table.string('cpf', 11).notNullable();
    table.string('email').notNullable().unique();
    table.string('password', 8).notNullable();
    table.integer('phone').notNullable();
    table.boolean('is_admin').notNullable();
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('user');
}