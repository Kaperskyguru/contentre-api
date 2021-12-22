import { environment } from '@helpers/environment'
import bcrypt from 'bcrypt'

/**
 * Uses `bcrypt` to hash the provided password using the pre-configured salt rounds.
 * @param password The plain text password to be hashed.
 * @returns A promise to be either resolved with the encrypted password or rejected with an `Error`.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(environment.auth.saltRounds)
  return bcrypt.hash(password, salt)
}

/**
 * Uses `bcrypt` to compare a plain text password with an already hashed one.
 * @param password The plain text password to be compared.
 * @param hashed The hashed password already created in the past.
 * @returns A promise to be either resolved with the comparison result or rejected with an `Error`.
 */
export const comparePassword = async ({
  password,
  hashed
}: {
  password: string
  hashed: string
}): Promise<boolean> => {
  return bcrypt.compare(password, hashed)
}
