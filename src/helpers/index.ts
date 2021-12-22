/**
 * Helper to obtain a trustable error reason from Prisma, Yapily, or any other service.
 */
export const useErrorParser = (err: Error): string => {
  return err.message ?? err.name
}
