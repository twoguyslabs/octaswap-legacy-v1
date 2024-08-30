import { OCS_ADDRESS } from '@/contracts/ocs'
import { useEffect, useState } from 'react'

export function useOcsPrice() {
  const [ocsPrice, setOcsPrice] = useState(0)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(
          `https://api.geckoterminal.com/api/v2/simple/networks/octaspace/token_price/${OCS_ADDRESS}`,
        )
        const data = await response.json()
        setOcsPrice(data.data.attributes.token_prices[OCS_ADDRESS])
      } catch (error) {
        console.error('Failed to fetch OCS price:', error)
      }
    }
    fetchPrice()
  }, [])

  return ocsPrice
}
