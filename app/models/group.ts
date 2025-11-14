import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Role from '#models/role'
import Application from '#models/application'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare isSuperuser: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'group_user',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Role, {
    pivotTable: 'group_role',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Application, {
    pivotTable: 'application_group',
  })
  declare applications: ManyToMany<typeof Application>
}
