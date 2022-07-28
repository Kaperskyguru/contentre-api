import whereContents from '@/modules/contents/helpers/where-contents'
import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetNotesArgs, NoteResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereNotes from '../helpers/where-notes'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetNotesArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<NoteResponse> => {
  logQuery('getNotes %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where = whereContents(user, filters)

    const noteWithTotal = await prisma.content.count({
      where: { ...where, status: 'DRAFT' },
      select: { id: true }
    })
    if (!filters?.terms) {
      return {
        notes: await prisma.content.findMany({
          where: { ...where, status: 'DRAFT' },
          orderBy: [
            filters?.sortBy
              ? filters.sortBy === 'title'
                ? { title: 'desc' }
                : filters.sortBy === 'createdAt'
                ? { createdAt: 'desc' }
                : { title: 'desc' }
              : { title: 'desc' }
          ],
          take: size ?? 30,
          skip: skip ?? 0
        }),

        meta: {
          total: noteWithTotal.id ?? 0
        }
      }
    }

    const notesStartsWith = await prisma.content.findMany({
      where: {
        title: { startsWith: filters.terms, mode: 'insensitive' },
        ...where,
        status: 'DRAFT'
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'title'
            ? { title: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { title: 'desc' }
          : { title: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    const notesContains = await prisma.content.findMany({
      where: {
        title: { contains: filters.terms, mode: 'insensitive' },
        ...where,
        status: 'DRAFT'
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'title'
            ? { title: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { title: 'desc' }
          : { title: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    return {
      meta: {
        total: noteWithTotal.id ?? 0
      },
      notes: [...notesStartsWith, ...notesContains]
    }
  } catch (e) {
    logError('getNotes %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
