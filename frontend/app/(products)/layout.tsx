import dynamic from 'next/dynamic'
import Header from './components/Header'

const CSRWrapper = dynamic(() => import('./components/CSRWrapper'), {
  ssr: false,
})

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CSRWrapper>
      <Header />
      {children}
    </CSRWrapper>
  )
}
