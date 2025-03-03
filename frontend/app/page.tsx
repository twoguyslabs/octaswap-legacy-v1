import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/staking')

  return null
}
