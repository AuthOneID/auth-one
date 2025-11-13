import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Group from '#models/group'
import Role from '#models/role'
import Application from '#models/application'

const AuthFinder = withAuthFinder(() => hash.use('argon'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullName: string | null

  @column()
  declare email: string | null

  @column()
  declare username: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Group, {
    pivotTable: 'group_user',
  })
  declare groups: ManyToMany<typeof Group>

  @manyToMany(() => Role, {
    pivotTable: 'role_user',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Application, {
    pivotTable: 'application_user',
  })
  declare applications: ManyToMany<typeof Application>
}
