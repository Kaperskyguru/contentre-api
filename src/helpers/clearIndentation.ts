/**
 * Clear new lines (`\n`) and multiples spaces (`\s+`)
 * from the provided string, returning a new string as result.
 * @param this Original string instance to be cleared.
 */
export function clearIndentation(this: string): string {
  return this.replace(/\s+/g, ' ').replace(/\n/g, '').trim()
}

declare global {
  interface String {
    clearIndentation(): string
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.clearIndentation = clearIndentation

export default clearIndentation
