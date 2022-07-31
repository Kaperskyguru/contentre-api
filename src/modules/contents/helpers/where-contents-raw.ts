import { Maybe, ContentFiltersInput, User } from '@modules-types'
import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns'

const dateWithoutTimezone = (date: string | Date): Date => {
  const dt = new Date(date)
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000)
}

const formatDateWithoutTimezone = (date: string | Date): string => {
  return format(dateWithoutTimezone(date), 'yyyy-MM-dd')
}

export const whereContentRaw = (
  user: User,
  filters?: Maybe<ContentFiltersInput>
): {
  query: string
  args: unknown[]
} => {
  let fromDateMethod = null
  let toDateMethod = null

  const filterDateBy = 'month'

  if (filters?.fromDate && filters?.toDate) {
    fromDateMethod =
      filterDateBy !== 'month'
        ? formatDateWithoutTimezone(filters.fromDate)
        : formatDateWithoutTimezone(
            startOfMonth(dateWithoutTimezone(filters.fromDate))
          )
    toDateMethod =
      filterDateBy !== 'month'
        ? formatDateWithoutTimezone(filters.toDate)
        : formatDateWithoutTimezone(endOfMonth(parseISO(filters.toDate)))
  }

  const args = [
    user.id, // $1
    filters?.terms ? filters?.terms.toString() : null, // $2
    filters?.categories?.length ? filters?.categories?.join(',') : null, // $3
    filters?.fromDate ? new Date(fromDateMethod!) : null, // $4
    filters?.toDate ? new Date(toDateMethod!) : null, // $5
    filters?.fromAmount?.toString() ?? null, // $6
    filters?.toAmount?.toString() ?? null, // $7

    filters?.clients?.length ? filters?.clients?.join(',') : null // $8
    // filters?.tags?.length ? filters?.tags?.join(',') : null, // $9
    // filters?.topics?.length ? filters?.topics?.join(',') : null // $9
  ]

  /**
   * c => Content
   * cl => Client
   * cat => Category
   * ta => Tags
   * t => Topics
   *
   * ta."name" ILIKE '%' || $2 || '%' OR
   */

  const query = `
    AND c."userId" = $1
    AND c."notebookId" IS NULL
    
    AND (
      ${args[1] === null ? 'True' : 'False'} OR
      c."title" ILIKE '%' || $2 || '%' OR
      c."excerpt" ILIKE '%' || $2 || '%' OR
      c."content" ILIKE '%' || $2 || '%' OR
      cat."name" ILIKE '%' || $2 || '%' OR

      
      cl."name" ILIKE '%' || $2 || '%'
    )
    
    AND (
      ${args[2] === null ? 'True' : 'False'}  OR
      cat."name" = ANY(STRING_TO_ARRAY($3, ','))
    )

    AND (
        ${args[3] === null ? 'True' : 'False'} OR
        DATE_TRUNC('${filterDateBy}', c."createdAt") >=
          DATE_TRUNC('${filterDateBy}', $4::TIMESTAMP)
      )
      AND (
        ${args[4] === null ? 'True' : 'False'} OR
        DATE_TRUNC('${filterDateBy}', c."createdAt") <=
          DATE_TRUNC('${filterDateBy}', $5::TIMESTAMP)
      )

      AND (
        c."amount" BETWEEN SYMMETRIC
          COALESCE($6::TEXT::DOUBLE PRECISION, '-Infinity') AND
          COALESCE($7::TEXT::DOUBLE PRECISION, 'Infinity')
    )

      AND (
        ${args[7] === null ? 'True' : 'False'}  OR
        cl."name" = ANY(STRING_TO_ARRAY($8, ','))
      )

      

      
  `

  return {
    query,
    args
  }
}

/**
 *     AND (
      ${args[8] === null ? 'True' : 'False'} OR
      DATE_TRUNC('${filterDateBy}', t."transactionDate") >=
        DATE_TRUNC('${filterDateBy}', $9::TIMESTAMP)
    )
    AND (
      ${args[9] === null ? 'True' : 'False'} OR
      DATE_TRUNC('${filterDateBy}', t."transactionDate") <=
        DATE_TRUNC('${filterDateBy}', $10::TIMESTAMP)
    )

        AND (
      ${args[7] === null ? 'True' : 'False'} OR
      t."currency"::VARCHAR = ANY(STRING_TO_ARRAY($8, ','))
    )


    AND (
        ${args[8] === null ? 'True' : 'False'}  OR
        ta."name" = ANY(STRING_TO_ARRAY($9, ','))
      )
 */

export default whereContentRaw
