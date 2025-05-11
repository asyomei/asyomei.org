interface WafOpts extends RequestInit {
  query?: typeof URLSearchParams extends new (arg: infer R) => any ? R : never
}

export async function waf(url: string, opts: WafOpts = {}) {
  const { headers: headersInit, query, ...rest } = opts

  if (query) {
    url = `${url}?${new URLSearchParams(query)}`
  }

  const headers = new Headers(headersInit)
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'asyomei.org/1.0')
  }

  return await fetch(url, {
    ...rest,
    headers,
  })
}
