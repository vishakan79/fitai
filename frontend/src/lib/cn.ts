/** Joins truthy class names. Small replacement for clsx so we avoid another dependency. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
