/**
 * Helper to obtain a trustable error reason from Prisma, or any other service.
 */
export const useErrorParser = (err: Error): string => {
  return err.message ?? err.name
}

export const chunkArray = (array: any, size: number): any => {
  // if (array.length <= size) {
  //   return [array]
  // }
  // return [array.slice(0, size), ...chunkArray(array.slice(size), size)]
  const perChunk = size ?? 50

  return array.reduce((all: any, one: any, i: number) => {
    const ch = Math.floor(i / perChunk)
    all[ch] = [].concat(all[ch] || [], one)
    return all
  }, [])
}
export const delay = (ms: number) => new Promise((res) => setInterval(res, ms))
