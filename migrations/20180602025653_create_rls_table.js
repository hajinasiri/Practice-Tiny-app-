
exports.up = function(knex, Promise) {
  return knex.schema.createTable('urls', (table) => {
    table.increments();
    table.timestamps();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('short-url').unique().notNullable();
    table.string('long-url').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('urls');

};
