import {
  // CashflowFiltersInput,
  Maybe,
  ContentFiltersInput
} from '@modules-types'
import {
  addMonths,
  differenceInDays,
  differenceInMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  getMonth,
  parseISO,
  startOfMonth,
  subMonths
} from 'date-fns'

type DateIntervalsResult = {
  toDate: Date
  fromDate: Date
  monthsInterval: number[]
  allMonthsInterval: number[]
  daysInterval: number[]
}

/**
 * Use filter strings or duration number to return date interval objects.
 * @example getDateIntervals({duration:6});
 * @example getDateIntervals({toDate: '2021-07-07T16:39:35.756Z'});
 */
export const getDateIntervals = (
  filters?: Maybe<ContentFiltersInput>
): DateIntervalsResult => {
  let toDate
  let fromDate
  const DURATION = 11
  const duration = filters?.duration ? filters?.duration - 1 : DURATION

  if (filters?.fromDate && !filters.toDate) {
    // When user select only fromDate
    fromDate = parseISO(filters.fromDate)
    toDate = addMonths(fromDate, duration)

    // When user select only fromDate less than 6 months interval
    if (getMonth(toDate) !== getMonth(new Date())) {
      toDate = endOfMonth(parseISO(new Date().toISOString()))
    }
  } else if (filters?.toDate && !filters.fromDate) {
    // When user select only toDate without starting date.
    toDate = parseISO(filters.toDate)
    fromDate = startOfMonth(subMonths(toDate, duration))
  } else if (filters?.fromDate && filters?.toDate) {
    // When user select fromDate and toDate.
    toDate = parseISO(filters.toDate)
    fromDate = parseISO(filters.fromDate)

    // When user select fromDate and toDate greater than 6 months interval
    // if (differenceInMonths(toDate, fromDate) > duration + 1) {
    //   throw new Error(`you need at most ${duration + 1} months of difference`)
    // }
  } else {
    // When user does not select any date range.
    if (filters && filters.daily) {
      toDate = parseISO(new Date().toISOString())
    } else {
      toDate = filters?.toDate
        ? parseISO(filters.toDate)
        : parseISO(new Date().toISOString())
    }

    fromDate = filters?.fromDate
      ? startOfMonth(parseISO(filters.fromDate))
      : startOfMonth(
          subMonths(
            toDate,
            filters?.duration ? filters?.duration - 1 : DURATION
          )
        )
  }

  const monthsInterval = eachMonthOfInterval({
    start: fromDate,
    end: toDate
  }).map((date) =>
    Number(
      `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`
    )
  )
  let today = new Date()
  if (toDate !== today) {
    today = endOfMonth(today)
  }
  const daysInterval = eachDayOfInterval({
    start: subMonths(toDate, 3),
    end: toDate
  })
    .map((date) =>
      Number(
        `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
      )
    )
    .filter((item) => {
      const todayNumber = Number(
        `${today.getFullYear()}${(today.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`
      )
      return item <= todayNumber
    })
  const allMonthsInterval = eachMonthOfInterval({
    start: fromDate,
    end: parseISO(new Date().toISOString())
  }).map((date) =>
    Number(
      `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`
    )
  )

  return {
    toDate: differenceInDays(toDate, new Date()) > 0 ? new Date() : toDate,
    fromDate,
    monthsInterval,
    allMonthsInterval,
    daysInterval
  }
}

export default getDateIntervals
