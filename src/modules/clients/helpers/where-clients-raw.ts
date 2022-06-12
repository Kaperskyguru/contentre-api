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
    filters?.fromDate ? new Date(fromDateMethod!) : null, // $3
    filters?.toDate ? new Date(toDateMethod!) : null, // $4
    // filters?.fromAmount?.toString() ?? null, // $5
    // filters?.toAmount?.toString() ?? null, // $6
    filters?.clients?.length ? filters?.clients?.join(',') : null // $7
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
    AND cl."userId" = $1
    
    AND (
      ${args[1] === null ? 'True' : 'False'} OR
      cl."name" ILIKE '%' || $2 || '%'
    )

    AND (
        ${args[2] === null ? 'True' : 'False'} OR
        DATE_TRUNC('${filterDateBy}', cl."createdAt") >=
          DATE_TRUNC('${filterDateBy}', $3::TIMESTAMP)
      )
    AND (
        ${args[3] === null ? 'True' : 'False'} OR
        DATE_TRUNC('${filterDateBy}', cl."createdAt") <=
            DATE_TRUNC('${filterDateBy}', $4::TIMESTAMP)
    )

    AND (
        ${args[4] === null ? 'True' : 'False'}  OR
        cl."name" = ANY(STRING_TO_ARRAY($5, ','))
    )
      
  `

  return {
    query,
    args
  }
}

export default whereContentRaw
