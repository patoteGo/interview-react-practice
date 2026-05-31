import http from 'node:http'

let products = [
  { id: 'p1', name: 'Keyboard', price: 120, inStock: true },
  { id: 'p2', name: 'Mouse', price: 45, inStock: true },
  { id: 'p3', name: 'Monitor', price: 260, inStock: false },
]

const json = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return json(res, 404, { message: 'Not found' })
  if (req.method === 'OPTIONS') return json(res, 200, {})

  if (req.url === '/health' && req.method === 'GET') return json(res, 200, { ok: true })
  if (req.url === '/api/products' && req.method === 'GET') return setTimeout(() => json(res, 200, products), 300)

  if (req.url === '/api/products' && req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    const payload = JSON.parse(body || '{}')
    const product = {
      id: `p${Date.now()}`,
      name: payload.name ?? 'New product',
      price: Number(payload.price ?? 0),
      inStock: Boolean(payload.inStock ?? true),
    }
    products = [product, ...products]
    return json(res, 201, product)
  }

  if (req.url.startsWith('/api/products/') && req.method === 'PATCH') {
    const id = req.url.split('/').pop()
    let body = ''
    for await (const chunk of req) body += chunk
    const payload = JSON.parse(body || '{}')
    products = products.map((product) => (product.id === id ? { ...product, ...payload } : product))
    const product = products.find((item) => item.id === id)
    return json(res, 200, product ?? { message: 'Not found' })
  }

  return json(res, 404, { message: 'Not found' })
})

server.listen(4002, () => {
  console.log('TanStack Query API on http://localhost:4002')
})
