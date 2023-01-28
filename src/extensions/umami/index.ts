import { environment } from '@/helpers/environment'
import getDateIntervals from '@/helpers/get-date-intervals'
import axios from 'axios'
import { getTime, parseISO } from 'date-fns'
import express from 'express'

const HOUR_PERIODS = ['1h', '1hour', '60min', '60minutes'] as const
type HourPeriod = typeof HOUR_PERIODS[number]
const DAY_PERIODS = ['1d', '1day', '24h', '24hours'] as const
type DayPeriod = typeof DAY_PERIODS[number]
const WEEK_PERIODS = ['7d', '7days', '1w', '1week'] as const
type WeekPeriod = typeof WEEK_PERIODS[number]
const MONTH_PERIODS = ['31d', '31days', '1m', '1month'] as const
type MonthPeriod = typeof MONTH_PERIODS[number]

type TimePeriod = HourPeriod | DayPeriod | WeekPeriod | MonthPeriod

export const convertPeriodToTime = (period: TimePeriod = '24h') => {
  let delta: number
  if (HOUR_PERIODS.includes(period as HourPeriod)) {
    delta = 60 * 60 * 1000
  } else if (DAY_PERIODS.includes(period as DayPeriod)) {
    delta = 24 * 60 * 60 * 1000
  } else if (WEEK_PERIODS.includes(period as WeekPeriod)) {
    delta = 7 * 24 * 60 * 60 * 1000
  } else if (MONTH_PERIODS.includes(period as MonthPeriod)) {
    delta = 31 * 24 * 60 * 60 * 1000
  } else {
    throw `Unexpected period provided. Accepted values are : ${[
      ...HOUR_PERIODS,
      ...DAY_PERIODS,
      ...WEEK_PERIODS,
      ...MONTH_PERIODS
    ]}`
  }
  return {
    start_at: Date.now() - delta,
    end_at: Date.now()
  }
}

export const createWebsite = async ({
  domain,
  owner = undefined,
  name
}: {
  name: string
  owner?: string | number
  domain: string
}) => {
  const endpoint = `${environment.umami.baseURL}/websites`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  const body = {
    domain,
    owner,
    name
  }

  try {
    const response = await axios({
      url: endpoint,
      method: 'POST',
      data: JSON.stringify(body),
      headers: {
        ...headers
      }
    })

    const { data } = response
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getWebsite = async ({ id }: { id: string }) => {
  const endpoint = `${environment.umami.baseURL}/websites/${id}`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  try {
    const response = await axios.get(endpoint, {
      withCredentials: true,
      headers: {
        ...headers
      }
    })
    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

export const getUserWebsites = async (options?: {
  user_id?: string
  include_all?: boolean
}) => {
  const endpoint = `${environment.umami.baseURL}/websites`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  try {
    const response = await axios.get(endpoint, {
      params: {
        ...options
      },
      headers: {
        ...headers
      }
    })
    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

export const getUser = async (options: { id: string }) => {
  const endpoint = `${environment.umami.baseURL}/accounts/${options?.id!}`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  try {
    const response = await axios.get(endpoint, {
      params: {
        id: options.id
      },
      headers: {
        ...headers
      }
    })
    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

export const getPageviews = async (
  { websiteUuid }: { websiteUuid: string },
  options?: any
) => {
  const endpoint = `${environment.umami.baseURL}/websites/${websiteUuid}/pageviews`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  try {
    // if (options?.period === 'all') {
    //   const response = await axios.get(endpoint, {
    //     params: {
    //       unit: options?.unit ?? 'day',
    //       tz: options?.tz ?? 'Africa/Lagos'
    //     },
    //     headers: {
    //       ...headers
    //     }
    //   })

    //   const { data } = response
    //   return data
    // }

    const response = await axios.get(endpoint, {
      params: {
        ...getDateTime(options),
        unit: options?.unit ?? 'day',
        tz: options?.tz ?? 'Africa/Lagos',
        url: options?.url,
        referrer: options?.referrer,
        os: options?.os,
        browser: options?.browser,
        device: options?.device,
        country: options?.country
      },
      headers: {
        ...headers
      }
    })
    const { data } = response
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getStats = async (
  { websiteUuid }: { websiteUuid: string },
  options?: any
) => {
  const endpoint = `${environment.umami.baseURL}/websites/${websiteUuid}/stats`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  try {
    if (options.period === 'all') {
      const response = await axios.get(endpoint, {
        headers: {
          ...headers
        }
      })

      const { data } = response
      return data
    }

    const response = await axios.get(endpoint, {
      params: {
        ...getDateTime(options),
        unit: options?.unit ?? 'day',
        tz: options?.tz ?? 'Africa/Lagos',
        url: options?.url,
        referrer: options?.referrer,
        os: options?.os,
        browser: options?.browser,
        device: options?.device,
        country: options?.country
      },
      headers: {
        ...headers
      }
    })
    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

export const createAccount = async ({
  username,
  password,
  account_uuid = undefined
}: {
  username: string
  password: string
  account_uuid?: string
}) => {
  const endpoint = `http://localhost:3000/api/accounts`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${environment.umami.token}`
  }

  const body = {
    username,
    password,
    account_uuid
  }

  try {
    const response = await axios({
      url: endpoint,
      method: 'POST',
      data: JSON.stringify(body),
      headers: {
        ...headers
      }
    })

    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

export const login = async (req: express.Request) => {
  const endpoint = `http://localhost:3000/api/auth/login`
  const headers = {
    'Content-Type': 'application/json'
  }

  const body = {
    username: req.body?.username ?? 'admin',
    password: req.body?.password ?? 'umami'
  }

  try {
    const response = await axios({
      url: endpoint,
      method: 'GET',
      data: JSON.stringify(body),
      headers: {
        ...headers
      }
    })

    const { data } = response
    return data
  } catch (error) {
    throw error
  }
}

const getDateTime = (options: any) => {
  if (options?.fromDate || options?.toDate) {
    if (options.period === 'all') {
      return {
        start_at: getTime(options.fromDate),
        end_at: getTime(options.toDate)
      }
    }
    const { toDate, fromDate } = getDateIntervals({
      ...options
    })

    return {
      start_at: getTime(fromDate),
      end_at: getTime(toDate)
    }
  } else {
    return {}
  }
}
