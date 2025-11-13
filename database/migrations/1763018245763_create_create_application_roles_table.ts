import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'application_role'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('application_id')
        .notNullable()
        .references('id')
        .inTable('applications')
        .onDelete('CASCADE')
      table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')

      table.unique(['application_id', 'role_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
