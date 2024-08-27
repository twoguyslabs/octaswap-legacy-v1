export async function GET() {
  const res = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=24261`, {
    headers: {
      'Content-Type': 'application/json',
      'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
  })
  const data = await res.json()
  return Response.json(data)
}
