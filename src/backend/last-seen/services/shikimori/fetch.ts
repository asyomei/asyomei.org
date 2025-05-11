import z from 'zod'
import { waf } from '~/backend/utils/waf'

const API_URL = 'https://shikimori.one/api/users/%s/history'

const Event = z.object({
  created_at: z.coerce.date(),
  description: z.string(),
  target: z.object({
    name: z.string(),
    url: z.string(),
  }),
})
  .transform(x => ({
    description: x.description,
    date: x.created_at,
    target: x.target.name,
    url: new URL(x.target.url, 'https://shikimori.one').toString(),
  }))

const ResponseSchema = z.array(Event).nonempty().transform(x => x.find(parse))

export async function fetchShikimori(userId: number) {
  const url = API_URL.replace('%s', String(userId))
  const resp = await waf(url, {
    query: { limit: '10' },
  })

  return ResponseSchema.parse(await resp.json())
}

function parse(x: { description: string }) {
  const desc = x.description.toLowerCase()

  const event = {
    'добавлено в список': 'added',
    'смотрю': 'watching',
    'читаю': 'reading',
    'пересматриваю': 'watching',
    'перечитываю': 'reading',
    'просмотрено': 'watched',
    'прочитано': 'read',
  }[desc]
  if (event) return x.description = event

  if (desc.startsWith('просмотрено и оцен')) return x.description = 'watched'
  if (desc.startsWith('прочитано и оцен')) return x.description = 'read'

  if (desc.startsWith('просмотрен')) return x.description = 'watching'
  if (desc.startsWith('прочитан')) return x.description = 'reading'
}
