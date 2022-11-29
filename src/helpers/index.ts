/**
 * Helper to obtain a trustable error reason from Prisma, or any other service.
 */
export const useErrorParser = (err: Error): string => {
  return err.message ?? err.name
}

export const chunkArray = (array: any, size: number): any => {
  if (array.length <= size) {
    return [array]
  }
  return [array.slice(0, size), ...chunkArray(array.slice(size), size)]
}
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
