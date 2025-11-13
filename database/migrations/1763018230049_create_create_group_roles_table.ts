import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'group_role'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('group_id').notNullable().references('id').inTable('groups').onDelete('CASCADE')
      table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')

      table.unique(['group_id', 'role_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
