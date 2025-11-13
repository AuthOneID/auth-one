import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Group from '#models/group'
import Application from '#models/application'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'role_user',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Group, {
    pivotTable: 'group_role',
  })
  declare groups: ManyToMany<typeof Group>

  @manyToMany(() => Application, {
    pivotTable: 'application_role',
  })
  declare applications: ManyToMany<typeof Application>
}
