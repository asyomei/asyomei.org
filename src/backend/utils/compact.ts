import type { ConditionalExcept } from 'type-fest'

type Compacted<T> = ConditionalExcept<T, undefined>

export function compact<T>(arr: (T | undefined)[]): T[]
export function compact<T extends object>(obj: T): Compacted<T>
export function compact<T extends object>(obj: T) {
  if (Array.isArray(obj)) return obj.filter(x => x !== undefined)

  const res: Record<string, any> = {}

  for (const k in obj) {
    if (obj[k] !== undefined) res[k] = obj[k]
  }

  return res as Compacted<T>
}
