import { HttpContext } from '@adonisjs/core/http'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import vine from '@vinejs/vine'

const paginationValidator = vine.compile(
  vine.object({
    sort: vine
      .string()
      .transform((val) =>
        val && typeof val === 'string'
          ? val.startsWith('-')
            ? { column: val.substring(1), order: 'desc' as const }
            : { column: val, order: 'asc' as const }
          : undefined
      )
      .optional(),
    page_size: vine
      .number()
      .min(1)
      .max(100)
      .parse((x) => x || 10),
    page: vine
      .number()
      .min(1)
      .parse((x) => x || 1),
    search: vine
      .string()
      .parse((x) => (typeof x === 'string' && x.length > 2 ? x : undefined))
      .optional(),
  })
)

export const getPaginatedResult = async <T>(
  request: HttpContext['request'],
  query: DatabaseQueryBuilderContract<any> | ModelQueryBuilderContract<any, any>,
  options?: { defaultSort: [string, 'asc' | 'desc']; searchColumns?: string[] }
) => {
  const pagination = await paginationValidator.validate(request.all())

  if (pagination.search) {
    query.where((qs) => {
      options?.searchColumns?.map((column) => {
        qs.orWhere(column, 'ilike', `%${pagination.search}%`)
      })
    })
  }

  if (pagination.sort) {
    query.orderBy(pagination.sort.column, pagination.sort.order)
  } else {
    if (options?.defaultSort) {
      query.orderBy(options.defaultSort[0], options.defaultSort[1])
    }
  }

  const result = await query.paginate(pagination.page, pagination.page_size)
  return {
    data:
      query instanceof ModelQueryBuilder
        ? (result.all().map((x) => ({ ...x.serialize(), ...x.$extras })) as T[])
        : (result.all() as T[]),
    pagination: { total: result.getMeta().total as number },
  }
}
