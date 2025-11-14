import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Group from '#models/group'
import Role from '#models/role'

export default class Application extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare clientId: string

  @column({ serializeAs: null })
  declare clientSecret: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare redirectUris: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'application_user',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Group, {
    pivotTable: 'application_group',
  })
  declare groups: ManyToMany<typeof Group>

  @manyToMany(() => Role, {
    pivotTable: 'application_role',
  })
  declare roles: ManyToMany<typeof Role>
}
