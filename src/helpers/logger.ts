import { debug } from 'debug'

export const logInfo = debug('api:info')
export const logError = debug('api:error')

export const logResolver = debug('api:field-resolver')
export const logQuery = debug('api:query')
export const logMutation = debug('api:mutation')
export const logHelper = debug('api:helper')
